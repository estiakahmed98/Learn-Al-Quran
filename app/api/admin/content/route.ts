import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

export async function GET() {
  const session = await requireSectionAccess("CONTENT");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const content = await prisma.content.findMany({ orderBy: [{ type: "asc" }, { sortOrder: "asc" }] });
  return NextResponse.json(content);
}

export async function POST(request: Request) {
  const session = await requireSectionAccess("CONTENT");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const item = await prisma.content.create({ data: body });
  return NextResponse.json(item, { status: 201 });
}
