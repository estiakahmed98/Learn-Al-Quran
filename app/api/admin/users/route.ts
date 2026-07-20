import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { randomBytes } from "crypto";
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
  description: true,
  designation: true,
  imageURL: true,
  role: true,
  studentStatus: true,
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
  const { name, email, phone, whatsapp, address, description, designation, imageURL, role, isActive, password, permissions } = body;

  const normalizedRole = normalizeRole(role);
  const isStudent = normalizedRole === "STUDENT";

  if (!name || !email) {
    return NextResponse.json({ message: "Name and email are required." }, { status: 400 });
  }
  if (!isStudent && (!password || String(password).length < 6)) {
    return NextResponse.json(
      { message: "A password of at least 6 characters is required." },
      { status: 400 }
    );
  }

  try {
    // Students don't get login access — generate a random, never-shared password hash
    // to satisfy the required passwordHash column instead of a real credential.
    const passwordToHash = isStudent ? randomBytes(32).toString("hex") : password;

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        whatsapp: whatsapp || null,
        address: address || null,
        description: description || null,
        designation: designation || null,
        imageURL: imageURL || null,
        role: normalizedRole,
        isActive: isActive ?? true,
        permissions: Array.isArray(permissions) ? permissions : [],
        passwordHash: await bcrypt.hash(passwordToHash, 10)
      },
      select: userSelect
    });
    if (user.role === "TEACHER") {
      revalidatePath("/");
      revalidatePath("/about-us");
    }
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
