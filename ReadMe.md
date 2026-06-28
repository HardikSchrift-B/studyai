# 🧠 StudyAI — AI-Powered Study Assistant

An AI-powered study tool that generates structured notes, flashcards, and quizzes from any topic or text in seconds — built with Next.js and Google Gemini.

**Live Demo:** [studyai-six-flax.vercel.app](https://studyai-six-flax.vercel.app)

## ✨ Features

- **AI Note Generation** — paste any topic or text and get structured, comprehensive notes with headings and bullet points
- **Flashcard Mode** — 6 auto-generated flashcards per session with flip animation to test your knowledge
- **Quiz Mode** — 5 multiple choice questions with instant feedback, score tracking, and retry option
- **Session History** — all study sessions saved to your account, accessible anytime
- **JWT Authentication** — secure login and registration with bcrypt password hashing
- **Responsive UI** — clean dark-themed interface that works on all screen sizes

## 🛠️ Tech Stack

| Layer | Tech |
| Framework | Next.js 15 (App Router) + TypeScript |
| AI | Google Gemini 2.5 Flash API |
| Styling | Tailwind CSS |
| Database | MySQL + Prisma ORM |
| Auth | NextAuth v5 (Auth.js) with JWT |
| Hosting | Vercel (frontend) + Railway (MySQL) |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # NextAuth handlers + register endpoint
│   │   ├── generate/      # Gemini AI content generation
│   │   └── sessions/      # CRUD for study sessions
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── dashboard/         # Main app — generate + session history
│   └── session/[id]/      # Session detail — notes, flashcards, quiz
├── lib/
│   ├── auth.ts            # NextAuth config
│   ├── db.ts              # Prisma singleton client
│   └── gemini.ts          # Gemini API integration
└── middleware.ts           # Route protection
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MySQL 8.0
- Google Gemini API key (free at aistudio.google.com)

### Installation

```bash
git clone https://github.com/HardikSchrift-B/studyai.git
cd studyai
npm install
cp .env.example .env
```

Fill in your `.env`:
```env
DATABASE_URL="mysql://root:password@localhost:3306/studyai"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-char-secret"
GEMINI_API_KEY="your-gemini-api-key"
```

```bash
npm run db:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🗄️ Database Schema

- **User** — id, name, email, password (bcrypt hashed)
- **Session** — id, title, topic, notes, userId
- **Flashcard** — id, front, back, sessionId
- **Question** — id, question, options (JSON), answer, sessionId

---

## 📌 Key Implementation Details

- Gemini API prompt engineered to return structured JSON with notes, flashcards, and questions in one call
- JSON response parsed and stored relationally across 3 tables
- Flashcard flip interaction built with pure React state (no external libraries)
- Quiz scoring computed client-side with instant per-option feedback
- Sessions cascade delete — removing a session removes all its flashcards and questions
- Route protection via NextAuth middleware on `/dashboard` and `/session` routes
