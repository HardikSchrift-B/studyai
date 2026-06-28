"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Brain, BookOpen, Layers, Trophy, ArrowLeft, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type Tab = "notes" | "flashcards" | "quiz";

type SessionData = {
  id: string;
  title: string;
  notes: string;
  flashcards: { id: string; front: string; back: string }[];
  questions: { id: string; question: string; options: string; answer: string }[];
};

export default function SessionPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [data, setData] = useState<SessionData | null>(null);
  const [tab, setTab] = useState<Tab>("notes");
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/sessions/${id}`)
      .then((r) => r.json())
      .then(setData);
  }, [id]);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center">
      <Brain className="animate-pulse text-violet-500" size={32} />
    </div>
  );

  const score = submitted
    ? data.questions.filter((q, i) => selected[i] === q.answer).length
    : 0;

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center gap-4">
        <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-2 font-display font-bold text-lg">
          <Brain className="text-violet-500" size={20} />
          {data.title}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit">
          {([
            { key: "notes", icon: BookOpen, label: "Notes" },
            { key: "flashcards", icon: Layers, label: `Flashcards (${data.flashcards.length})` },
            { key: "quiz", icon: Trophy, label: `Quiz (${data.questions.length})` },
          ] as const).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => { setTab(key); setSubmitted(false); setSelected({}); setCardIndex(0); setFlipped(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === key ? "bg-violet-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {/* Notes Tab */}
        {tab === "notes" && (
          <div className="card p-6 prose prose-invert prose-sm max-w-none">
            {data.notes.split("\n").map((line, i) => {
              if (line.startsWith("## ")) return <h2 key={i} className="text-white font-display font-bold text-lg mt-6 mb-2">{line.slice(3)}</h2>;
              if (line.startsWith("# ")) return <h1 key={i} className="text-white font-display font-bold text-xl mt-6 mb-2">{line.slice(2)}</h1>;
              if (line.startsWith("- ")) return <li key={i} className="text-slate-300 ml-4 list-disc">{line.slice(2)}</li>;
              if (line.trim() === "") return <br key={i} />;
              return <p key={i} className="text-slate-300">{line}</p>;
            })}
          </div>
        )}

        {/* Flashcards Tab */}
        {tab === "flashcards" && (
          <div className="space-y-6">
            <div
              className="card p-8 min-h-[220px] flex items-center justify-center cursor-pointer select-none hover:border-violet-700 transition-colors"
              onClick={() => setFlipped(!flipped)}
            >
              <div className="text-center space-y-3">
                <span className="text-xs text-slate-500 uppercase tracking-widest">
                  {flipped ? "Answer" : "Question"} · Click to flip
                </span>
                <p className="text-xl font-medium text-white">
                  {flipped ? data.flashcards[cardIndex].back : data.flashcards[cardIndex].front}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => { setCardIndex(Math.max(0, cardIndex - 1)); setFlipped(false); }}
                disabled={cardIndex === 0}
                className="btn-outline flex items-center gap-1 disabled:opacity-30"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <span className="text-sm text-slate-400">{cardIndex + 1} / {data.flashcards.length}</span>
              <button
                onClick={() => { setCardIndex(Math.min(data.flashcards.length - 1, cardIndex + 1)); setFlipped(false); }}
                disabled={cardIndex === data.flashcards.length - 1}
                className="btn-outline flex items-center gap-1 disabled:opacity-30"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Quiz Tab */}
        {tab === "quiz" && (
          <div className="space-y-6">
            {data.questions.map((q, qi) => {
              const options = JSON.parse(q.options) as string[];
              return (
                <div key={q.id} className="card p-5 space-y-4">
                  <p className="font-medium text-white">{qi + 1}. {q.question}</p>
                  <div className="space-y-2">
                    {options.map((opt) => {
                      const isSelected = selected[qi] === opt;
                      const isCorrect = submitted && opt === q.answer;
                      const isWrong = submitted && isSelected && opt !== q.answer;
                      return (
                        <button
                          key={opt}
                          disabled={submitted}
                          onClick={() => setSelected({ ...selected, [qi]: opt })}
                          className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                            isCorrect ? "bg-green-950 border-green-700 text-green-300" :
                            isWrong ? "bg-red-950 border-red-700 text-red-300" :
                            isSelected ? "bg-violet-950 border-violet-600 text-violet-200" :
                            "border-slate-700 hover:border-slate-500 text-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            {opt}
                            {isCorrect && <Check size={15} />}
                            {isWrong && <X size={15} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {!submitted ? (
              <button
                onClick={() => setSubmitted(true)}
                disabled={Object.keys(selected).length < data.questions.length}
                className="btn-primary w-full py-3 disabled:opacity-40"
              >
                Submit answers
              </button>
            ) : (
              <div className="card p-6 text-center space-y-2">
                <Trophy size={32} className="text-yellow-400 mx-auto" />
                <p className="text-2xl font-display font-bold">{score} / {data.questions.length}</p>
                <p className="text-slate-400 text-sm">
                  {score === data.questions.length ? "Perfect score! 🎉" :
                   score >= data.questions.length * 0.7 ? "Great job! 👏" : "Keep studying! 💪"}
                </p>
                <button onClick={() => { setSubmitted(false); setSelected({}); }} className="btn-outline text-sm mt-2">
                  Try again
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
