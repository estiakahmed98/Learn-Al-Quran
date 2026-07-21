import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await requireSectionAccess("PAYMENTS");
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

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await requireSectionAccess("PAYMENTS");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.result.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
