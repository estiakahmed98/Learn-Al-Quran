import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAdminNotification } from "@/lib/admin-notification";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const body = await request.json().catch(() => null);

  if (!body?.courseId) {
    return NextResponse.json({ message: "Please select a course." }, { status: 400 });
  }

  const course = await prisma.course.findFirst({
    where: { id: String(body.courseId), isActive: true },
    select: { id: true, title: true }
  });
  if (!course) {
    return NextResponse.json({ message: "The selected course is unavailable." }, { status: 400 });
  }

  try {
    if (session?.user?.id) {
      if (session.user.role !== "STUDENT") {
        return NextResponse.json(
          { message: "Only student accounts can apply for a free trial class." },
          { status: 403 }
        );
      }
      const application = await prisma.$transaction(async (tx) => {
        const paidEnrollments = await tx.enrollment.count({
          where: { userId: session.user.id, paymentStatus: "VERIFIED" }
        });
        if (paidEnrollments === 0) {
          await tx.user.updateMany({
            where: { id: session.user.id, role: "STUDENT" },
            data: { studentStatus: "FREE_TRIAL" }
          });
        }
        return tx.trialApplication.create({
          data: {
            userId: session.user.id,
            courseId: course.id,
            preferredSchedule: String(body.preferredSchedule || "").trim() || null,
            note: String(body.note || "").trim() || null
          }
        });
      });
      await sendAdminNotification({
        subject: `New free trial application — ${course.title}`,
        heading: "A new free trial application was submitted",
        fields: {
          Name: session.user.name,
          Email: session.user.email,
          Course: course.title,
          "Preferred schedule": body.preferredSchedule,
          Note: body.note,
        },
      });
      return NextResponse.json({ application, accountCreated: false }, { status: 201 });
    }

    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const password = String(body.password || "");

    if (!name || !email || !phone || password.length < 6) {
      return NextResponse.json(
        { message: "Name, email, phone and a password of at least 6 characters are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) {
      return NextResponse.json(
        { message: "An account already exists with this email. Please log in, then apply." },
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
          role: "STUDENT",
          studentStatus: "FREE_TRIAL"
        }
      });
      const application = await tx.trialApplication.create({
        data: {
          userId: user.id,
          courseId: course.id,
          preferredSchedule: String(body.preferredSchedule || "").trim() || null,
          note: String(body.note || "").trim() || null
        }
      });
      return { application, userId: user.id };
    });

    await sendAdminNotification({
      subject: `New free trial application from ${name}`,
      heading: "A new free trial application was submitted",
      fields: {
        Name: name,
        Email: email,
        Phone: phone,
        Course: course.title,
        "Preferred schedule": body.preferredSchedule,
        Note: body.note,
      },
    });

    return NextResponse.json({ ...result, accountCreated: true }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { message: "You have already applied for a trial class in this course." },
        { status: 409 }
      );
    }
    console.error("Free trial application failed", error);
    return NextResponse.json({ message: "Unable to submit your application." }, { status: 500 });
  }
}
