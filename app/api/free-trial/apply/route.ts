import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendAdminNotification } from "@/lib/admin-notification";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body?.courseId) {
    return NextResponse.json({ message: "Please select a course." }, { status: 400 });
  }

  const studentName = String(body.studentName || "").trim();
  const guardianName = String(body.guardianName || "").trim();
  const mobileNumber = String(body.mobileNumber || "").trim();
  const whatsappNumber = String(body.whatsappNumber || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const studentAge = body.studentAge ? Number(body.studentAge) : null;
  const preferredDate = String(body.preferredDate || "").trim();
  const preferredTime = String(body.preferredTime || "").trim();
  const country = String(body.country || "").trim();
  const note = String(body.note || "").trim();
  const consentAccepted = Boolean(body.consentAccepted);

  if (!studentName || !guardianName || !mobileNumber || !whatsappNumber || !email) {
    return NextResponse.json(
      { message: "Student name, guardian name, mobile, WhatsApp and email are required." },
      { status: 400 }
    );
  }

  if (!consentAccepted) {
    return NextResponse.json(
      { message: "You must agree to the Terms & Conditions and Privacy Policy." },
      { status: 400 }
    );
  }

  const course = await prisma.course.findFirst({
    where: { id: String(body.courseId), isActive: true },
    select: { id: true, title: true }
  });
  if (!course) {
    return NextResponse.json({ message: "The selected course is unavailable." }, { status: 400 });
  }

  try {
    const preferredSchedule = [preferredDate, preferredTime].filter(Boolean).join(" ") || null;

    const application = await prisma.trialApplication.create({
      data: {
        courseId: course.id,
        studentName,
        guardianName,
        studentAge,
        mobileNumber,
        whatsappNumber,
        email,
        preferredDate: preferredDate || null,
        preferredTime: preferredTime || null,
        country: country || null,
        consentAccepted,
        preferredSchedule,
        note: note || null
      }
    });

    await sendAdminNotification({
      subject: `New free trial application — ${course.title}`,
      heading: "A new free trial application was submitted",
      fields: {
        "Student name": studentName,
        "Guardian name": guardianName,
        Email: email,
        Mobile: mobileNumber,
        WhatsApp: whatsappNumber,
        Course: course.title,
        "Preferred date": preferredDate,
        "Preferred time": preferredTime,
        Country: country,
        Note: note,
      },
    });

    return NextResponse.json({ application }, { status: 201 });
  } catch (error) {
    console.error("Free trial application failed", error);
    return NextResponse.json({ message: "Unable to submit your application." }, { status: 500 });
  }
}
