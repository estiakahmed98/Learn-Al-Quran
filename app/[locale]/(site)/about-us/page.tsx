import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Heart } from "lucide-react";
import { getCachedTeachers } from "@/lib/cached-data";
import Teachers from "@/components/home/Teachers";
import IslamicPattern from "@/components/shared/IslamicPattern";
import { buildAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our mission, teaching methodology, and certified Quran teachers.",
  alternates: buildAlternates("/about-us")
};

export const revalidate = 3600;

export default async function AboutUsPage() {
  const [t, teachers] = await Promise.all([
    getTranslations("sitePages.about"),
    getCachedTeachers().catch(() => [])
  ]);

  const objectives = [t("objective1"), t("objective2"), t("objective3"), t("objective4")];
  const differentiators = [
    { title: t("different1Title"), body: t("different1Body") },
    { title: t("different2Title"), body: t("different2Body") },
    { title: t("different3Title"), body: t("different3Body") }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/[0.045] via-white to-white">
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
            <span className="text-primary-dark">{t("eyebrow")}</span>
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
              <Heart className="h-3.5 w-3.5 text-gold" />
              {t("eyebrow")}
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

      <div className="relative mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <h2 className="text-center font-heading text-3xl font-bold text-primary-dark">
          {t("title")}
        </h2>
        <div className="mt-8 space-y-4 text-gray-700">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>

        {/* History */}
        <div className="mt-14">
          <p className="text-sm font-semibold uppercase tracking-wide text-secondary">{t("historyEyebrow")}</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-primary-dark">{t("historyTitle")}</h2>
          <p className="mt-4 leading-7 text-gray-700">{t("historyBody")}</p>
        </div>

        {/* Mission & Vision */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6">
            <h2 className="font-heading text-xl font-bold text-primary-dark">{t("missionTitle")}</h2>
            <p className="mt-3 leading-7 text-gray-700">{t("missionBody")}</p>
          </div>
          <div className="rounded-2xl border border-secondary/20 bg-secondary/5 p-6">
            <h2 className="font-heading text-xl font-bold text-primary-dark">{t("visionTitle")}</h2>
            <p className="mt-3 leading-7 text-gray-700">{t("visionBody")}</p>
          </div>
        </div>

        {/* Objectives */}
        <div className="mt-14">
          <h2 className="font-heading text-2xl font-bold text-primary-dark">{t("objectivesTitle")}</h2>
          <ul className="mt-4 space-y-3">
            {objectives.map((item, index) => (
              <li key={index} className="flex items-start gap-3 leading-7 text-gray-700">
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-xs font-bold text-primary-dark">
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Online education */}
        <div className="mt-14">
          <h2 className="font-heading text-2xl font-bold text-primary-dark">{t("onlineEduTitle")}</h2>
          <p className="mt-4 leading-7 text-gray-700">{t("onlineEduBody")}</p>
        </div>

        {/* Why different */}
        <div className="mt-14">
          <h2 className="font-heading text-2xl font-bold text-primary-dark">{t("differentTitle")}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {differentiators.map((item) => (
              <div key={item.title} className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm">
                <h3 className="font-heading font-bold text-primary-dark">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="mt-14">
          <h2 className="font-heading text-2xl font-bold text-primary-dark">{t("methodologyTitle")}</h2>
          <p className="mt-4 leading-7 text-gray-700">{t("methodologyBody")}</p>
        </div>

        {/* Goals for teachers & students */}
        <div className="mt-14 rounded-2xl bg-primary-dark p-8 text-white">
          <h2 className="font-heading text-2xl font-bold">{t("goalsTitle")}</h2>
          <p className="mt-4 leading-7 text-white/75">{t("goalsBody")}</p>
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <h2 className="font-heading text-2xl font-bold text-primary-dark">{t("ctaTitle")}</h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link href="/courses" className="relative isolate overflow-hidden rounded-full bg-primary px-7 py-3 text-sm font-bold text-white hover:bg-primary-dark">
              <IslamicPattern tone="gold" opacity={0.12} className="z-0" />
              <span className="relative z-10">{t("ctaExploreCourses")}</span>
            </Link>
            <Link href="/free-trial-class" className="relative isolate overflow-hidden rounded-full bg-secondary px-7 py-3 text-sm font-bold text-primary-dark hover:bg-white">
              <IslamicPattern tone="green" opacity={0.12} className="z-0" />
              <span className="relative z-10">{t("ctaBookTrial")}</span>
            </Link>
            <Link href="/contact-us" className="relative isolate overflow-hidden rounded-full border border-primary px-7 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-white">
              <IslamicPattern tone="green" opacity={0.1} className="z-0" />
              <span className="relative z-10">{t("ctaContactUs")}</span>
            </Link>
          </div>
        </div>
      </div>

      <Teachers teachers={teachers} />
    </div>
  );
}
