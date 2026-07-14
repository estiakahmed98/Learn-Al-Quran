import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

export async function POST(request: Request) {
  const session = await requireSectionAccess("COURSES");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { courseId, title, content, fileUrl, isPublished } = body;

  if (!courseId || !title) {
    return NextResponse.json({ message: "courseId and title are required." }, { status: 400 });
  }

  const note = await prisma.note.create({
    data: {
      courseId,
      title,
      content: content || null,
      fileUrl: fileUrl || null,
      isPublished: isPublished ?? true
    }
  });
  return NextResponse.json(note, { status: 201 });
}
