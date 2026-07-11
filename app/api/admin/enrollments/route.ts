import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const enrollments = await prisma.enrollment.findMany({
    include: { course: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(enrollments);
}
