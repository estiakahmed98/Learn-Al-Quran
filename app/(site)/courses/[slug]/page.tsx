import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CourseDetailLoader from "@/components/courses/CourseDetailLoader";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Course Details",
    description: "View course details, curriculum, schedule and enrollment information."
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const reviews = await prisma.content
    .findMany({
      where: { type: "REVIEW", isPublished: true },
      orderBy: { sortOrder: "asc" },
      take: 6
    })
    .catch(() => []);

  return (
    <CourseDetailLoader
      slug={params.slug}
      reviews={JSON.parse(JSON.stringify(reviews))}
    />
  );
}
