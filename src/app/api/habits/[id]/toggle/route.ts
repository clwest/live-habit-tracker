import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { todayUTC } from "@/lib/date";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const habit = await prisma.habit.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });
  if (!habit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const date = todayUTC();
  const existing = await prisma.habitEntry.findUnique({
    where: { habitId_date: { habitId: id, date } },
    select: { id: true },
  });

  if (existing) {
    await prisma.habitEntry.delete({ where: { id: existing.id } });
    return NextResponse.json({ doneToday: false });
  }

  await prisma.habitEntry.create({ data: { habitId: id, date } });
  return NextResponse.json({ doneToday: true });
}
