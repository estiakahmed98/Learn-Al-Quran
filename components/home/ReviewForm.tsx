"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import IslamicPattern from "@/components/shared/IslamicPattern";

export default function ReviewForm() {
  const t = useTranslations("sitePages.reviewForm");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        role: role.trim(),
        message: message.trim(),
        rating,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setError(t("error"));
      return;
    }

    setSubmitted(true);
    setName("");
    setRole("");
    setMessage("");
    setRating(5);
  }

  if (submitted) {
    return (
      <div className="relative group overflow-hidden rounded-2xl border border-gold/10 bg-white/90 backdrop-blur-sm p-6 text-center shadow-lg sm:p-8 transition-all duration-300 hover:shadow-xl hover:border-gold/30">
        {/* Decorative pattern */}
        <IslamicPattern opacity={0.03} />

        {/* Decorative corners */}
        <div className="absolute -top-1 -right-1 h-8 w-8 border-t-2 border-r-2 border-gold/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-2 border-l-2 border-gold/20 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative">
          <div className="flex justify-center mb-3">
            <span className="text-5xl animate-bounce">🎉</span>
          </div>
          <h3 className="font-heading text-xl font-bold text-primary-dark">
            {t("thankYou")}
          </h3>
          <div className="mx-auto mt-2 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-gold/40" />
            <span className="h-1.5 w-3 rounded-full bg-gold" />
            <span className="h-px w-8 bg-gold/40" />
          </div>
          <p className="mt-3 text-sm text-gray-600 leading-relaxed">
            {t("success")}
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary-dark transition-colors duration-300 group-hover:gap-3"
          >
            <span>{t("another")}</span>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative group overflow-hidden rounded-2xl border border-gold/10 bg-white/90 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-gold/30 sm:p-8"
    >
      <IslamicPattern opacity={0.03} />

      {/* Decorative corners */}
      <div className="absolute -top-1 -right-1 h-8 w-8 border-t-2 border-r-2 border-gold/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-2 border-l-2 border-gold/20 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <div className="flex gap-1">
            <span className="h-1 w-1 rounded-full bg-gold/60" />
            <span className="h-1 w-3 rounded-full bg-gold" />
            <span className="h-1 w-1 rounded-full bg-gold/60" />
          </div>
          <h3 className="font-heading text-lg font-bold text-primary-dark">
            {t("title")}
          </h3>
        </div>

        <p className="text-sm text-gray-500 flex items-center gap-2">
          <span className="text-gold">✦</span>
          {t("subtitle")}
        </p>

        <div className="mt-1 h-px w-16 bg-gradient-to-r from-gold/60 to-transparent" />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="group/input">
            <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-gray-600">
              <span className="text-gold">👤</span>
              {t("name")} <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/50"
              placeholder={t("namePlaceholder")}
            />
          </div>
          <div className="group/input">
            <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-gray-600">
              <span className="text-gold">📍</span>
              {t("role")}
            </label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/50"
              placeholder={t("rolePlaceholder")}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-gray-600">
            <span className="text-gold">⭐</span>
            {t("rating")} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-1.5 text-3xl">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={t("starLabel", { count: star })}
                className={`transition-all duration-300 hover:scale-125 ${
                  star <= rating
                    ? "text-gold drop-shadow-sm hover:text-gold-light"
                    : "text-gray-300 hover:text-gray-400"
                }`}
              >
                ★
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500 self-center">
              ({rating}/5)
            </span>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-gray-600">
            <span className="text-gold">💬</span>
            {t("review")} <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3.5 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 hover:border-primary/50 resize-y"
            placeholder={t("reviewPlaceholder")}
          />
        </div>

        {error && (
          <div className="mt-3 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 border border-red-200 flex items-center gap-2">
            <span className="text-red-400">⚠️</span>
            {error}
          </div>
        )}

        <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="group/btn relative isolate w-full overflow-hidden sm:w-auto rounded-lg bg-gradient-to-r from-primary to-primary-dark px-8 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
          >
            <IslamicPattern tone="gold" opacity={0.12} className="z-0" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {submitting ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("submitting")}
                </>
              ) : (
                <>
                  {t("submit")}
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </>
              )}
            </span>
          </button>

          <p className="text-xs text-gray-400 flex items-center gap-1">
            <span className="text-gold/40">✦</span>
            {t("feedback")}
            <span className="text-gold/40">✦</span>
          </p>
        </div>
      </div>
    </form>
  );
}
