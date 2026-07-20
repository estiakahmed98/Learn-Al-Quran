"use client";

import { useState } from "react";
import type { Content } from "@prisma/client";
import { useTranslations } from "next-intl";
import IslamicPattern from "@/components/shared/IslamicPattern";

export default function FAQ({ faqs }: { faqs: Content[] }) {
  const t = useTranslations("sitePages.faq");
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  if (!faqs.length) return null;

  return (
    <div id="faq" className="relative">
      {/* Decorative elements */}
      <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full border-4 border-gold/5 opacity-50" />
      <div className="absolute -bottom-6 -left-6 h-16 w-16 rounded-full border-4 border-gold/5 opacity-50" />

      <div className="relative">
        {/* Header with decorative elements */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex gap-1">
            <span className="h-1 w-1 rounded-full bg-gold/60" />
            <span className="h-1 w-3 rounded-full bg-gold" />
            <span className="h-1 w-1 rounded-full bg-gold/60" />
          </div>
          <h2 className="flex items-center gap-2 font-heading text-base font-bold uppercase tracking-wide text-primary-dark sm:text-lg">
            <span className="text-gold">❓</span>
            {t("title")}
          </h2>
        </div>

        <div className="mt-1 h-px w-20 bg-gradient-to-r from-gold/60 to-transparent" />

        <div className="mt-5 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="group relative overflow-hidden rounded-xl border border-gold/10 bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-md hover:border-gold/30"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background pattern */}
                <IslamicPattern opacity={0} className="opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300" />

                {/* Decorative corner */}
                <div className="absolute -top-1 -right-1 h-6 w-6 border-t-2 border-r-2 border-gold/10 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -bottom-1 -left-1 h-6 w-6 border-b-2 border-l-2 border-gold/10 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <button
                  className="relative flex w-full items-center justify-between gap-3 px-4 py-3.5 sm:px-5 sm:py-4 text-left text-sm font-semibold text-primary-dark transition-colors duration-300 group-hover:text-primary"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    {/* Question number/badge */}
                    <span
                      className={`hidden sm:flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
                        isOpen
                          ? "bg-gold text-primary-dark"
                          : "bg-primary/10 text-primary-dark/60 group-hover:bg-primary/20"
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span className="flex-1">{faq.title}</span>
                  </span>

                  <span
                    className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? "bg-gold/20 text-gold rotate-180"
                        : "bg-primary/5 text-primary-dark/40 group-hover:bg-primary/10 group-hover:text-primary-dark"
                    }`}
                  >
                    <svg
                      className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="relative border-t border-gold/10 px-4 py-3.5 sm:px-5 sm:py-4 text-sm text-gray-600 bg-gradient-to-b from-gold/5 to-transparent">
                    {/* Decorative quote mark */}
                    <div className="absolute -top-3 -left-2 text-3xl text-gold/5 font-serif">
                      "
                    </div>

                    <div className="relative flex items-start gap-3">
                      <span className="text-gold/30 text-lg">✦</span>
                      <p className="flex-1 leading-relaxed">
                        {faq.description}
                      </p>
                      <span className="text-gold/30 text-lg">✦</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom decorative element */}
        <div className="mt-6 flex justify-center gap-2 opacity-30">
          <span className="h-px w-12 bg-gold/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="h-px w-12 bg-gold/30" />
        </div>
      </div>
    </div>
  );
}
