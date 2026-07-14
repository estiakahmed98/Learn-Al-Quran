import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSectionAccess } from "@/lib/require-section";

export async function GET() {
  const session = await requireSectionAccess("PAYMENTS");
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const enrollments = await prisma.enrollment.findMany({
    include: { course: { select: { title: true, slug: true } } },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(enrollments);
}

// Admin manually assigns a course to a user. The enrollment is created
// already approved (payment VERIFIED, enrollment ACTIVE) so it shows on the
// student's dashboard immediately.
export async function POST(request: Request) {
  const session = await requireSectionAccess("PAYMENTS");
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { userId, courseId, paymentStatus, enrollmentStatus, paymentMethod, adminNote } = body;

  if (!userId || !courseId) {
    return NextResponse.json({ message: "userId and courseId are required." }, { status: 400 });
  }

  const [user, course] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.course.findUnique({ where: { id: courseId } })
  ]);

  if (!user) return NextResponse.json({ message: "User not found." }, { status: 404 });
  if (!course) return NextResponse.json({ message: "Course not found." }, { status: 404 });

  const existing = await prisma.enrollment.findFirst({
    where: { courseId, OR: [{ userId }, ...(user.email ? [{ email: user.email }] : [])] }
  });
  if (existing) {
    return NextResponse.json(
      { message: "This user is already enrolled in this course." },
      { status: 409 }
    );
  }

  const finalPaymentStatus = paymentStatus || "VERIFIED";
  const enrollment = await prisma.$transaction(async (tx) => {
    const created = await tx.enrollment.create({
      data: {
        userId,
        courseId,
        studentName: user.name,
        whatsappNumber: user.whatsapp || user.phone || "",
        email: user.email,
        contactNumber: user.phone || "",
        paymentMethod: paymentMethod || "BKASH",
        paymentAmount: course.fee,
        paymentStatus: finalPaymentStatus,
        enrollmentStatus: enrollmentStatus || "ACTIVE",
        adminNote: adminNote || "Assigned by admin"
      },
      include: { course: { select: { title: true } }, results: true }
    });
    if (finalPaymentStatus === "VERIFIED") {
      await tx.user.updateMany({
        where: { id: userId, role: "STUDENT", studentStatus: "FREE_TRIAL" },
        data: { studentStatus: "REGULAR" }
      });
    }
    return created;
  });

  return NextResponse.json(enrollment, { status: 201 });
}
