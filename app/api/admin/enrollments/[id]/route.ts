import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireSectionAccess("PAYMENTS");
  if (!session) {
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
  const session = await requireSectionAccess("PAYMENTS");
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await prisma.enrollment.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
