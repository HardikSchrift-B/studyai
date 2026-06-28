import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateStudyContent } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Login required" }, { status: 401 });

  try {
    const { topic } = await req.json();
    if (!topic || topic.trim().length < 5) {
      return NextResponse.json({ error: "Please enter a topic or text" }, { status: 400 });
    }

    const content = await generateStudyContent(topic);

    const studySession = await db.session.create({
      data: {
        title: content.title,
        topic: topic,
        notes: content.notes,
        userId: session.user!.id!,
        flashcards: {
          create: content.flashcards.map((f: any) => ({
            front: f.front,
            back: f.back,
          })),
        },
        questions: {
          create: content.questions.map((q: any) => ({
            question: q.question,
            options: JSON.stringify(q.options),
            answer: q.answer,
          })),
        },
      },
      include: { flashcards: true, questions: true },
    });

    return NextResponse.json(studySession);
  } catch (err) {
    console.error("[GENERATE]", err);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
