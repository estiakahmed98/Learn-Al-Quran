import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await requireSectionAccess("COURSES");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, content, fileUrl, isPublished } = body;

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content || null;
  if (fileUrl !== undefined) data.fileUrl = fileUrl || null;
  if (isPublished !== undefined) data.isPublished = Boolean(isPublished);

  const note = await prisma.note.update({ where: { id: params.id }, data });
  return NextResponse.json(note);
}

export async function DELETE(_request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await requireSectionAccess("COURSES");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.note.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
