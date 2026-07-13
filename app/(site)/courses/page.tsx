import type { Metadata } from "next";
import CoursesIndexView from "@/components/courses/CoursesIndexView";

export const metadata: Metadata = {
  title: "Our Courses",
  description:
    "Explore our Quran learning courses: Smart Maktab, Tajweed Master Course, Complete Nazera Quran, Hifzul Quran, Adult Quran Learning and English Speaking.",
  alternates: { canonical: "/courses" }
};

export default function CoursesPage() {
  return <CoursesIndexView />;
}
