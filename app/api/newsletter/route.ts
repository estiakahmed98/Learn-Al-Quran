import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeRichHtml } from "@/lib/sanitize-html";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return null;
  return session;
}

// Get all newsletters
export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const newsletters = await prisma.newsletter.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(newsletters);
  } catch (error) {
    console.error("GET newsletters error:", error);
    return NextResponse.json({ error: "Failed to fetch newsletters" }, { status: 500 });
  }
}

// Create newsletter
export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { title, subject, content } = await req.json();

    if (!title || !subject || !content) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        subject,
        content: sanitizeRichHtml(content),
      },
    });

    return NextResponse.json(newsletter, { status: 201 });
  } catch (error) {
    console.error("POST newsletter error:", error);
    return NextResponse.json({ error: "Failed to create newsletter" }, { status: 500 });
  }
}
