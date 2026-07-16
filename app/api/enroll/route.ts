import { NextResponse } from "next/server";
import { z } from "zod";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

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
  studentName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  whatsappNumber: z.string().trim().optional(),
  contactNumber: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  password: z.string().optional(),
  paymentMethod: z.enum(["BKASH", "NAGAD", "ROCKET", "WESTERN_UNION", "BANK_TRANSFER"]),
  transactionId: z.string().trim().optional()
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

    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      const user = await prisma.user.findUnique({ where: { id: session.user.id } });
      if (!user || user.role !== "STUDENT") {
        return NextResponse.json({ message: "Only student accounts can enroll." }, { status: 403 });
      }

      const existingEnrollment = await prisma.enrollment.findFirst({
        where: { userId: user.id, courseId: course.id, enrollmentStatus: { not: "CANCELLED" } }
      });
      if (existingEnrollment) {
        return NextResponse.json({ message: "You already enrolled in this course." }, { status: 409 });
      }

      const phone = user.phone || user.whatsapp || "";
      const enrollment = await prisma.enrollment.create({
        data: {
          courseId: course.id,
          userId: user.id,
          studentName: user.name,
          whatsappNumber: user.whatsapp || phone,
          email: user.email,
          contactNumber: phone,
          paymentMethod: data.paymentMethod,
          transactionId: data.transactionId || null,
          paymentAmount: course.fee
        }
      });
      await subscribeToNewsletter(user.email);
      return NextResponse.json({ success: true, id: enrollment.id, accountCreated: false }, { status: 201 });
    }

    const name = data.studentName?.trim() || "";
    const email = data.email?.trim().toLowerCase() || "";
    const phone = data.phone?.trim() || data.contactNumber?.trim() || data.whatsappNumber?.trim() || "";
    const password = data.password || "";

    // Keep the compact admission form on the homepage working. The dedicated
    // /enroll page always supplies a user-selected password.
    if (!password) {
      let userId: string | undefined;
      let account: { email: string; password: string } | null = null;
      if (email) {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
          userId = existingUser.id;
        } else {
          const temporaryPassword = randomBytes(4).toString("hex");
          const user = await prisma.user.create({
            data: {
              name: name || "Student",
              email,
              phone: phone || null,
              whatsapp: data.whatsappNumber || phone || null,
              passwordHash: await bcrypt.hash(temporaryPassword, 10),
              role: "STUDENT"
            }
          });
          userId = user.id;
          account = { email, password: temporaryPassword };
        }
      }
      const enrollment = await prisma.enrollment.create({
        data: {
          courseId: course.id,
          userId,
          studentName: name || "Student",
          whatsappNumber: data.whatsappNumber || phone,
          email: email || null,
          contactNumber: data.contactNumber || phone,
          paymentMethod: data.paymentMethod,
          transactionId: data.transactionId || null,
          paymentAmount: course.fee
        }
      });
      await subscribeToNewsletter(email);
      return NextResponse.json(
        { success: true, id: enrollment.id, account, accountCreated: Boolean(account) },
        { status: 201 }
      );
    }

    if (name.length < 2 || !email || phone.length < 6 || password.length < 6) {
      return NextResponse.json(
        { message: "Name, email, phone and a password of at least 6 characters are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existingUser) {
      return NextResponse.json(
        { message: "An account already exists with this email. Please log in to enroll." },
        { status: 409 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          phone,
          whatsapp: phone,
          passwordHash: await bcrypt.hash(password, 10),
          role: "STUDENT"
        }
      });
      const enrollment = await tx.enrollment.create({
        data: {
          courseId: course.id,
          userId: user.id,
          studentName: name,
          whatsappNumber: phone,
          email,
          contactNumber: phone,
          paymentMethod: data.paymentMethod,
          transactionId: data.transactionId || null,
          paymentAmount: course.fee
        }
      });
      return { enrollmentId: enrollment.id, userId: user.id };
    });

    await subscribeToNewsletter(email);

    return NextResponse.json(
      { success: true, id: result.enrollmentId, accountCreated: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { message: "Something went wrong while submitting your form. Please try again." },
      { status: 500 }
    );
  }
}
