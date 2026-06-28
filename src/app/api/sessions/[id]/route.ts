import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const studySession = await db.session.findUnique({
    where: { id, userId: session.user.id! },
    include: { flashcards: true, questions: true },
  });

  if (!studySession) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(studySession);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  await db.session.delete({ where: { id, userId: session.user.id! } });
  return NextResponse.json({ success: true });
}
