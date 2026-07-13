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
      {/* decorative circle behind the image, like the calligraphy medallion */}
      <div className="pointer-events-none absolute -right-24 top-1/2 hidden h-[28rem] w-[28rem] -translate-y-1/2 rounded-full border-[24px] border-primary-dark/10 lg:block" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 lg:grid-cols-[1.3fr_1fr] lg:px-8 lg:py-20">
        {/* Left: copy */}
        <div>
          <h2 className="font-heading text-2xl font-bold text-primary lg:text-3xl">
            <span className="text-gold" aria-hidden>❝</span> {t("title")} <span className="text-gold" aria-hidden>❞</span>
          </h2>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-gray-600 lg:text-base">
            <p>{t.rich("p1", { b: bold })}</p>
            <p>{t.rich("p2", { b: bold })}</p>
            <p>{t.rich("p3", { b: bold })}</p>
          </div>

          <Link
            href="/contact-us"
            className="mt-8 inline-block rounded-lg bg-primary px-8 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-primary-dark"
          >
            {t("learnMore")}
          </Link>
        </div>

        {/* Right: illustration */}
        <div className="relative mx-auto w-full max-w-sm">
          <div className="overflow-hidden rounded-3xl border border-primary/10 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about-madrasa.jpg"
              alt={t("imageAlt")}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
