import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "অনুগ্রহ করে একটি বৈধ ইমেইল ঠিকানা দিন" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const subscriber = await prisma.newsletterSubscriber.upsert({
        where: { email: normalizedEmail },
        update: {
          status: "subscribed",
          unsubscribedAt: null,
        },
        create: {
          email: normalizedEmail,
          status: "subscribed",
        },
      });

      return NextResponse.json({
        message: "সফলভাবে নিউজলেটারের জন্য সাবস্ক্রাইব করা হয়েছে!",
        subscriber,
      });
    } catch (dbError) {
      console.error("Prisma subscription error:", dbError);
      return NextResponse.json(
        { error: "সাবস্ক্রিপশন ডেটাবেসে সংরক্ষণ করা সম্ভব হয়নি" },
        { status: 500 }
      );
    }
  } catch (e) {
    console.error("Newsletter subscription general error:", e);
    return NextResponse.json(
      { error: "সাবস্ক্রিপশন প্রক্রিয়া সম্পূর্ণ করা সম্ভব হয়নি" },
      { status: 500 }
    );
  }
}
