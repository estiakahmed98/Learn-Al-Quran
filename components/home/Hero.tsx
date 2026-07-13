"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/components/shared/GoogleAnalytics";

export default function Hero({ phone }: { phone: string }) {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-primary-dark">
      {/* subtle decorations */}
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-[0.04]" />
      <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-primary/60 blur-3xl" />
      <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-primary/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 lg:grid-cols-2 lg:px-8 lg:py-24">
        {/* Left: copy */}
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 text-xs font-semibold text-gold sm:text-sm">
            <span aria-hidden>☪️</span> {t("badge")}
          </p>

          <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.15] text-white sm:text-5xl lg:text-6xl">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
            <br />
            <span className="text-gold">{t("titleLine3")}</span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-gold-light/80 lg:mx-0 lg:text-base">
            {t("subtitle")}
          </p>

          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
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
        </div>

        {/* Right: image with floating cards (shown first on mobile) */}
        <div className="relative order-first mx-auto w-full max-w-lg lg:order-none">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-banner.jpg"
              alt={t("imageAlt")}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/40 to-transparent" />
          </div>

          {/* Rating card */}
          <div className="absolute -top-4 right-2 rounded-xl border border-white/10 bg-primary/90 p-2.5 shadow-xl backdrop-blur sm:-right-4 sm:-top-5 sm:rounded-2xl sm:p-4">
            <p className="text-lg font-bold text-white sm:text-2xl">5.0</p>
            <p
              className="text-xs tracking-wider text-gold sm:text-sm"
              aria-label="5 out of 5 stars"
            >
              ★★★★★
            </p>
            <p className="mt-1 max-w-[7rem] text-[10px] text-white/70 sm:max-w-[9rem] sm:text-xs">
              {t("trustedBy")}
            </p>
          </div>

          {/* Info card */}
          <div className="absolute -bottom-4 left-2 flex max-w-[14rem] items-center gap-2 rounded-xl border border-white/10 bg-primary/90 p-2.5 shadow-xl backdrop-blur sm:-bottom-6 sm:-left-6 sm:max-w-[18rem] sm:gap-3 sm:rounded-2xl sm:p-4">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/15 text-base sm:h-12 sm:w-12 sm:rounded-xl sm:text-2xl"
              aria-hidden
            >
              📖
            </span>
            <div>
              <p className="text-xs font-semibold text-white sm:text-sm">
                {t("cardTitle")}
              </p>
              <p className="mt-0.5 text-[10px] leading-snug text-white/70 sm:text-xs">
                {t("cardBody")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
