import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";
import { contentCreateSchema } from "@/lib/validation/content";

export async function GET() {
  const session = await requireSectionAccess("CONTENT");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const content = await prisma.content.findMany({ orderBy: [{ type: "asc" }, { sortOrder: "asc" }] });
  return NextResponse.json(content);
}

export async function POST(request: Request) {
  const session = await requireSectionAccess("CONTENT");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = contentCreateSchema.parse(body);
    const item = await prisma.content.create({ data });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Invalid content data.", issues: error.issues }, { status: 400 });
    }
    return NextResponse.json({ message: "Failed to create content." }, { status: 500 });
  }
}
