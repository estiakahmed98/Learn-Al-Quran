"use client";

import Image from "next/image";
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
    <section className="relative min-h-[32rem] overflow-hidden bg-primary-dark sm:min-h-[38rem] lg:min-h-[44rem]">
      {/* Full-bleed cover image */}
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt={t("imageAlt")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-primary-dark/15 sm:bg-gradient-to-r sm:from-primary-dark/60 sm:via-primary-dark/60 sm:via-[35%] sm:to-transparent sm:to-[50%]" />
      </div>

      {/* Left-aligned copy over the image */}
      <div className="relative mx-auto flex min-h-[32rem] max-w-[90vw] items-center px-4 py-14 sm:min-h-[38rem] lg:min-h-[44rem] lg:px-8 lg:py-24">
        <div className="max-w-xl text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold backdrop-blur-sm sm:text-sm">
            <span aria-hidden>☪️</span> {heroBadge}
          </p>

          <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.15] text-white sm:text-5xl lg:text-6xl">
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
