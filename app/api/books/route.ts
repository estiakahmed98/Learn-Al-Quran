import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export async function GET() {
  try {
    const books = await prisma.content.findMany({
      where: {
        type: "BOOK",
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        subtitle: true,
        description: true,
        image: true,
        data: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return NextResponse.json(
      {
        success: true,
        message: "Books retrieved successfully.",
        count: books.length,
        data: books,
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch (error) {
    console.error("GET /api/books error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve books.",
        count: 0,
        data: [],
      },
      {
        status: 500,
      },
    );
  }
}
