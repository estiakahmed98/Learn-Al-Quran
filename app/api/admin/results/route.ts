import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

export async function POST(request: Request) {
  const session = await requireSectionAccess("PAYMENTS");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { enrollmentId, examName, marks, grade, remarks, examDate } = body;

  if (!enrollmentId || !examName) {
    return NextResponse.json(
      { message: "enrollmentId and examName are required." },
      { status: 400 }
    );
  }

  const result = await prisma.result.create({
    data: {
      enrollmentId,
      examName,
      marks: marks === "" || marks === undefined || marks === null ? null : Number(marks),
      grade: grade || null,
      remarks: remarks || null,
      examDate: examDate ? new Date(examDate) : new Date()
    }
  });
  return NextResponse.json(result, { status: 201 });
}
