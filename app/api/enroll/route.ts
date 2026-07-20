import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendAdminNotification } from "@/lib/admin-notification";

async function notifyEnrollment(fields: {
  studentName: string;
  guardianName?: string | null;
  email?: string | null;
  phone: string;
  course: string;
  paymentMethod: string;
  transactionId?: string | null;
}) {
  await sendAdminNotification({
    subject: `New enrollment: ${fields.studentName} — ${fields.course}`,
    heading: "A new course enrollment was submitted",
    fields: {
      "Student name": fields.studentName,
      "Guardian name": fields.guardianName,
      Email: fields.email,
      "Phone / WhatsApp": fields.phone,
      Course: fields.course,
      "Payment method": fields.paymentMethod,
      "Transaction ID": fields.transactionId,
    },
  });
}

async function subscribeToNewsletter(email: string | null | undefined) {
  const normalizedEmail = email?.trim().toLowerCase();
  if (!normalizedEmail) return;

  await prisma.newsletterSubscriber.upsert({
    where: { email: normalizedEmail },
    update: { status: "subscribed", unsubscribedAt: null },
    create: { email: normalizedEmail, status: "subscribed" }
  }).catch((error) => {
    console.error("Newsletter subscribe error:", error);
  });
}

const enrollSchema = z.object({
  courseSlug: z.string().min(1, "Please select a course"),
  studentName: z.string().trim().min(2, "Student name is required"),
  guardianName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  whatsappNumber: z.string().trim().optional(),
  contactNumber: z.string().trim().optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  paymentMethod: z.enum(["BKASH", "NAGAD", "ROCKET", "WESTERN_UNION", "BANK_TRANSFER"]),
  transactionId: z.string().trim().optional(),
  consentAccepted: z.boolean().refine((value) => value === true, {
    message: "You must agree to the Terms & Conditions and Privacy Policy."
  })
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

    const course = await prisma.course.findFirst({ where: { slug: data.courseSlug, isActive: true } });
    if (!course) {
      return NextResponse.json({ message: "Selected course was not found." }, { status: 404 });
    }

    const phone = data.phone?.trim() || data.contactNumber?.trim() || data.whatsappNumber?.trim() || "";
    const email = data.email?.trim().toLowerCase() || null;

    if (phone.length < 6) {
      return NextResponse.json({ message: "A valid phone / WhatsApp number is required." }, { status: 400 });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        courseId: course.id,
        studentName: data.studentName,
        guardianName: data.guardianName || null,
        whatsappNumber: data.whatsappNumber || phone,
        email,
        contactNumber: data.contactNumber || phone,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId || null,
        paymentAmount: course.fee,
        consentAccepted: data.consentAccepted
      }
    });

    await subscribeToNewsletter(email);
    await notifyEnrollment({
      studentName: data.studentName,
      guardianName: data.guardianName,
      email,
      phone,
      course: course.title,
      paymentMethod: data.paymentMethod,
      transactionId: data.transactionId,
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
