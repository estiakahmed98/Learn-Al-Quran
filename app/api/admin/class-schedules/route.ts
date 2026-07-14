import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

export async function POST(request: Request) {
  const session = await requireSectionAccess("COURSES");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { courseId, dayOfWeek, startTime, endTime, teacherName, meetingLink, note } = body;

  if (!courseId || dayOfWeek === undefined || !startTime) {
    return NextResponse.json(
      { message: "courseId, dayOfWeek and startTime are required." },
      { status: 400 }
    );
  }

  const schedule = await prisma.classSchedule.create({
    data: {
      courseId,
      dayOfWeek: Number(dayOfWeek),
      startTime,
      endTime: endTime || null,
      teacherName: teacherName || null,
      meetingLink: meetingLink || null,
      note: note || null
    }
  });
  return NextResponse.json(schedule, { status: 201 });
}
