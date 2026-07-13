import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
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
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  try {
    const course = await prisma.course.create({ data: body });
    revalidatePath("/");
    revalidatePath("/courses", "layout"); // listing + all /courses/[slug] pages
    return NextResponse.json(course, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { message: "A course with this slug already exists. Please use a different slug." },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: "Failed to create course." }, { status: 500 });
  }
}
