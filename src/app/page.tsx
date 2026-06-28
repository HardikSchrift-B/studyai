import Link from "next/link";
import { Brain, Zap, BookOpen, Trophy } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-display font-bold text-xl">
          <Brain className="text-violet-500" size={24} />
          StudyAI
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-outline text-sm">Log in</Link>
          <Link href="/register" className="btn-primary text-sm">Get started free</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 space-y-8">
        <div className="inline-flex items-center gap-2 bg-violet-950 border border-violet-800 text-violet-300 text-xs font-medium px-3 py-1.5 rounded-full">
          <Zap size={12} /> Powered by Gemini AI
        </div>

        <h1 className="text-5xl sm:text-7xl font-display font-bold leading-tight max-w-3xl">
          Study smarter with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
            AI-generated
          </span>{" "}
          notes
        </h1>

        <p className="text-slate-400 text-lg max-w-xl">
          Paste any topic or text. Get structured notes, flashcards, and a quiz in seconds. Never struggle to study again.
        </p>

        <div className="flex gap-3">
          <Link href="/register" className="btn-primary px-8 py-3 text-base">
            Start for free
          </Link>
          <Link href="/login" className="btn-outline px-8 py-3 text-base">
            Log in
          </Link>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-4 mt-12 max-w-3xl w-full text-left">
          {[
            { icon: BookOpen, title: "Smart Notes", desc: "AI generates structured, comprehensive notes with headings and key points." },
            { icon: Brain, title: "Flashcards", desc: "6 auto-generated flashcards to test your knowledge on key concepts." },
            { icon: Trophy, title: "Quiz Mode", desc: "5 multiple choice questions to verify your understanding." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card p-5 space-y-3">
              <div className="w-9 h-9 bg-violet-950 rounded-lg flex items-center justify-center">
                <Icon size={18} className="text-violet-400" />
              </div>
              <h3 className="font-display font-semibold">{title}</h3>
              <p className="text-sm text-slate-400">{desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
