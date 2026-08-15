"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/components/shared/GoogleAnalytics";
import IslamicPattern from "../shared/IslamicPattern";
import { publicMediaUrl } from "@/lib/media-url";

interface HeroProps {
  phone: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  image?: string;
}

export default function Hero({
  phone,
  badge,
  title,
  subtitle,
  image,
}: HeroProps) {
  const t = useTranslations("hero");

  const heroBadge = badge || t("badge");
  const heroTitle =
    title || `${t("titleLine1")} ${t("titleLine2")} ${t("titleLine3")}`;
  const heroSubtitle = subtitle || t("subtitle");
  const heroImage = publicMediaUrl(image, "/images/hero-banner.jpg");

  return (
    <section className="relative z-10 -mb-px min-h-[28rem] overflow-hidden bg-primary-dark sm:z-auto sm:mb-0 sm:min-h-[34rem] lg:min-h-[40rem]">
      {/* Mobile gradient with soft waves */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-primary to-primary-dark sm:hidden">
        <IslamicPattern tone="gold" opacity={0.09} patternSize={104} />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <svg
          aria-hidden="true"
          className="absolute bottom-0 left-0 h-20 w-full"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
        >
          <path
            d="M0 54C190 126 360 130 552 68C760 1 938 -11 1114 38C1244 74 1340 84 1440 48V180H0V54Z"
            className="fill-white/[0.06]"
          />
          <path
            d="M0 112C220 55 410 66 610 119C820 175 1026 164 1206 105C1300 74 1376 72 1440 89V180H0V112Z"
            className="fill-[#f4f6f6]"
          />
        </svg>
      </div>

      {/* Desktop and tablet banner */}
      <div className="absolute inset-0 hidden sm:block">
        <picture className="block h-full w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt={t("imageAlt")}
            fetchPriority="high"
            className="h-full w-full object-cover object-center"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/60 via-primary-dark/60 via-[35%] to-transparent to-[50%]" />
      </div>

      {/* Left-aligned copy over the image */}
      <div className="relative mx-auto flex min-h-[28rem] max-w-7xl items-center px-4 py-12 sm:min-h-[34rem] sm:px-6 sm:py-16 lg:min-h-[40rem] lg:px-8 lg:py-20">
        <div className="max-w-lg text-left lg:max-w-xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold backdrop-blur-sm sm:text-sm">
            <span aria-hidden>☪️</span> {heroBadge}
          </p>

          <h1 className="mt-5 max-w-[20ch] font-heading text-[clamp(1.75rem,4vw,3rem)] font-bold leading-[1.18] text-white sm:mt-6">
            {heroTitle}
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-gold-light/80 lg:text-base">
            {heroSubtitle}
          </p>

          <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row">
            <Link
              href="/free-trial-class"
              onClick={() =>
                trackEvent("free_trial_click", { location: "hero" })
              }
              className="relative isolate w-full overflow-hidden rounded-lg bg-gold px-8 py-3.5 text-center font-semibold text-primary-dark shadow-lg transition hover:bg-gold-light sm:w-auto"
            >
              <span className="relative z-10">{t("startFreeTrial")}</span>
            </Link>
            <Link
              href="/#courses"
              className="relative isolate w-full overflow-hidden rounded-lg border border-white/25 px-8 py-3.5 text-center font-semibold text-white transition hover:border-gold hover:text-gold sm:w-auto"
            >
              <IslamicPattern tone="gold" opacity={0.12} className="z-0" />
              <span className="relative z-10">{t("exploreCourses")}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
