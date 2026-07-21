import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

// One-click approval: verify the payment and activate the enrollment so the
// course unlocks on the student's dashboard. Pass { reject: true } to reject.
export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await requireSectionAccess("PAYMENTS");
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const reject = Boolean(body?.reject);

  const enrollment = await prisma.$transaction(async (tx) => {
    const updated = await tx.enrollment.update({
      where: { id: params.id },
      data: reject
        ? { paymentStatus: "REJECTED", enrollmentStatus: "CANCELLED" }
        : { paymentStatus: "VERIFIED", enrollmentStatus: "ACTIVE" },
      include: { course: { select: { title: true } } }
    });
    if (!reject && updated.userId) {
      await tx.user.updateMany({
        where: { id: updated.userId, role: "STUDENT", studentStatus: "FREE_TRIAL" },
        data: { studentStatus: "REGULAR" }
      });
    }
    return updated;
  });

  return NextResponse.json(enrollment);
}
