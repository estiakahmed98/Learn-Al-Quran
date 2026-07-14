"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function About() {
  const t = useTranslations("about");
  const bold = (chunks: React.ReactNode) => (
    <strong className="font-semibold text-primary-dark">{chunks}</strong>
  );

  return (
    <section id="about" className="relative overflow-hidden bg-primary/5">
      {/* Islamic Geometric Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
            repeating-linear-gradient(45deg, 
              transparent 0px, 
              transparent 20px, 
              rgba(212, 175, 55, 0.05) 20px, 
              rgba(212, 175, 55, 0.05) 21px
            ),
            repeating-linear-gradient(-45deg, 
              transparent 0px, 
              transparent 20px, 
              rgba(212, 175, 55, 0.05) 20px, 
              rgba(212, 175, 55, 0.05) 21px
            )
          `,
          }}
        />

        {/* Star Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(212, 175, 55, 0.08) 0%, transparent 30%),
            radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.08) 0%, transparent 30%),
            repeating-linear-gradient(60deg, 
              transparent 0px, 
              transparent 30px, 
              rgba(212, 175, 55, 0.03) 30px, 
              rgba(212, 175, 55, 0.03) 31px
            ),
            repeating-linear-gradient(-60deg, 
              transparent 0px, 
              transparent 30px, 
              rgba(212, 175, 55, 0.03) 30px, 
              rgba(212, 175, 55, 0.03) 31px
            )
          `,
          }}
        />
      </div>

      {/* Decorative circle behind the image */}
      <div className="pointer-events-none absolute -left-24 top-1/2 hidden h-[28rem] w-[28rem] -translate-y-1/2 rounded-full border-[24px] border-primary-dark/10 lg:block" />

      {/* Decorative small circles - Mobile */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full border-8 border-gold/5 lg:hidden" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 h-20 w-20 rounded-full border-4 border-gold/5 lg:hidden" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:gap-10 sm:py-14 lg:grid-cols-[1fr_1.3fr] lg:px-8 lg:py-20">
        {/* Left: illustration */}
        <div className="relative order-first mx-auto w-full max-w-xs sm:max-w-sm">
          <div className="overflow-hidden rounded-2xl border border-primary/10 shadow-lg sm:rounded-3xl">
            {/* Decorative border pattern */}
            <div className="absolute inset-0 pointer-events-none border-2 border-gold/20 rounded-2xl sm:rounded-3xl" />

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about-madrasa.jpg"
              alt={t("imageAlt")}
              className="h-full w-full object-cover aspect-[4/3] sm:aspect-auto"
            />
          </div>

          {/* Decorative corner elements */}
          <div className="absolute -top-3 -right-3 h-8 w-8 border-t-2 border-r-2 border-gold/30 rounded-tr-lg sm:h-10 sm:w-10" />
          <div className="absolute -bottom-3 -left-3 h-8 w-8 border-b-2 border-l-2 border-gold/30 rounded-bl-lg sm:h-10 sm:w-10" />
        </div>

        {/* Right: copy */}
        <div className="relative">
          {/* Decorative top-right pattern - Mobile */}
          <div className="absolute -top-4 -right-4 h-12 w-12 opacity-20 lg:hidden">
            <div className="absolute inset-0 rotate-45 border-2 border-gold/30" />
            <div className="absolute inset-2 rotate-45 border-2 border-gold/30" />
          </div>

          <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl lg:text-3xl">
            <span className="text-gold" aria-hidden>
              ❝
            </span>{" "}
            {t("title")}{" "}
            <span className="text-gold" aria-hidden>
              ❞
            </span>
          </h2>

          <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-600 sm:mt-5 sm:space-y-4 sm:text-base lg:text-base">
            <p className="relative pl-3 sm:pl-4 border-l-2 border-gold/30">
              {t.rich("p1", { b: bold })}
            </p>
            <p className="relative pl-3 sm:pl-4 border-l-2 border-primary/20">
              {t.rich("p2", { b: bold })}
            </p>
            <p className="relative pl-3 sm:pl-4 border-l-2 border-gold/30">
              {t.rich("p3", { b: bold })}
            </p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 sm:mt-8">
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary to-primary-dark px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 sm:px-8 sm:py-2.5"
            >
              <span>{t("learnMore")}</span>
              <svg
                className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>

            {/* Decorative divider */}
            <div className="hidden sm:block w-px h-8 bg-gold/20" />

            <div className="flex items-center gap-1 text-xs text-gray-500 sm:text-sm">
              <span className="text-gold">✦</span>
              <span>{t("subtitle") || "Join our community"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
