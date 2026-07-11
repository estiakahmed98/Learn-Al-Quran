import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("A valid email is required"),
  phone: z.string().min(6, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = signupSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid data submitted." },
        { status: 400 }
      );
    }

    const { name, email, phone, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: await bcrypt.hash(password, 10),
        role: "STUDENT"
      }
    });

    return NextResponse.json({ success: true, id: user.id }, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Something went wrong while creating your account. Please try again." },
      { status: 500 }
    );
  }
}
