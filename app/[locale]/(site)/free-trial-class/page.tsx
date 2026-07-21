import type { Metadata } from "next";
import FreeTrialApplication from "@/components/trial/FreeTrialApplication";
import { prisma } from "@/lib/prisma";
import { buildAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Trial Class",
  description:
    "Book your free trial class with Learn Al Quran Online BD. Experience our live one-to-one Quran, Tajweed and Hifz teaching before you enroll.",
  alternates: buildAlternates("/free-trial-class")
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ course?: string }>;
}

export default async function FreeTrialClassPage(props: Props) {
  const searchParams = await props.searchParams;
  const courses = await prisma.course.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { id: true, title: true, titleBn: true, slug: true }
  }).catch(() => []);
  const defaultCourseId = courses.find((course) => course.slug === searchParams.course)?.id;

  return <FreeTrialApplication courses={courses} defaultCourseId={defaultCourseId} />;
}
