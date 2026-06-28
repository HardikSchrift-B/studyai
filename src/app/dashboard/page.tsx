"use client";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Brain, Sparkles, BookOpen, LogOut, Trash2, ChevronRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

type StudySession = {
  id: string;
  title: string;
  topic: string;
  createdAt: string;
  _count: { flashcards: number; questions: number };
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<StudySession[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetchSessions();
  }, [status]);

  async function fetchSessions() {
    const res = await fetch("/api/sessions");
    const data = await res.json();
    setSessions(data);
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);

    const toastId = toast.loading("Generating your study material...");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic }),
    });

    const data = await res.json();
    setLoading(false);
    toast.dismiss(toastId);

    if (!res.ok) {
      toast.error(data.error || "Failed to generate");
      return;
    }

    toast.success("Study material ready!");
    setTopic("");
    router.push(`/session/${data.id}`);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this session?")) return;
    await fetch(`/api/sessions/${id}`, { method: "DELETE" });
    setSessions(sessions.filter((s) => s.id !== id));
    toast.success("Session deleted");
  }

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-violet-500" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display font-bold text-xl">
          <Brain className="text-violet-500" size={24} />
          StudyAI
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400">{session?.user?.name}</span>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Generate section */}
        <div className="card p-8 space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-display font-bold flex items-center gap-2">
              <Sparkles size={22} className="text-violet-400" />
              Generate study material
            </h1>
            <p className="text-slate-400 text-sm">Enter a topic or paste any text — AI will create notes, flashcards, and a quiz.</p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <textarea
              className="input min-h-[120px] resize-none"
              placeholder="e.g. 'Photosynthesis', 'The French Revolution', or paste an entire paragraph from your textbook..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-6 py-2.5">
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Generating...</>
              ) : (
                <><Sparkles size={16} /> Generate with AI</>
              )}
            </button>
          </form>
        </div>

        {/* Previous sessions */}
        {sessions.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display font-semibold text-lg">Your study sessions</h2>
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="card p-4 flex items-center gap-4 hover:border-slate-600 transition-colors">
                  <div className="w-10 h-10 bg-violet-950 rounded-lg flex items-center justify-center shrink-0">
                    <BookOpen size={18} className="text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{s.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {s._count.flashcards} flashcards · {s._count.questions} questions · {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-red-400 transition-colors">
                      <Trash2 size={15} />
                    </button>
                    <Link href={`/session/${s.id}`} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 transition-colors">
                      <ChevronRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {sessions.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            <Brain size={40} strokeWidth={1} className="mx-auto mb-3 text-slate-700" />
            <p>No sessions yet. Generate your first one above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
