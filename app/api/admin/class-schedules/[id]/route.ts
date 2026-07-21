import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await requireSectionAccess("COURSES");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { dayOfWeek, startTime, endTime, teacherName, meetingLink, note, isActive } = body;

  const data: Record<string, unknown> = {};
  if (dayOfWeek !== undefined) data.dayOfWeek = Number(dayOfWeek);
  if (startTime !== undefined) data.startTime = startTime;
  if (endTime !== undefined) data.endTime = endTime || null;
  if (teacherName !== undefined) data.teacherName = teacherName || null;
  if (meetingLink !== undefined) data.meetingLink = meetingLink || null;
  if (note !== undefined) data.note = note || null;
  if (isActive !== undefined) data.isActive = Boolean(isActive);

  const schedule = await prisma.classSchedule.update({ where: { id: params.id }, data });
  return NextResponse.json(schedule);
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await requireSectionAccess("COURSES");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.classSchedule.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
