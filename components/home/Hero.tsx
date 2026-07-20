"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/components/shared/GoogleAnalytics";

interface HeroProps {
  phone: string;
  badge?: string;
  title?: string;
  subtitle?: string;
  image?: string;
}

export default function Hero({ phone, badge, title, subtitle, image }: HeroProps) {
  const t = useTranslations("hero");

  const heroBadge = badge || t("badge");
  const heroTitle = title || `${t("titleLine1")} ${t("titleLine2")} ${t("titleLine3")}`;
  const heroSubtitle = subtitle || t("subtitle");
  const heroImage = image || "/images/hero-banner.jpg";

  return (
    <section className="relative min-h-[32rem] overflow-hidden bg-primary-dark sm:min-h-[38rem] lg:min-h-[44rem]">
      {/* Full-bleed cover image */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImage} alt={t("imageAlt")} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/75 to-primary-dark/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-transparent to-transparent" />
      </div>

      {/* Left-aligned copy over the image */}
      <div className="relative mx-auto flex min-h-[32rem] max-w-7xl items-center px-4 py-14 sm:min-h-[38rem] lg:min-h-[44rem] lg:px-8 lg:py-24">
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
              className="w-full rounded-lg bg-gold px-8 py-3.5 text-center font-semibold text-primary-dark shadow-lg transition hover:bg-gold-light sm:w-auto"
            >
              {t("startFreeTrial")}
            </Link>
            <Link
              href="/#courses"
              className="w-full rounded-lg border border-white/25 px-8 py-3.5 text-center font-semibold text-white transition hover:border-gold hover:text-gold sm:w-auto"
            >
              {t("exploreCourses")}
            </Link>
          </div>

          {phone && (
            <a
              href={`tel:${phone}`}
              onClick={() => trackEvent("call_click", { location: "hero" })}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-gold"
            >
              📞 {t("callUs")}: <span dir="ltr">{phone}</span>
            </a>
          )}

          <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-primary/60 p-3 shadow-xl backdrop-blur">
            <div className="flex items-center gap-1.5">
              <p className="text-lg font-bold text-white">5.0</p>
              <p className="text-xs tracking-wider text-gold" aria-label="5 out of 5 stars">
                ★★★★★
              </p>
            </div>
            <span className="h-6 w-px bg-white/15" />
            <p className="max-w-[10rem] text-[11px] leading-snug text-white/70">{t("trustedBy")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
