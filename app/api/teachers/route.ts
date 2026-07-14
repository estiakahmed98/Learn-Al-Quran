import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const teachers = await prisma.user.findMany({
      where: { role: "TEACHER", isActive: true },
      select: {
        id: true,
        name: true,
        designation: true,
        description: true,
        imageURL: true,
        createdAt: true
      },
      orderBy: { name: "asc" }
    });

    return NextResponse.json(teachers);
  } catch {
    return NextResponse.json({ message: "Failed to get teachers." }, { status: 500 });
  }
}
