import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") return null;
  return session;
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { examName, marks, grade, remarks, examDate } = body;

  const data: Record<string, unknown> = {};
  if (examName !== undefined) data.examName = examName;
  if (marks !== undefined) data.marks = marks === "" || marks === null ? null : Number(marks);
  if (grade !== undefined) data.grade = grade || null;
  if (remarks !== undefined) data.remarks = remarks || null;
  if (examDate !== undefined) data.examDate = new Date(examDate);

  const result = await prisma.result.update({ where: { id: params.id }, data });
  return NextResponse.json(result);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.result.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
