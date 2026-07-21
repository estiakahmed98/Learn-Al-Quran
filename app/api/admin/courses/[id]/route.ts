import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { ZodError } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";
import { courseUpdateSchema } from "@/lib/validation/course";
import { CACHE_TAGS } from "@/lib/cached-data";

function revalidateCoursePages() {
  revalidateTag(CACHE_TAGS.courses);
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

  try {
    const body = await request.json();
    const data = courseUpdateSchema.parse(body) as Prisma.CourseUncheckedUpdateInput;
    const course = await prisma.course.update({ where: { id: params.id }, data });
    revalidateCoursePages();
    return NextResponse.json(course);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: "Invalid course data.", issues: error.issues }, { status: 400 });
    }
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
