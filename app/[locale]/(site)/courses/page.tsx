import type { Metadata } from "next";
import CoursesIndexView from "@/components/courses/CoursesIndexView";
import { buildAlternates, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site-config";
import JsonLd from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Our Courses",
  description:
    "Explore our Quran learning courses: Smart Maktab, Tajweed Master Course, Complete Nazera Quran, Hifzul Quran, Adult Quran Learning and English Speaking.",
  alternates: buildAlternates("/courses")
};

export default function CoursesPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Courses", url: `${siteUrl}/courses` }
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <CoursesIndexView />
    </>
  );
}
