import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const course = await prisma.course.findFirst({
      where: {
        isActive: true,
        OR: [{ id: params.id }, { slug: params.id }]
      }
    });

    if (!course) {
      return NextResponse.json({ message: "Course not found." }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch {
    return NextResponse.json({ message: "Failed to get course." }, { status: 500 });
  }
}
