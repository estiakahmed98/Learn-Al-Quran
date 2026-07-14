import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

function revalidateCoursePages() {
  revalidatePath("/");
  revalidatePath("/courses", "layout"); // listing + all /courses/[slug] pages
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireSectionAccess("COURSES");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const course = await prisma.course.findFirst({
      where: {
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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireSectionAccess("COURSES");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  try {
    const course = await prisma.course.update({ where: { id: params.id }, data: body });
    revalidateCoursePages();
    return NextResponse.json(course);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { message: "A course with this slug already exists. Please use a different slug." },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: "Failed to update course." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireSectionAccess("COURSES");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await prisma.course.delete({ where: { id: params.id } });
  revalidateCoursePages();
  return NextResponse.json({ success: true });
}
