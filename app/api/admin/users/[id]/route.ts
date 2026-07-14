import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, email, phone, whatsapp, address, description, designation, imageURL, role, isActive, password, permissions } = body;

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (phone !== undefined) data.phone = phone || null;
  if (whatsapp !== undefined) data.whatsapp = whatsapp || null;
  if (address !== undefined) data.address = address || null;
  if (description !== undefined) data.description = description || null;
  if (designation !== undefined) data.designation = designation || null;
  if (imageURL !== undefined) data.imageURL = imageURL || null;
  if (role !== undefined) data.role = normalizeRole(role);
  if (isActive !== undefined) data.isActive = Boolean(isActive);
  if (permissions !== undefined) data.permissions = Array.isArray(permissions) ? permissions : [];
  if (password) {
    if (String(password).length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }
    data.passwordHash = await bcrypt.hash(password, 10);
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
      select: { role: true }
    });
    const user = await prisma.user.update({
      where: { id: params.id },
      data,
      select: userSelect
    });
    if (existingUser?.role === "TEACHER" || user.role === "TEACHER") {
      revalidatePath("/");
      revalidatePath("/about-us");
    }
    return NextResponse.json(user);
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { message: "A user with this email already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ message: "Failed to update user." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  if ((session.user as any)?.id === params.id) {
    return NextResponse.json({ message: "You cannot delete your own account." }, { status: 400 });
  }

  const deletedUser = await prisma.user.delete({
    where: { id: params.id },
    select: { role: true }
  });
  if (deletedUser.role === "TEACHER") {
    revalidatePath("/");
    revalidatePath("/about-us");
  }
  return NextResponse.json({ success: true });
}
