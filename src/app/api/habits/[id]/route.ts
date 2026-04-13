import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  let body: { title?: string; cadence?: "DAILY" | "WEEKLY" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const existing = await prisma.habit.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const data: { title?: string; cadence?: "DAILY" | "WEEKLY" } = {};
  if (typeof body.title === "string") {
    const title = body.title.trim();
    if (!title || title.length > 100) {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }
    data.title = title;
  }
  if (body.cadence === "DAILY" || body.cadence === "WEEKLY") {
    data.cadence = body.cadence;
  }

  const habit = await prisma.habit.update({
    where: { id },
    data,
    select: { id: true, title: true, cadence: true, createdAt: true },
  });

  return NextResponse.json({ habit });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.habit.findFirst({
    where: { id, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.habit.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
