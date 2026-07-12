import Link from "next/link";
import type { Course } from "@prisma/client";

const courseIcons: Record<string, string> = {
  "smart-maktab-learning": "📖",
  "tajweed-master-course": "🎙️",
  "complete-nazera-quran": "📕",
  "complete-hifzul-quran": "🕌",
  "adult-quran-learning": "👤",
  "english-speaking": "💬"
};

export default function Courses({ courses }: { courses: Course[] }) {
  return (
    <section id="courses" className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
      <h2 className="flex items-center gap-2 font-heading text-lg font-bold uppercase tracking-wide text-primary-dark sm:text-xl">
        Our Master Courses <span className="text-secondary">⟶</span>
      </h2>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col rounded-2xl border border-gold/20 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-white shadow">
              {courseIcons[course.slug] || "📖"}
            </span>
            <h3 className="mt-4 font-heading text-base font-bold leading-snug text-primary-dark">
              {course.title}
            </h3>
            <p className="mt-2 flex-1 text-xs leading-relaxed text-gray-600 line-clamp-4">
              {course.description}
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href={`/courses/${course.slug}`}
                className="rounded-lg border border-gray-300 py-2 text-xs font-semibold text-gray-700 transition hover:border-primary hover:text-primary"
              >
                See More
              </Link>
              <Link
                href={`/free-trial-class?course=${course.slug}`}
                className="rounded-lg bg-gold py-2 text-xs font-semibold text-primary-dark transition hover:bg-gold-light"
              >
                Enroll Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
