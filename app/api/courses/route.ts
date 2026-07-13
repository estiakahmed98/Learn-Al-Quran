import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" }
    });

    return NextResponse.json(courses);
  } catch {
    return NextResponse.json({ message: "Failed to get courses." }, { status: 500 });
  }
}
