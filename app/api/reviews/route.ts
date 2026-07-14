import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const role = typeof body?.role === "string" ? body.role.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const rating = Number(body?.rating);

  if (!name || !message) {
    return NextResponse.json({ message: "Name and review message are required." }, { status: 400 });
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ message: "Rating must be a number between 1 and 5." }, { status: 400 });
  }

  let slug = generateSlug(`review-${name}`);
  let uniqueSlug = slug;
  let counter = 1;
  while (await prisma.content.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  const review = await prisma.content.create({
    data: {
      type: "REVIEW",
      title: name,
      slug: uniqueSlug,
      subtitle: role || null,
      description: message,
      data: { rating },
      isPublished: false
    }
  });

  return NextResponse.json({ id: review.id }, { status: 201 });
}
