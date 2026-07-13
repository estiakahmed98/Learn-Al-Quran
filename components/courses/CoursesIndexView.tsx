"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { pickText } from "@/lib/course-content";
import { useCourses, type CourseListItem } from "@/hooks/useCourses";

export type CourseCardData = CourseListItem;

const courseIcons: Record<string, string> = {
  "smart-maktab-learning": "📖",
  "tajweed-master-course": "🎙️",
  "complete-nazera-quran": "📕",
  "complete-hifzul-quran": "🕌",
  "adult-quran-learning": "👤",
  "english-speaking": "💬"
};

export default function CoursesIndexView() {
  const t = useTranslations("courses");
  const locale = useLocale();
  const { courses, isLoading } = useCourses();

  return (
    <div>
      {/* Hero band — continuous with the header, like the home hero */}
      <section className="relative overflow-hidden bg-primary-dark">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-[0.04]" />
        <div className="relative mx-auto max-w-4xl px-4 py-14 text-center lg:px-8 lg:py-20">
          <nav className="flex items-center justify-center gap-2 text-xs text-white/60 sm:text-sm">
            <Link href="/" className="hover:text-gold">
              {t("breadcrumbHome")}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white/90">{t("title")}</span>
          </nav>
          <h1 className="mt-4 font-heading text-3xl font-bold text-white lg:text-4xl">
            {t("pageTitle")}
          </h1>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold" />
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/75 lg:text-base">
            {t("pageSubtitle")}
          </p>
        </div>
      </section>

      {/* Course grid — same soft teal band as the About / home courses sections */}
      <section className="bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-16">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading courses">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[28rem] animate-pulse rounded-2xl bg-white" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-500">{t("empty")}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => {
                const badges = [
                  pickText(locale, course.category, course.categoryBn),
                  pickText(locale, course.classType, course.classTypeBn),
                  pickText(locale, course.level, course.levelBn)
                ].filter(Boolean);

                return (
                  <div
                    key={course.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative flex h-44 items-center justify-center bg-primary/5">
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
                      {badges.length > 0 && (
                        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                          {badges.map((b) => (
                            <span
                              key={b}
                              className="rounded-full bg-primary-dark/85 px-2.5 py-1 text-[10px] font-semibold text-gold backdrop-blur"
                            >
                              {b}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="font-heading text-lg font-bold leading-snug text-primary-dark">
                        {pickText(locale, course.title, course.titleBn)}
                      </h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600 line-clamp-3">
                        {pickText(locale, course.description, course.descriptionBn)}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                        {course.duration ? (
                          <span className="text-gray-500">⏱ {course.duration}</span>
                        ) : (
                          <span />
                        )}
                        <span className="flex items-baseline gap-2">
                          {course.originalFee && course.originalFee > course.fee && (
                            <span className="text-xs text-gray-400 line-through">
                              ৳{course.originalFee.toLocaleString()}
                            </span>
                          )}
                          <span className="font-bold text-primary">
                            ৳{course.fee.toLocaleString()}
                          </span>
                        </span>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <Link
                          href={`/courses/${course.slug}`}
                          className="flex-1 rounded-lg border border-primary/30 py-2.5 text-center text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                        >
                          {t("details")}
                        </Link>
                        <Link
                          href={`/free-trial-class?course=${course.slug}`}
                          className="flex-1 rounded-lg bg-primary py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary-dark"
                        >
                          {t("enrollNow")}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
