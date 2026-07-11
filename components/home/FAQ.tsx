"use client";

import { useState } from "react";
import type { Content } from "@prisma/client";

export default function FAQ({ faqs }: { faqs: Content[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  if (!faqs.length) return null;

  return (
    <div id="faq">
      <h2 className="flex items-center gap-2 font-heading text-base font-bold uppercase tracking-wide text-primary-dark sm:text-lg">
        Frequently Asked Questions
      </h2>

      <div className="mt-5 space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="overflow-hidden rounded-xl border border-gold/20 bg-white shadow-sm"
            >
              <button
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-primary-dark"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                aria-expanded={isOpen}
              >
                {faq.title}
                <span className={`shrink-0 text-gold transition-transform ${isOpen ? "rotate-180" : ""}`}>
                  ▾
                </span>
              </button>
              {isOpen && (
                <div className="border-t border-gold/10 px-4 py-3 text-sm text-gray-600">
                  {faq.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
