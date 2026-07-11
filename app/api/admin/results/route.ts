import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") return null;
  return session;
}

export async function POST(request: Request) {
  const session = await requireAdmin();
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
