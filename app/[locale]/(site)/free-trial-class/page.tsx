import type { Metadata } from "next";
import FreeTrialApplication from "@/components/trial/FreeTrialApplication";
import { getCachedActiveCourses } from "@/lib/cached-data";
import { publicPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return publicPageMetadata(locale, "/free-trial-class", {
    title: "Free Trial Class",
    description:
      "Book your free trial class with Learn Al Quran Online BD. Experience our live one-to-one Quran, Tajweed and Hifz teaching before you enroll."
  });
}

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ course?: string }>;
}

export default async function FreeTrialClassPage(props: Props) {
  const searchParams = await props.searchParams;
  const courses = await getCachedActiveCourses().catch(() => []);
  const defaultCourseId = courses.find((course) => course.slug === searchParams.course)?.id;

  return <FreeTrialApplication courses={courses} defaultCourseId={defaultCourseId} />;
}
