import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

export async function GET() {
  const session = await requireSectionAccess("SETTINGS");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const settings = await prisma.siteSetting.findFirst();
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  const session = await requireSectionAccess("SETTINGS");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  delete body.id;
  delete body.createdAt;
  delete body.updatedAt;

  const existing = await prisma.siteSetting.findFirst();
  const settings = existing
    ? await prisma.siteSetting.update({ where: { id: existing.id }, data: body })
    : await prisma.siteSetting.create({ data: { id: "main", ...body } });

  return NextResponse.json(settings);
}
