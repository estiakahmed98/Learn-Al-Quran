import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const reportSchema = z.object({
  courseId: z.string().min(1, "Please select a course"),
  classDate: z.string().min(1, "Class date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().optional(),
  completed: z.boolean().default(true),
  notes: z.string().optional()
});

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId") || undefined;

  const reports = await prisma.classReport.findMany({
    where: { teacherId: session.user.id, ...(courseId ? { courseId } : {}) },
    include: { course: { select: { title: true, titleBn: true } } },
    orderBy: { classDate: "desc" }
  });

  return NextResponse.json({ reports });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "TEACHER") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = reportSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: parsed.error.issues[0]?.message || "Invalid data submitted." },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const course = await prisma.course.findFirst({
    where: { id: data.courseId, instructorId: session.user.id }
  });
  if (!course) {
    return NextResponse.json({ message: "You are not assigned to this course." }, { status: 403 });
  }

  const classDate = new Date(data.classDate);

  const report = await prisma.classReport.upsert({
    where: {
      teacherId_courseId_classDate: {
        teacherId: session.user.id,
        courseId: data.courseId,
        classDate
      }
    },
    update: {
      startTime: data.startTime,
      endTime: data.endTime || null,
      completed: data.completed,
      notes: data.notes || null
    },
    create: {
      teacherId: session.user.id,
      courseId: data.courseId,
      classDate,
      startTime: data.startTime,
      endTime: data.endTime || null,
      completed: data.completed,
      notes: data.notes || null
    }
  });

  return NextResponse.json({ report }, { status: 201 });
}
