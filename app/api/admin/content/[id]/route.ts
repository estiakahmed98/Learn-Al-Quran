import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";
import { contentUpdateSchema } from "@/lib/validation/content";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireSectionAccess("CONTENT");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = contentUpdateSchema.parse(body);
    const item = await prisma.content.update({ where: { id: params.id }, data });
    return NextResponse.json(item);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Invalid content data.", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ message: "Failed to update content." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireSectionAccess("CONTENT");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.content.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
