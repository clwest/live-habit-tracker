import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { todayUTC } from "@/lib/date";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const habits = await prisma.habit.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    include: {
      entries: {
        where: { date: todayUTC() },
        select: { id: true },
      },
    },
  });

  return NextResponse.json({
    habits: habits.map((h) => ({
      id: h.id,
      title: h.title,
      cadence: h.cadence,
      createdAt: h.createdAt,
      doneToday: h.entries.length > 0,
    })),
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { title?: string; cadence?: "DAILY" | "WEEKLY" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = body.title?.trim();
  const cadence = body.cadence === "WEEKLY" ? "WEEKLY" : "DAILY";

  if (!title || title.length > 100) {
    return NextResponse.json(
      { error: "Title required (1–100 chars)" },
      { status: 400 },
    );
  }

  const habit = await prisma.habit.create({
    data: { userId: session.user.id, title, cadence },
    select: { id: true, title: true, cadence: true, createdAt: true },
  });

  return NextResponse.json({ habit }, { status: 201 });
}
