"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { publicMediaUrl } from "@/lib/media-url";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { GraduationCap, Search, X } from "lucide-react";
import { pickText } from "@/lib/course-content";
import type { CourseListItem } from "@/hooks/useCourses";
import IslamicPattern from "@/components/shared/IslamicPattern";

export type CourseCardData = CourseListItem;

const courseIcons: Record<string, string> = {
  "smart-maktab-learning": "📖",
  "tajweed-master-course": "🎙️",
  "complete-nazera-quran": "📕",
  "complete-hifzul-quran": "🕌",
  "adult-quran-learning": "👤",
  "english-speaking": "💬"
};

export default function CoursesIndexView({ courses }: { courses: CourseCardData[] }) {
  const t = useTranslations("courses");
  const locale = useLocale();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return courses;

    return courses.filter((course) => {
      const searchableText = [
        pickText(locale, course.title, course.titleBn),
        pickText(locale, course.description, course.descriptionBn),
        pickText(locale, course.category, course.categoryBn)
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [courses, searchQuery, locale]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-primary/[0.045] via-white to-white">
      {/* Compact Page Header */}
      <section className="relative overflow-hidden border-b border-gold/10">
        <IslamicPattern tone="green" opacity={0.045} className="absolute inset-0" />

        {/* Small decorative shapes */}
        <div className="pointer-events-none absolute -left-12 top-1/2 hidden h-32 w-32 -translate-y-1/2 rounded-full border-[12px] border-primary-dark/[0.03] lg:block" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border-[10px] border-gold/[0.04]" />

        <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
          <nav className="flex items-center justify-center gap-2 text-xs text-gray-400 sm:text-sm">
            <Link href="/" className="hover:text-gold-dark">
              {t("breadcrumbHome")}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-primary-dark">{t("title")}</span>
          </nav>

          <div className="mx-auto mt-3 max-w-2xl text-center">
            <div className="mb-2 flex items-center justify-center gap-1.5">
              <span className="text-[10px] text-gold/30">✦</span>
              <span className="text-xs text-gold/50">✦</span>
              <span className="text-sm text-gold">✦</span>
              <span className="text-xs text-gold/50">✦</span>
              <span className="text-[10px] text-gold/30">✦</span>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-dark shadow-sm backdrop-blur-sm sm:text-xs">
              <GraduationCap className="h-3.5 w-3.5 text-gold" />
              {t("title")}
            </span>

            <h1 className="mt-3 font-heading text-2xl font-bold leading-tight text-primary-dark sm:text-3xl lg:text-4xl">
              {t("pageTitle")}
            </h1>

            <div className="mx-auto mt-3 flex items-center justify-center gap-2">
              <span className="h-px w-7 bg-gold/30" />
              <span className="h-1 w-3 rounded-full bg-gold" />
              <span className="h-px w-7 bg-gold/30" />
            </div>

            <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-gray-600 sm:text-sm">
              {t("pageSubtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Decorative background circles */}
      <div className="pointer-events-none absolute -left-32 top-40 hidden h-[26rem] w-[26rem] rounded-full border-[30px] border-primary-dark/[0.035] lg:block" />
      <div className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full border-[22px] border-gold/[0.045]" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full border-[18px] border-gold/[0.035]" />

      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* Search toolbar */}
        <div className="rounded-2xl border border-gold/15 bg-white/90 p-4 shadow-lg shadow-primary/5 backdrop-blur-md sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("searchPlaceholder")}
                aria-label={t("searchPlaceholder")}
                className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50/80 pl-12 pr-12 text-sm text-primary-dark outline-none transition-all placeholder:text-gray-400 focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/10 sm:h-13"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-primary-dark"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 lg:justify-end">
              <p className="text-sm text-gray-500">
                {t("showing")}{" "}
                <span className="font-semibold text-primary-dark">{filteredCourses.length}</span>{" "}
                {t("of")} <span className="font-semibold text-primary-dark">{courses.length}</span>{" "}
                {t("coursesLabel")}
              </p>

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-sm font-semibold text-gold transition-colors hover:text-primary-dark"
                >
                  {t("clearSearch")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main states */}
        {filteredCourses.length === 0 ? (
          <div className="mx-auto mt-12 max-w-xl rounded-2xl border border-dashed border-gold/30 bg-white/90 px-6 py-14 text-center shadow-lg shadow-primary/5">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
              {searchQuery ? (
                <Search className="h-7 w-7 text-gold-dark" />
              ) : (
                <GraduationCap className="h-7 w-7 text-gold-dark" />
              )}
            </div>
            <h2 className="mt-5 font-heading text-xl font-bold text-primary-dark">
              {searchQuery ? t("noMatchingTitle") : t("empty")}
            </h2>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-6 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                {t("clearSearch")}
              </button>
            )}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const badges = [
                pickText(locale, course.category, course.categoryBn),
                pickText(locale, course.classType, course.classTypeBn),
                pickText(locale, course.level, course.levelBn)
              ].filter(Boolean);

              return (
                <article
                  key={course.id}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold/15 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-xl hover:shadow-primary/10"
                >
                  <div className="relative overflow-hidden bg-gradient-to-br from-primary/[0.06] via-gold/[0.07] to-primary-dark/[0.08] p-4">
                    <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-xl bg-white shadow-md">
                      {course.thumbnail ? (
                        <Image
                          src={publicMediaUrl(course.thumbnail)}
                          alt={pickText(locale, course.title, course.titleBn)}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-3xl text-white shadow">
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
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="line-clamp-2 font-heading text-lg font-bold leading-7 text-primary-dark transition-colors group-hover:text-primary">
                      {pickText(locale, course.title, course.titleBn)}
                    </h2>

                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-6 text-gray-600">
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
                        <span className="font-bold text-primary">৳{course.fee.toLocaleString()}</span>
                      </span>
                    </div>

                    <div className="mt-4 flex gap-3">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="flex-1 rounded-xl border border-primary/30 py-2.5 text-center text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                      >
                        {t("details")}
                      </Link>
                      <Link
                        href={`/enroll?course=${course.slug}`}
                        className="flex-1 rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-white transition hover:bg-primary-dark"
                      >
                        {t("enrollNow")}
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
