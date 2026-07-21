"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import PriceCard from "@/components/courses/PriceCard";
import CurriculumAccordion from "@/components/courses/CurriculumAccordion";
import ReviewForm from "@/components/home/ReviewForm";
import {
  discountPercent,
  getCurriculumSections,
  getFaqs,
  getFeatures,
  getLearnPoints,
  getWhyCards,
  pickText
} from "@/lib/course-content";
import { useState } from "react";

export interface SerializedCourse {
  id: string;
  title: string;
  titleBn: string | null;
  slug: string;
  description: string;
  descriptionBn: string | null;
  thumbnail: string | null;
  bannerImage: string | null;
  category: string | null;
  categoryBn: string | null;
  courseType: string | null;
  courseTypeBn: string | null;
  classType: string | null;
  classTypeBn: string | null;
  level: string | null;
  levelBn: string | null;
  instructorName: string | null;
  totalLessons: number | null;
  totalHours: number | null;
  startDate: string | null;
  enrollDeadline: string | null;
  fee: number;
  originalFee: number | null;
  couponCode: string | null;
  couponPercent: number | null;
  certificate: boolean;
  duration: string | null;
  curriculum: unknown;
  learnPoints: unknown;
  features: unknown;
  whyCards: unknown;
  faqs: unknown;
}

export interface SerializedReview {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  data: unknown;
}

function formatDate(locale: string, iso: string | null) {
  if (!iso) return null;
  const date = new Date(iso);
  if (isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function localizeDigits(locale: string, value: number) {
  return locale === "bn" ? new Intl.NumberFormat("bn-BD").format(value) : String(value);
}

const whyIcons = ["🕌", "📿", "🤲", "💰", "🌙", "📖", "🕋", "⭐"];

export default function CourseDetailView({
  course,
  reviews
}: {
  course: SerializedCourse;
  reviews: SerializedReview[];
}) {
  const t = useTranslations("courseDetail");
  const locale = useLocale();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const title = pickText(locale, course.title, course.titleBn);
  const description = pickText(locale, course.description, course.descriptionBn);
  const learnPoints = getLearnPoints(course);
  const features = getFeatures(course);
  const whyCards = getWhyCards(course);
  const sections = getCurriculumSections(course);
  const faqs = getFaqs(course);
  const discount = discountPercent(course);
  const startDateText = formatDate(locale, course.startDate);
  const deadlineText = formatDate(locale, course.enrollDeadline);
  const totalCurriculumLessons = sections.reduce((sum, s) => sum + s.lessons.length, 0);
  const lessonTotal = course.totalLessons ?? (totalCurriculumLessons || null);

  const badges = [
    pickText(locale, course.category, course.categoryBn),
    pickText(locale, course.courseType, course.courseTypeBn),
    pickText(locale, course.classType, course.classTypeBn)
  ].filter(Boolean);

  const metaItems = [
    course.totalHours
      ? { icon: "🕐", label: t("hoursValue", { count: localizeDigits(locale, course.totalHours) }) }
      : course.duration
        ? { icon: "🕐", label: course.duration }
        : null,
    lessonTotal
      ? { icon: "📚", label: t("lessonsValue", { count: localizeDigits(locale, lessonTotal) }) }
      : null,
    course.level || course.levelBn
      ? { icon: "📊", label: pickText(locale, course.level, course.levelBn) }
      : null,
    startDateText ? { icon: "📅", label: `${t("classStart")}: ${startDateText}` } : null
  ].filter(Boolean) as { icon: string; label: string }[];

  const glance = [
    lessonTotal
      ? { value: localizeDigits(locale, lessonTotal), label: t("glanceLessons") }
      : null,
    course.totalHours
      ? { value: localizeDigits(locale, course.totalHours), label: t("glanceHours") }
      : null,
    course.classType || course.classTypeBn
      ? { value: pickText(locale, course.classType, course.classTypeBn), label: t("glanceClassType") }
      : null,
    course.level || course.levelBn
      ? { value: pickText(locale, course.level, course.levelBn), label: t("glanceLevel") }
      : null
  ].filter(Boolean) as { value: string; label: string }[];

  const enrollHref = `/enroll?course=${course.slug}`;

  return (
    <div>
      {/* ============ Hero ============ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary-dark to-primary">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-[0.04]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.2fr_1fr] lg:px-8 lg:py-16">
          <div>
            {/* Breadcrumb */}
            <nav className="flex flex-wrap items-center gap-2 text-xs text-white/60 sm:text-sm">
              <Link href="/" className="hover:text-gold">
                {t("home")}
              </Link>
              <span aria-hidden>/</span>
              <Link href="/courses" className="hover:text-gold">
                {t("courses")}
              </Link>
              <span aria-hidden>/</span>
              <span className="text-white/90">{title}</span>
            </nav>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gold"
                  >
                    {b}
                  </span>
                ))}
              </div>
            )}

            <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-white lg:text-4xl">
              {title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/80 lg:text-base">
              {description}
            </p>

            {learnPoints.length > 0 && (
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {learnPoints.slice(0, 4).map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/90">
                    <span className="mt-0.5 text-secondary-light" aria-hidden>
                      ✔
                    </span>
                    {pickText(locale, p.en, p.bn)}
                  </li>
                ))}
              </ul>
            )}

            {course.instructorName && (
              <div className="mt-7 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-bold text-primary-dark">
                  {course.instructorName.charAt(0)}
                </span>
                <span className="text-sm font-semibold text-white">{course.instructorName}</span>
              </div>
            )}

            {metaItems.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/75">
                {metaItems.map((m) => (
                  <span key={m.label} className="inline-flex items-center gap-1.5">
                    <span aria-hidden>{m.icon}</span> {m.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Price card */}
          <div className="lg:pl-4">
            <PriceCard
              slug={course.slug}
              fee={course.fee}
              originalFee={course.originalFee}
              discountPercent={discount}
              couponCode={course.couponCode}
              couponPercent={course.couponPercent}
              bannerImage={course.bannerImage || course.thumbnail}
              title={title}
              deadlineText={deadlineText}
            />
          </div>
        </div>
      </section>

      {/* ============ Why this course ============ */}
      {whyCards.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
            <h2 className="text-center font-heading text-2xl font-bold text-primary-dark lg:text-3xl">
              {t("whyTitle")}
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {whyCards.map((card, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl">
                    {whyIcons[i % whyIcons.length]}
                  </span>
                  <h3 className="mt-4 font-heading text-base font-bold text-primary-dark">
                    {pickText(locale, card.titleEn, card.titleBn)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {pickText(locale, card.bodyEn, card.bodyBn)}
                  </p>
                </div>
              ))}
            </div>

            <Link
              href={enrollHref}
              className="mt-10 block rounded-2xl bg-primary-dark py-5 text-center font-heading text-base font-bold text-white transition hover:bg-primary lg:text-lg"
            >
              {t("ctaBand")}
            </Link>
          </div>
        </section>
      )}

      {/* ============ What you'll learn ============ */}
      {learnPoints.length > 0 && (
        <section className="bg-cream">
          <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
            <h2 className="text-center font-heading text-2xl font-bold text-primary-dark lg:text-3xl">
              {t("learnTitle")}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">{t("learnSubtitle")}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {learnPoints.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-xl border border-secondary/20 bg-secondary/5 px-5 py-4"
                >
                  <span className="text-secondary" aria-hidden>
                    ✔
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {pickText(locale, p.en, p.bn)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ At a glance + What you get ============ */}
      {(glance.length > 0 || features.length > 0) && (
        <section className="bg-white">
          <div className="mx-auto grid max-w-7xl items-stretch gap-8 px-4 py-14 lg:grid-cols-2 lg:px-8">
            {glance.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
                <h3 className="font-heading text-lg font-bold text-primary-dark">
                  {t("glanceTitle")}
                </h3>
                <div className="mt-6 grid grid-cols-2 gap-4">
                  {glance.map((g) => (
                    <div key={g.label} className="rounded-xl bg-secondary/5 px-4 py-6 text-center">
                      <p className="font-heading text-2xl font-bold text-primary">{g.value}</p>
                      <p className="mt-1 text-xs text-gray-500">{g.label}</p>
                    </div>
                  ))}
                </div>
                {course.certificate && (
                  <p className="mt-5 flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm font-medium text-primary-dark">
                    <span className="text-gold" aria-hidden>
                      ✔
                    </span>
                    {t("certificateNote")}
                  </p>
                )}
              </div>
            )}

            {features.length > 0 && (
              <div className="rounded-2xl bg-primary-dark p-6 sm:p-8">
                <h3 className="font-heading text-lg font-bold text-white">{t("featuresTitle")}</h3>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {features.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <span className="text-secondary-light" aria-hidden>
                        ✔
                      </span>
                      <span className="text-sm text-white/90">{pickText(locale, f.en, f.bn)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ============ Curriculum ============ */}
      {sections.length > 0 && (
        <section className="bg-cream">
          <div className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
            <h2 className="text-center font-heading text-2xl font-bold text-primary-dark lg:text-3xl">
              {t("curriculumTitle")}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-500">
              {t("curriculumStats", {
                sections: localizeDigits(locale, sections.length),
                lessons: localizeDigits(locale, totalCurriculumLessons),
                hours: localizeDigits(locale, course.totalHours ?? totalCurriculumLessons)
              })}
            </p>
            <div className="mt-8">
              <CurriculumAccordion sections={sections} />
            </div>
          </div>
        </section>
      )}

      {/* ============ Testimonials ============ */}
      {reviews.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
            <h2 className="text-center font-heading text-2xl font-bold text-primary-dark lg:text-3xl">
              {t("reviewsTitle")}
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => {
                const rating = (r.data as { rating?: number } | null)?.rating || 5;
                return (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
                  >
                    <p className="tracking-wider text-gold" aria-label={`${rating}/5`}>
                      {"★".repeat(rating)}
                      <span className="text-gray-300">{"★".repeat(5 - rating)}</span>
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      &ldquo;{r.description}&rdquo;
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-bold text-primary-dark">
                        {r.title.charAt(0)}
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-primary-dark">{r.title}</span>
                        {r.subtitle && (
                          <span className="block text-xs text-gray-400">{r.subtitle}</span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ FAQ ============ */}
      {faqs.length > 0 && (
        <section className="bg-cream">
          <div className="mx-auto max-w-4xl px-4 py-14 lg:px-8">
            <h2 className="text-center font-heading text-2xl font-bold text-primary-dark lg:text-3xl">
              {t("faqTitle")}
            </h2>
            <div className="mt-8 space-y-3">
              {faqs.map((faq, i) => {
                const isOpen = openFaqIndex === i;
                return (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold text-primary-dark"
                      onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                      aria-expanded={isOpen}
                    >
                      <span className="flex-1">{pickText(locale, faq.questionEn, faq.questionBn)}</span>
                      <span
                        className={`shrink-0 text-gold transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden
                      >
                        ▼
                      </span>
                    </button>
                    {isOpen && (
                      <div className="border-t border-gray-100 px-5 py-4 text-sm leading-relaxed text-gray-600">
                        {pickText(locale, faq.answerEn, faq.answerBn)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ============ Review submission ============ */}
      <section className="bg-cream">
        <div className="mx-auto max-w-2xl px-4 py-14 lg:px-8">
          <ReviewForm />
        </div>
      </section>

      {/* ============ Bottom enroll ============ */}
      <section className="bg-gradient-to-br from-primary-dark to-primary">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center lg:px-8">
          <h2 className="font-heading text-2xl font-bold text-white lg:text-3xl">
            {t("bottomTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/75">{t("bottomSubtitle")}</p>
          <Link
            href={enrollHref}
            className="mt-7 inline-block rounded-xl bg-gold px-12 py-4 font-heading text-base font-bold text-primary-dark shadow-xl transition hover:bg-gold-light"
          >
            {t("enrollInCourse")}
          </Link>
          {deadlineText && (
            <p className="mt-4 text-sm font-semibold text-gold-light">
              {t("enrollDeadline")}: {deadlineText}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
