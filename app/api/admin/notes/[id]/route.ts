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
  const { title, content, fileUrl, isPublished } = body;

  const data: Record<string, unknown> = {};
  if (title !== undefined) data.title = title;
  if (content !== undefined) data.content = content || null;
  if (fileUrl !== undefined) data.fileUrl = fileUrl || null;
  if (isPublished !== undefined) data.isPublished = Boolean(isPublished);

  const note = await prisma.note.update({ where: { id: params.id }, data });
  return NextResponse.json(note);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.note.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
