"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { pickText } from "@/lib/course-content";
import { useCourses } from "@/hooks/useCourses";

const courseIcons: Record<string, string> = {
  "smart-maktab-learning": "📖",
  "tajweed-master-course": "🎙️",
  "complete-nazera-quran": "📕",
  "complete-hifzul-quran": "🕌",
  "adult-quran-learning": "👤",
  "english-speaking": "💬"
};

export default function Courses() {
  const t = useTranslations("courses");
  const locale = useLocale();
  const { courses, isLoading } = useCourses();

  const visibleCourses = courses.slice(0, 6);
  const hasMore = courses.length > 6;

  return (
    <section id="courses" className="relative overflow-hidden bg-primary/5">

      <div className="relative mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
        {/* Centered heading like the reference */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold text-primary-dark lg:text-4xl">
            {t("title")}
          </h2>
          <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gold" />
          <p className="mt-5 text-sm leading-relaxed text-gray-600 lg:text-base">
            {t("intro")}
          </p>
        </div>

        {isLoading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading courses">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-96 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        ) : visibleCourses.length === 0 ? (
          <p className="mt-12 text-center text-gray-500">{t("empty")}</p>
        ) : (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCourses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Illustration / thumbnail */}
              <div className="flex h-40 items-center justify-center bg-primary/5">
                {course.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={course.thumbnail}
                    alt={pickText(locale, course.title, course.titleBn)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-4xl text-white shadow">
                    {courseIcons[course.slug] || "📖"}
                  </span>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6 text-center">
                <h3 className="font-heading text-base font-bold uppercase tracking-wide text-primary-dark">
                  {pickText(locale, course.title, course.titleBn)}
                </h3>
                <div className="mx-auto mt-2 h-0.5 w-10 rounded-full bg-gold/60" />
                <p className="mt-3 flex-1 text-xs leading-relaxed text-gray-600 line-clamp-4 lg:text-sm">
                  {pickText(locale, course.description, course.descriptionBn)}
                </p>

                <div className="mt-5 flex gap-3">
                  <Link
                    href={`/courses/${course.slug}`}
                    className="flex-1 rounded-lg border border-primary/30 py-2.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white sm:text-sm"
                  >
                    {t("details")}
                  </Link>
                  <Link
                    href={`/free-trial-class?course=${course.slug}`}
                    className="flex-1 rounded-lg bg-primary py-2.5 text-xs font-semibold text-white transition hover:bg-primary-dark sm:text-sm"
                  >
                    {t("enrollNow")}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {hasMore && (
          <div className="mt-12 text-center">
            <Link
              href="/courses"
              className="inline-block rounded-lg bg-primary px-10 py-3 font-semibold text-white shadow transition hover:bg-primary-dark"
            >
              {t("viewAll")}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
