import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { renderMonthlyClassReportPdf } from "@/lib/pdf/monthly-class-report";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const requestedTeacherId = searchParams.get("teacherId");
  const month = Number(searchParams.get("month"));
  const year = Number(searchParams.get("year"));

  if (!month || !year || month < 1 || month > 12) {
    return NextResponse.json({ message: "A valid month and year are required." }, { status: 400 });
  }

  let teacherId = session.user.id;
  if (session.user.role === "ADMIN" && requestedTeacherId) {
    teacherId = requestedTeacherId;
  } else if (session.user.role === "TEACHER" && requestedTeacherId && requestedTeacherId !== session.user.id) {
    return NextResponse.json({ message: "You can only download your own report." }, { status: 403 });
  }

  const teacher = await prisma.user.findUnique({ where: { id: teacherId }, select: { name: true } });
  if (!teacher) {
    return NextResponse.json({ message: "Teacher not found." }, { status: 404 });
  }

  const rangeStart = new Date(year, month - 1, 1);
  const rangeEnd = new Date(year, month, 1);

  const reports = await prisma.classReport.findMany({
    where: { teacherId, classDate: { gte: rangeStart, lt: rangeEnd } },
    include: { course: { select: { title: true } } },
    orderBy: { classDate: "asc" }
  });

  const pdfBuffer = await renderMonthlyClassReportPdf({
    teacherName: teacher.name,
    month,
    year,
    rows: reports.map((report) => ({
      courseTitle: report.course.title,
      classDate: report.classDate,
      startTime: report.startTime,
      endTime: report.endTime,
      completed: report.completed,
      attended: report.attended,
      notes: report.notes
    }))
  });

  return new NextResponse(pdfBuffer as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="class-report-${teacher.name.replace(/\s+/g, "-")}-${year}-${String(month).padStart(2, "0")}.pdf"`
    }
  });
}
