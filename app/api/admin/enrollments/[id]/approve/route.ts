import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// One-click approval: verify the payment and activate the enrollment so the
// course unlocks on the student's dashboard. Pass { reject: true } to reject.
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const reject = Boolean(body?.reject);

  const enrollment = await prisma.enrollment.update({
    where: { id: params.id },
    data: reject
      ? { paymentStatus: "REJECTED", enrollmentStatus: "CANCELLED" }
      : { paymentStatus: "VERIFIED", enrollmentStatus: "ACTIVE" },
    include: { course: { select: { title: true } } }
  });

  return NextResponse.json(enrollment);
}
