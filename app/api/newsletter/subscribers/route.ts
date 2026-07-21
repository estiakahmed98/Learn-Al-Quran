//api/newsletter/subscribers

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: {
        createdAt: "desc"
      },
      select: {
        email: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: subscribers,
      count: subscribers.length
    });
  } catch (err) {
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to load subscribers",
        message: err instanceof Error ? err.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: "Valid email address is required"
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Create new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        status: "subscribed",
      },
      select: {
        email: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: subscriber,
      message: "Subscriber added successfully"
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          success: false,
          error: "Subscriber already exists"
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to add subscriber",
        message: err instanceof Error ? err.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { 
          success: false,
          error: "Email parameter is required"
        },
        { status: 400 }
      );
    }

    // Delete subscriber
    const deletedSubscriber = await prisma.newsletterSubscriber.delete({
      where: { email: email.trim().toLowerCase() },
      select: {
        email: true,
        status: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: deletedSubscriber,
      message: "Subscriber deleted successfully"
    });
  } catch (err) {
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to delete subscriber",
        message: err instanceof Error ? err.message : "Internal server error"
      },
      { status: 500 }
    );
  }
}