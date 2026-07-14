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
  "english-speaking": "💬",
};

export default function Courses() {
  const t = useTranslations("courses");
  const locale = useLocale();
  const { courses, isLoading } = useCourses();

  const visibleCourses = courses.slice(0, 6);
  const hasMore = courses.length > 6;

  return (
    <section
      id="courses"
      className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-white"
    >
      {/* Islamic Geometric Pattern Background */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 30% 20%, rgba(212, 175, 55, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 70% 80%, rgba(212, 175, 55, 0.15) 0%, transparent 40%),
            repeating-linear-gradient(45deg, 
              transparent 0px, 
              transparent 25px, 
              rgba(212, 175, 55, 0.08) 25px, 
              rgba(212, 175, 55, 0.08) 26px
            ),
            repeating-linear-gradient(-45deg, 
              transparent 0px, 
              transparent 25px, 
              rgba(212, 175, 55, 0.08) 25px, 
              rgba(212, 175, 55, 0.08) 26px
            )
          `,
          }}
        />

        {/* Islamic Star Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 15% 50%, rgba(212, 175, 55, 0.06) 0%, transparent 25%),
            radial-gradient(circle at 85% 50%, rgba(212, 175, 55, 0.06) 0%, transparent 25%),
            repeating-linear-gradient(30deg, 
              transparent 0px, 
              transparent 40px, 
              rgba(212, 175, 55, 0.04) 40px, 
              rgba(212, 175, 55, 0.04) 41px
            ),
            repeating-linear-gradient(-30deg, 
              transparent 0px, 
              transparent 40px, 
              rgba(212, 175, 55, 0.04) 40px, 
              rgba(212, 175, 55, 0.04) 41px
            )
          `,
          }}
        />
      </div>

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-24 top-1/2 hidden h-[28rem] w-[28rem] -translate-y-1/2 rounded-full border-[24px] border-primary-dark/10 lg:block" />
      <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full border-[16px] border-gold/5 lg:hidden" />
      <div className="pointer-events-none absolute -right-8 top-20 h-32 w-32 rounded-full border-[12px] border-gold/5 lg:hidden" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        {/* Centered heading like the reference */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Decorative top element */}
          <div className="flex justify-center gap-2 mb-4">
            <span className="text-gold/40 text-2xl">✦</span>
            <span className="text-gold/40 text-2xl">✦</span>
            <span className="text-gold/60 text-2xl">✦</span>
            <span className="text-gold/40 text-2xl">✦</span>
            <span className="text-gold/40 text-2xl">✦</span>
          </div>

          <h2 className="font-heading text-2xl font-bold text-primary-dark sm:text-3xl lg:text-4xl">
            {t("title")}
          </h2>

          <div className="mx-auto mt-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/40" />
            <span className="h-1.5 w-3 rounded-full bg-gold" />
            <span className="h-px w-8 bg-gold/40" />
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:mt-5 sm:text-base lg:text-base">
            {t("intro")}
          </p>
        </div>

        {isLoading ? (
          <div
            className="mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3"
            aria-label={t("loading")}
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl bg-white/80 backdrop-blur-sm"
              />
            ))}
          </div>
        ) : visibleCourses.length === 0 ? (
          <p className="mt-12 text-center text-gray-500">{t("empty")}</p>
        ) : (
          <div className="mt-10 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleCourses.map((course, index) => (
              <div
                key={course.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-gold/10 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-gold/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Decorative corner */}
                <div className="absolute -top-1 -right-1 h-8 w-8 border-t-2 border-r-2 border-gold/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-2 border-l-2 border-gold/20 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Illustration / thumbnail */}
                <div className="relative flex h-32 sm:h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 to-gold/5">
                  {course.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={course.thumbnail}
                      alt={pickText(locale, course.title, course.titleBn)}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-dark text-3xl sm:text-4xl text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                      {courseIcons[course.slug] || "📖"}
                    </span>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-6 text-center">
                  <h3 className="font-heading text-sm sm:text-base font-bold uppercase tracking-wide text-primary-dark line-clamp-1">
                    {pickText(locale, course.title, course.titleBn)}
                  </h3>

                  <div className="mx-auto mt-2 flex items-center gap-2">
                    <span className="h-px w-6 bg-gold/30" />
                    <span className="h-1 w-1 rounded-full bg-gold" />
                    <span className="h-px w-6 bg-gold/30" />
                  </div>

                  <p className="mt-3 flex-1 text-xs leading-relaxed text-gray-600 line-clamp-3 sm:line-clamp-4 lg:text-sm">
                    {pickText(locale, course.description, course.descriptionBn)}
                  </p>

                  <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Link
                      href={`/courses/${course.slug}`}
                      className="flex-1 rounded-lg border border-primary/30 px-3 py-2 text-xs font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-md sm:py-2.5 sm:text-sm"
                    >
                      {t("details")}
                    </Link>
                    <Link
                      href={`/free-trial-class?course=${course.slug}`}
                      className="flex-1 rounded-lg bg-gradient-to-r from-primary to-primary-dark px-3 py-2 text-xs font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-105 sm:py-2.5 sm:text-sm"
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
          <div className="mt-10 sm:mt-12 text-center">
            <Link
              href="/courses"
              className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-primary-dark px-8 sm:px-10 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <span>{t("viewAll")}</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
