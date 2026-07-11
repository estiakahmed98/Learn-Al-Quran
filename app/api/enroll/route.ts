import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const enrollSchema = z.object({
  courseSlug: z.string().min(1, "Please select a course"),
  studentName: z.string().min(2, "Student name is required"),
  whatsappNumber: z.string().min(6, "WhatsApp number is required"),
  email: z.string().email().optional().or(z.literal("")).optional(),
  paymentMethod: z.enum(["BKASH", "NAGAD", "ROCKET", "WESTERN_UNION", "BANK_TRANSFER"]),
  transactionId: z.string().optional(),
  contactNumber: z.string().min(6, "Contact number is required")
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = enrollSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid data submitted." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const course = await prisma.course.findUnique({ where: { slug: data.courseSlug } });
    if (!course) {
      return NextResponse.json({ message: "Selected course was not found." }, { status: 404 });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        courseId: course.id,
        studentName: data.studentName,
        whatsappNumber: data.whatsappNumber,
        email: data.email || undefined,
        contactNumber: data.contactNumber,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        paymentAmount: course.fee
      }
    });

    return NextResponse.json({ success: true, id: enrollment.id }, { status: 201 });
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { message: "Something went wrong while submitting your form. Please try again." },
      { status: 500 }
    );
  }
}
