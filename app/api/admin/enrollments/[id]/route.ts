import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const enrollment = await prisma.enrollment.update({
    where: { id: params.id },
    data: {
      paymentStatus: body.paymentStatus,
      enrollmentStatus: body.enrollmentStatus,
      adminNote: body.adminNote
    }
  });

  return NextResponse.json(enrollment);
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await prisma.enrollment.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
