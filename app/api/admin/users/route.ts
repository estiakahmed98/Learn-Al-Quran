import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any)?.role !== "ADMIN") return null;
  return session;
}

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  whatsapp: true,
  address: true,
  imageURL: true,
  role: true,
  isActive: true,
  permissions: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { enrollments: true } }
} as const;

function normalizeRole(role: unknown): "ADMIN" | "TEACHER" | "STUDENT" {
  if (role === "ADMIN" || role === "TEACHER") return role;
  return "STUDENT";
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const users = await prisma.user.findMany({
    select: userSelect,
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, email, phone, whatsapp, address, imageURL, role, isActive, password, permissions } = body;

  if (!name || !email || !password || String(password).length < 6) {
    return NextResponse.json(
      { message: "Name, email and a password of at least 6 characters are required." },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        whatsapp: whatsapp || null,
        address: address || null,
        imageURL: imageURL || null,
        role: normalizeRole(role),
        isActive: isActive ?? true,
        permissions: Array.isArray(permissions) ? permissions : [],
        passwordHash: await bcrypt.hash(password, 10)
      },
      select: userSelect
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { message: "A user with this email already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: "Failed to create user." }, { status: 500 });
  }
}
