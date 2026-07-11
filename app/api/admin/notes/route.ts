import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") return null;
  return session;
}

export async function POST(request: Request) {
  const session = await requireAdmin();
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
