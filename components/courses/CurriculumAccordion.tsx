"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { CurriculumSection } from "@/lib/course-content";
import { pickText } from "@/lib/course-content";

export default function CurriculumAccordion({ sections }: { sections: CurriculumSection[] }) {
  const t = useTranslations("courseDetail");
  const locale = useLocale();
  const [open, setOpen] = useState<number | null>(0);

  if (!sections.length) return null;

  return (
    <div className="space-y-3">
      {sections.map((section, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center gap-4 bg-gray-50 px-5 py-4 text-left"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {i + 1}
              </span>
              <span className="flex-1">
                <span className="block text-sm font-bold text-primary-dark sm:text-base">
                  {pickText(locale, section.titleEn, section.titleBn)}
                </span>
                {section.lessons.length > 0 && (
                  <span className="mt-0.5 block text-xs text-gray-500">
                    {t("lessonCount", { count: section.lessons.length })}
                  </span>
                )}
              </span>
              <span
                className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                aria-hidden
              >
                ▾
              </span>
            </button>

            {isOpen && section.lessons.length > 0 && (
              <ul className="divide-y divide-gray-100">
                {section.lessons.map((lesson, j) => (
                  <li key={j} className="flex items-center gap-3 px-5 py-3.5">
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-500"
                      aria-hidden
                    >
                      ▶
                    </span>
                    <span className="flex-1 text-sm text-gray-700">
                      {pickText(locale, lesson.titleEn, lesson.titleBn)}
                    </span>
                    {lesson.isLive && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" aria-hidden />
                        {t("live")}
                      </span>
                    )}
                    {(lesson.duration || lesson.durationBn) && (
                      <span className="text-xs text-gray-400">
                        {pickText(locale, lesson.duration, lesson.durationBn)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
