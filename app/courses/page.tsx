import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Our Courses",
  description:
    "Explore our Quran learning courses: Smart Maktab, Tajweed Master Course, Complete Nazera Quran, Hifzul Quran, Adult Quran Learning and English Speaking.",
  alternates: { canonical: "/courses" }
};

export const revalidate = 3600;

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" }
  }).catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-semibold uppercase tracking-wide text-gold">Our Courses</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-primary-dark">
          Quran, Tajweed &amp; Islamic Learning Courses
        </h1>
        <p className="mt-4 text-gray-600">
          Choose the course that fits your learning goals — from beginner Maktab classes to
          complete Hifzul Quran memorization, taught by certified Huffaz and Qaris.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col rounded-2xl border border-gold/20 bg-white p-6 shadow-sm transition hover:shadow-lg"
          >
            <h2 className="font-heading text-lg font-bold text-primary-dark">{course.title}</h2>
            <p className="mt-2 flex-1 text-sm text-gray-600 line-clamp-3">{course.description}</p>
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>⏱ {course.duration}</span>
              <span className="font-semibold text-primary">৳{course.fee}</span>
            </div>
            <div className="mt-5 flex gap-3">
              <Link
                href={`/courses/${course.slug}`}
                className="flex-1 rounded-full border-2 border-primary py-2 text-center text-sm font-semibold text-primary hover:bg-primary hover:text-white"
              >
                See Course Module
              </Link>
              <Link
                href={`/free-trial-class?course=${course.slug}`}
                className="flex-1 rounded-full bg-gold py-2 text-center text-sm font-semibold text-white hover:bg-gold-light"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
