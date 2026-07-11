"use client";

import { useState } from "react";
import type { Content } from "@prisma/client";

export default function Reviews({ reviews }: { reviews: Content[] }) {
  const [index, setIndex] = useState(0);

  if (!reviews.length) return null;

  const review = reviews[index];
  const rating = (review.data as { rating?: number })?.rating || 5;

  const prev = () => setIndex((index - 1 + reviews.length) % reviews.length);
  const next = () => setIndex((index + 1) % reviews.length);

  return (
    <div>
      <h2 className="flex items-center gap-2 font-heading text-lg font-bold uppercase tracking-wide text-primary-dark sm:text-xl">
        Student Reviews <span className="text-gold">⟶</span>
      </h2>

      <div className="relative mt-6 rounded-2xl border border-gold/20 bg-white p-6 shadow-sm sm:p-8">
        <span className="font-heading text-5xl leading-none text-gold/40">“</span>
        <p className="mt-2 min-h-[72px] text-sm text-gray-700 sm:text-base">
          {review.description}
        </p>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-cream ring-2 ring-gold/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={review.image || "/images/teacher-placeholder.jpg"}
              alt={review.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm tracking-wide text-gold">
              {"★".repeat(rating)}
              {"☆".repeat(5 - rating)}
            </p>
            <p className="text-sm font-semibold text-primary-dark">
              — {review.title}
              {review.subtitle ? `, ${review.subtitle}` : ""}
            </p>
          </div>
        </div>

        {reviews.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous review"
              className="absolute -left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-white text-primary shadow hover:bg-cream"
            >
              ‹
            </button>
            <button
              onClick={next}
              aria-label="Next review"
              className="absolute -right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-white text-primary shadow hover:bg-cream"
            >
              ›
            </button>
          </>
        )}
      </div>

      {reviews.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {reviews.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full transition ${
                i === index ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
