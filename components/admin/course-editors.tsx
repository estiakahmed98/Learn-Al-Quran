"use client";

import type { BiText, CurriculumSection, WhyCard } from "@/lib/course-content";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none";

const addBtnClass =
  "rounded-lg border border-dashed border-primary/40 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/5";

const removeBtnClass = "shrink-0 text-xs font-semibold text-red-500 hover:underline";

/* ---------- Bilingual list (learn points / features) ---------- */

export function BiListEditor({
  items,
  onChange,
  enPlaceholder,
  bnPlaceholder,
  addLabel
}: {
  items: BiText[];
  onChange: (items: BiText[]) => void;
  enPlaceholder: string;
  bnPlaceholder: string;
  addLabel: string;
}) {
  function update(i: number, key: keyof BiText, value: string) {
    onChange(items.map((item, idx) => (idx === i ? { ...item, [key]: value } : item)));
  }

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-5 shrink-0 text-center text-xs text-gray-400">{i + 1}</span>
          <input
            value={item.en}
            onChange={(e) => update(i, "en", e.target.value)}
            className={inputClass}
            placeholder={enPlaceholder}
          />
          <input
            value={item.bn}
            onChange={(e) => update(i, "bn", e.target.value)}
            className={inputClass}
            placeholder={bnPlaceholder}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            className={removeBtnClass}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, { en: "", bn: "" }])}
        className={addBtnClass}
      >
        + {addLabel}
      </button>
    </div>
  );
}

/* ---------- Why cards ---------- */

export function WhyCardsEditor({
  cards,
  onChange
}: {
  cards: WhyCard[];
  onChange: (cards: WhyCard[]) => void;
}) {
  function update(i: number, key: keyof WhyCard, value: string) {
    onChange(cards.map((card, idx) => (idx === i ? { ...card, [key]: value } : card)));
  }

  return (
    <div className="space-y-3">
      {cards.map((card, i) => (
        <div key={i} className="rounded-xl border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Card {i + 1}</span>
            <button
              type="button"
              onClick={() => onChange(cards.filter((_, idx) => idx !== i))}
              className={removeBtnClass}
            >
              Remove
            </button>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <input
              value={card.titleEn}
              onChange={(e) => update(i, "titleEn", e.target.value)}
              className={inputClass}
              placeholder="Title (English)"
            />
            <input
              value={card.titleBn}
              onChange={(e) => update(i, "titleBn", e.target.value)}
              className={inputClass}
              placeholder="শিরোনাম (বাংলা)"
            />
            <textarea
              rows={2}
              value={card.bodyEn}
              onChange={(e) => update(i, "bodyEn", e.target.value)}
              className={inputClass}
              placeholder="Body (English)"
            />
            <textarea
              rows={2}
              value={card.bodyBn}
              onChange={(e) => update(i, "bodyBn", e.target.value)}
              className={inputClass}
              placeholder="বিবরণ (বাংলা)"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...cards, { titleEn: "", titleBn: "", bodyEn: "", bodyBn: "" }])
        }
        className={addBtnClass}
      >
        + Add card
      </button>
    </div>
  );
}

/* ---------- Curriculum (sections + lessons) ---------- */

export function CurriculumEditor({
  sections,
  onChange
}: {
  sections: CurriculumSection[];
  onChange: (sections: CurriculumSection[]) => void;
}) {
  function updateSection(i: number, patch: Partial<CurriculumSection>) {
    onChange(sections.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function updateLesson(si: number, li: number, patch: Partial<CurriculumSection["lessons"][number]>) {
    const section = sections[si];
    updateSection(si, {
      lessons: section.lessons.map((l, idx) => (idx === li ? { ...l, ...patch } : l))
    });
  }

  return (
    <div className="space-y-4">
      {sections.map((section, si) => (
        <div key={si} className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {si + 1}
            </span>
            <input
              value={section.titleEn}
              onChange={(e) => updateSection(si, { titleEn: e.target.value })}
              className={inputClass}
              placeholder="Section title (English)"
            />
            <input
              value={section.titleBn}
              onChange={(e) => updateSection(si, { titleBn: e.target.value })}
              className={inputClass}
              placeholder="সেকশন শিরোনাম (বাংলা)"
            />
            <button
              type="button"
              onClick={() => onChange(sections.filter((_, idx) => idx !== si))}
              className={removeBtnClass}
            >
              Remove
            </button>
          </div>

          <div className="mt-3 space-y-2 pl-8">
            {section.lessons.map((lesson, li) => (
              <div key={li} className="flex flex-wrap items-center gap-2 rounded-lg bg-white p-2">
                <input
                  value={lesson.titleEn}
                  onChange={(e) => updateLesson(si, li, { titleEn: e.target.value })}
                  className={`${inputClass} min-w-[10rem] flex-1`}
                  placeholder="Lesson (English)"
                />
                <input
                  value={lesson.titleBn}
                  onChange={(e) => updateLesson(si, li, { titleBn: e.target.value })}
                  className={`${inputClass} min-w-[10rem] flex-1`}
                  placeholder="লেসন (বাংলা)"
                />
                <input
                  value={lesson.duration}
                  onChange={(e) => updateLesson(si, li, { duration: e.target.value })}
                  className={`${inputClass} w-24 flex-none`}
                  placeholder="1 hour"
                />
                <input
                  value={lesson.durationBn}
                  onChange={(e) => updateLesson(si, li, { durationBn: e.target.value })}
                  className={`${inputClass} w-24 flex-none`}
                  placeholder="১ ঘণ্টা"
                />
                <label className="flex items-center gap-1 text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={lesson.isLive}
                    onChange={(e) => updateLesson(si, li, { isLive: e.target.checked })}
                    className="h-3.5 w-3.5"
                  />
                  Live
                </label>
                <button
                  type="button"
                  onClick={() =>
                    updateSection(si, {
                      lessons: section.lessons.filter((_, idx) => idx !== li)
                    })
                  }
                  className={removeBtnClass}
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                updateSection(si, {
                  lessons: [
                    ...section.lessons,
                    { titleEn: "", titleBn: "", duration: "", durationBn: "", isLive: true }
                  ]
                })
              }
              className={addBtnClass}
            >
              + Add lesson
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...sections, { titleEn: "", titleBn: "", lessons: [] }])}
        className={addBtnClass}
      >
        + Add section
      </button>
    </div>
  );
}
