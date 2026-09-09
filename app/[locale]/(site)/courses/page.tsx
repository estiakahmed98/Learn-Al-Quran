//app/%5Blocale%5D/%28site%29/courses/page.tsx
import type { Metadata } from "next";
import CoursesIndexView from "@/components/courses/CoursesIndexView";
import { buildBreadcrumbJsonLd, publicPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { siteUrl } from "@/lib/site-config";
import JsonLd from "@/components/shared/JsonLd";
import { getCachedActiveCourses } from "@/lib/cached-data";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return publicPageMetadata(locale, "/courses", {
    title: "Our Courses",
    description:
      "Explore our Quran learning courses: Smart Maktab, Tajweed Master Course, Complete Nazera Quran, Hifzul Quran, Adult Quran Learning and English Speaking."
  });
}

export default async function CoursesPage() {
  const courses = await getCachedActiveCourses();
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Courses", url: `${siteUrl}/courses` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <CoursesIndexView courses={courses} />
    </>
  );
}
