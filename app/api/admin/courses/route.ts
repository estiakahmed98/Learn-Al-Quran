import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { ZodError } from "zod";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";
import { courseCreateSchema } from "@/lib/validation/course";
import { CACHE_TAGS } from "@/lib/cached-data";

export async function GET() {
  const session = await requireSectionAccess("COURSES");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const courses = await prisma.course.findMany({
      orderBy: { sortOrder: "asc" }
    });
    return NextResponse.json(courses);
  } catch {
    return NextResponse.json({ message: "Failed to get courses." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireSectionAccess("COURSES");
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data = courseCreateSchema.parse(body) as Prisma.CourseUncheckedCreateInput;
    const course = await prisma.course.create({ data });
    revalidateTag(CACHE_TAGS.courses, { expire: 0 });
    revalidatePath("/");
    revalidatePath("/courses", "layout"); // listing + all /courses/[slug] pages
    return NextResponse.json(course, { status: 201 });
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
    return NextResponse.json({ message: "Failed to create course." }, { status: 500 });
  }
}
