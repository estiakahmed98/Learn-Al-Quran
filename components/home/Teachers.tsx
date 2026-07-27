"use client";

import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
import IslamicPattern from "@/components/shared/IslamicPattern";
import { publicMediaUrl } from "@/lib/media-url";

export interface TeacherCard {
  id: string;
  name: string;
  designation?: string | null;
  description?: string | null;
  imageUrl?: string | null;
}

function TeacherCardItem({
  teacher,
  index,
}: {
  teacher: TeacherCard;
  index: number;
}) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-gold/10 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-gold/30"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Image panel */}
      <div className="relative isolate h-56 w-full shrink-0 overflow-hidden bg-primary-dark sm:h-64">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={publicMediaUrl(teacher.imageUrl, "/images/teacher-placeholder.jpg")}
          alt={teacher.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/15 to-transparent" />
        <IslamicPattern tone="gold" opacity={0.1} />

        {/* Corner icon badge */}
        <span className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/25 text-gold shadow-lg backdrop-blur-md">
          <GraduationCap className="h-5 w-5" />
        </span>

        {/* Decorative number */}
        <span
          aria-hidden
          className="absolute -right-1 -top-3 z-0 font-heading text-7xl font-bold leading-none text-white/10"
        >
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Bottom info panel over image */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
          <h3 className="font-heading text-base font-bold uppercase tracking-wide text-white sm:text-lg">
            {teacher.name}
          </h3>
          {teacher.designation && (
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold">
              {teacher.designation}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-1 flex-col p-4 text-center sm:p-5">
        <div className="mx-auto flex items-center gap-2">
          <span className="h-px w-6 bg-gold/30" />
          <span className="h-1 w-1 rounded-full bg-gold" />
          <span className="h-px w-6 bg-gold/30" />
        </div>

        {teacher.description && (
          <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700 lg:text-sm">
            {teacher.description}
          </p>
        )}
      </div>

      {/* Decorative corner elements */}
      <div className="pointer-events-none absolute -top-1 -right-1 h-8 w-8 border-t-2 border-r-2 border-gold/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="pointer-events-none absolute -bottom-1 -left-1 h-8 w-8 border-b-2 border-l-2 border-gold/20 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

interface TeachersProps {
  teachers: TeacherCard[];
  embedded?: boolean;
}

export default function Teachers({
  teachers,
  embedded = false,
}: TeachersProps) {
  const t = useTranslations("sitePages.teachers");

  if (!teachers.length) return null;

  const title = embedded ? t("embeddedTitle") : t("title");
  const subtitle = embedded ? t("embeddedSubtitle") : t("eyebrow");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-white">
      <IslamicPattern opacity={0.04} />

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -left-20 top-1/2 hidden h-[20rem] w-[20rem] -translate-y-1/2 rounded-full border-[20px] border-primary-dark/5 lg:block" />
      <div className="pointer-events-none absolute -right-12 bottom-0 h-32 w-32 rounded-full border-[12px] border-gold/5 lg:hidden" />
      <div className="pointer-events-none absolute -left-8 top-20 h-24 w-24 rounded-full border-[10px] border-gold/5 lg:hidden" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:pt-16 lg:pb-8">
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Decorative top element */}
          <div className="flex justify-center gap-2 mb-4">
            <span className="text-gold/30 text-xl">✦</span>
            <span className="text-gold/30 text-xl">✦</span>
            <span className="text-gold/50 text-xl">✦</span>
            <span className="text-gold/30 text-xl">✦</span>
            <span className="text-gold/30 text-xl">✦</span>
          </div>

          {!embedded && (
            <p className="font-semibold uppercase tracking-wider text-secondary text-xs sm:text-sm">
              {subtitle}
            </p>
          )}

          <h2
            className={`font-heading font-bold text-primary-dark ${
              embedded
                ? "text-2xl sm:text-3xl lg:text-4xl"
                : "mt-2 text-2xl sm:text-3xl lg:text-4xl"
            }`}
          >
            {title}
          </h2>

          <div className="mx-auto mt-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/40" />
            <span className="h-1.5 w-3 rounded-full bg-gold" />
            <span className="h-px w-8 bg-gold/40" />
          </div>

          {embedded && (
            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:mt-5 sm:text-base">
              {subtitle}
            </p>
          )}
        </div>

        {/* Every active teacher remains visible; the grid wraps responsively. */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {teachers.map((teacher, index) => (
            <TeacherCardItem
              key={teacher.id}
              teacher={teacher}
              index={index}
            />
          ))}
        </div>

        {/* Bottom Decorative Element */}
        <div className="mt-6 flex justify-center gap-2 opacity-30">
          <span className="h-px w-12 bg-gold/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="h-px w-12 bg-gold/30" />
        </div>
      </div>
    </section>
  );
}
