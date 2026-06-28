import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sessions = await db.session.findMany({
    where: { userId: session.user!.id! },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { flashcards: true, questions: true } },
    },
  });

  return NextResponse.json(sessions);
}
