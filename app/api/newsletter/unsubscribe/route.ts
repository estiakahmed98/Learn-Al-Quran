import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function handleUnsubscribe(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const subscriber = await prisma.newsletterSubscriber.update({
      where: { email: normalizedEmail },
      data: {
        status: "unsubscribed",
        unsubscribedAt: new Date(),
      },
    });
    return { success: true as const, subscriber };
  } catch (dbError) {
    if (dbError instanceof Error && dbError.message.includes("Record to update not found")) {
      console.warn(`Prisma Warning: Subscriber ${normalizedEmail} not found in local database.`);
      return { success: false as const, error: "Email not found in local subscription list." };
    }
    throw dbError;
  }
}

// GET handler (for link in email footer): /api/newsletter/unsubscribe?email=...
export async function GET(req: Request) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return new Response(
      `<html><body><h2>ইমেইল ঠিকানা আবশ্যক।</h2></body></html>`,
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  try {
    const result = await handleUnsubscribe(email);

    if (result.success) {
      return new Response(
        `<html>
            <head>
                <title>সফলভাবে আনসাবস্ক্রাইব করা হয়েছে</title>
                <style>body { font-family: sans-serif; text-align: center; padding: 50px; background-color: #f0f0f0; } h2 { color: #0E4B4B; }</style>
            </head>
            <body>
                <h2>✅ আপনি সফলভাবে নিউজলেটার থেকে আনসাবস্ক্রাইব করেছেন।</h2>
                <p>আমরা আপনাকে আর কোনো ইমেইল পাঠাব না।</p>
            </body>
        </html>`,
        { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    } else {
      return new Response(
        `<html>
            <head>
                <title>আনসাবস্ক্রাইব ব্যর্থ</title>
                <style>body { font-family: sans-serif; text-align: center; padding: 50px; background-color: #f0f0f0; } h2 { color: #C0704D; }</style>
            </head>
            <body>
                <h2>⚠️ আনসাবস্ক্রাইব করার অনুরোধটি ব্যর্থ হয়েছে।</h2>
                <p>এই ইমেইলটি আমাদের গ্রাহক তালিকায় পাওয়া যায়নি।</p>
            </body>
        </html>`,
        { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return new Response(
      `<html><body><h2>আনসাবস্ক্রাইব করতে সমস্যা হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।</h2></body></html>`,
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}

// POST handler (JSON-based unsubscribe via frontend fetch)
export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "ইমেইল ঠিকানা আবশ্যক" }, { status: 400 });
    }

    const result = await handleUnsubscribe(email);

    if (result.success) {
      return NextResponse.json({
        message: "আপনি সফলভাবে আনসাবস্ক্রাইব করেছেন!",
        subscriber: result.subscriber,
      });
    } else {
      return NextResponse.json(
        { error: "এই ইমেইলটি সাবস্ক্রিপশন তালিকায় পাওয়া যায়নি।" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json(
      { error: "আনসাবস্ক্রাইব করতে সমস্যা হয়েছে" },
      { status: 500 }
    );
  }
}
