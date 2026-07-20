import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

export async function GET(request: Request) {
  const session = await requireSectionAccess("REPORTS");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get("teacherId") || undefined;
  const courseId = searchParams.get("courseId") || undefined;

  const reports = await prisma.classReport.findMany({
    where: {
      ...(teacherId ? { teacherId } : {}),
      ...(courseId ? { courseId } : {})
    },
    include: {
      teacher: { select: { id: true, name: true } },
      course: { select: { id: true, title: true } }
    },
    orderBy: { classDate: "desc" },
    take: 200
  });

  return NextResponse.json({ reports });
}
