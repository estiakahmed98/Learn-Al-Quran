import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireSectionAccess("CONTENT");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const item = await prisma.content.update({ where: { id: params.id }, data: body });
  return NextResponse.json(item);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireSectionAccess("CONTENT");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.content.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
