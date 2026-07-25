"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/components/shared/GoogleAnalytics";
import ConsentCheckbox from "@/components/shared/ConsentCheckbox";
import IslamicPattern from "@/components/shared/IslamicPattern";
import { submitEnrollment } from "@/app/public-actions";

interface LeadCourse {
  slug: string;
  title: string;
}

interface LeadFormProps {
  courses: LeadCourse[];
  defaultCourseSlug?: string;
  bkashNumber: string;
  nagadNumber: string;
  bankAccount: string;
  embedded?: boolean;
}

const paymentMethods = [
  "BKASH",
  "NAGAD",
  "ROCKET",
  "WESTERN_UNION",
  "BANK_TRANSFER"
] as const;

export default function LeadForm({
  courses,
  defaultCourseSlug,
  bkashNumber,
  nagadNumber,
  bankAccount,
  embedded = false,
}: LeadFormProps) {
  const t = useTranslations("leadForm");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [consentAccepted, setConsentAccepted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consentAccepted) {
      setStatus("error");
      setErrorMsg(t("genericError"));
      return;
    }
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const phone = data.get("phone");
    const payload = {
      courseSlug: data.get("courseSlug"),
      studentName: data.get("studentName"),
      guardianName: data.get("guardianName") || undefined,
      whatsappNumber: data.get("whatsappNumber") || phone,
      email: data.get("email") || undefined,
      paymentMethod: data.get("paymentMethod"),
      transactionId: data.get("transactionId") || undefined,
      contactNumber: data.get("contactNumber") || phone,
      consentAccepted,
    };

    try {
      await submitEnrollment(payload);
      trackEvent("generate_lead", { course: payload.courseSlug });
      setStatus("success");
      form.reset();
      setConsentAccepted(false);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t("genericError"));
    }
  }

  if (embedded) {
    return (
      <div
        id="admission"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-dark via-primary to-primary-dark p-6 shadow-xl sm:p-8"
      >
        <IslamicPattern tone="gold" opacity={0.06} />

        {/* Decorative elements */}
        <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full border-[12px] border-gold/10" />
        <div className="absolute -bottom-12 -left-12 h-24 w-24 rounded-full border-[8px] border-gold/10" />
        <div className="absolute top-1/2 right-0 h-px w-20 bg-gradient-to-l from-gold/20 to-transparent" />

        <div className="relative">
          {/* Header with decorative elements */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <span className="h-1 w-1 rounded-full bg-gold/60" />
              <span className="h-1 w-3 rounded-full bg-gold" />
              <span className="h-1 w-1 rounded-full bg-gold/60" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-gold-light">
              {t("admissionNow")}
            </p>
          </div>

          <h2 className="mt-1 font-heading text-2xl font-bold text-white sm:text-3xl">
            {t("bookSeat")}
          </h2>

          <div className="mt-1 h-px w-16 bg-gradient-to-r from-gold/60 to-transparent" />

          {status === "success" ? (
            <div className="mt-6 rounded-xl bg-white/10 p-6 text-center backdrop-blur-sm border border-white/10">
              <div className="flex justify-center mb-3">
                <span className="text-4xl">✅</span>
              </div>
              <p className="font-semibold text-white text-lg">
                {t("successTitle")}
              </p>
              <p className="mt-1 text-sm text-cream/80">{t("successBody")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  name="studentName"
                  type="text"
                  required
                  placeholder={t("yourName")}
                  className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-sm text-white placeholder-cream/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                />
                <input
                  name="guardianName"
                  type="text"
                  placeholder={t("guardianName")}
                  className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-sm text-white placeholder-cream/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                />
              </div>

              <input
                name="email"
                type="email"
                placeholder={t("yourEmail")}
                className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-sm text-white placeholder-cream/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  name="courseSlug"
                  required
                  defaultValue={defaultCourseSlug || ""}
                  className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                >
                  <option value="" disabled className="text-gray-800">
                    {t("selectCourse")}
                  </option>
                  {courses.map((c) => (
                    <option
                      key={c.slug}
                      value={c.slug}
                      className="text-gray-800"
                    >
                      {c.title}
                    </option>
                  ))}
                </select>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder={t("yourPhone")}
                  className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-sm text-white placeholder-cream/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  name="paymentMethod"
                  required
                  className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-sm text-white focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                >
                  {paymentMethods.map((method) => (
                    <option
                      key={method}
                      value={method}
                      className="text-gray-800"
                    >
                      {t(`paymentMethods.${method}`)}
                    </option>
                  ))}
                </select>
                <input
                  name="transactionId"
                  type="text"
                  placeholder={t("transactionIdOptional")}
                  className="w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-sm text-white placeholder-cream/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30 transition-all"
                />
              </div>

              {/* Payment Info */}
              <div className="rounded-lg bg-white/5 p-3 backdrop-blur-sm border border-white/10">
                <p className="text-xs text-cream/80 space-y-1">
                  <span className="flex items-center gap-2">
                    <span>📱</span>
                    <span>{t("bkashNumber")}:</span>
                    <span className="font-semibold text-white">
                      {bkashNumber}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span>📱</span>
                    <span>{t("nagadNumber")}:</span>
                    <span className="font-semibold text-white">
                      {nagadNumber}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span>🏦</span>
                    <span>{t("bankAccount")}:</span>
                    <span className="font-semibold text-white">
                      {bankAccount}
                    </span>
                  </span>
                </p>
              </div>

              <ConsentCheckbox checked={consentAccepted} onChange={setConsentAccepted} dark />

              {status === "error" && (
                <p className="rounded-lg bg-red-500/20 backdrop-blur-sm px-4 py-2 text-sm text-red-200 border border-red-500/30">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading" || !consentAccepted}
                className="group relative isolate w-full overflow-hidden rounded-lg bg-gradient-to-r from-gold to-gold-light py-3 font-semibold text-primary-dark shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              >
                <IslamicPattern tone="green" opacity={0.12} className="z-0" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {status === "loading" ? t("submitting") : t("submitNow")}
                  {status !== "loading" && (
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <section
      id="admission"
      className="relative overflow-hidden bg-gradient-to-b from-cream to-white py-12 sm:py-16"
    >
      <IslamicPattern opacity={0.04} />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Decorative top */}
          <div className="flex justify-center gap-2 mb-3">
            <span className="text-gold/30 text-xl">✦</span>
            <span className="text-gold/50 text-xl">✦</span>
            <span className="text-gold/30 text-xl">✦</span>
          </div>
          <p className="font-semibold uppercase tracking-wider text-secondary text-xs sm:text-sm">
            {t("admissionForm")}
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-primary-dark sm:text-3xl lg:text-4xl">
            {t("admissionNow")}
          </h2>
          <div className="mx-auto mt-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/40" />
            <span className="h-1.5 w-3 rounded-full bg-gold" />
            <span className="h-px w-8 bg-gold/40" />
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-gold/10 bg-white/90 backdrop-blur-sm p-6 shadow-lg sm:p-8 lg:p-10">
          {/* Decorative corner */}
          <div className="absolute -top-1 -right-1 h-10 w-10 border-t-2 border-r-2 border-gold/20 rounded-tr-2xl opacity-50" />
          <div className="absolute -bottom-1 -left-1 h-10 w-10 border-b-2 border-l-2 border-gold/20 rounded-bl-2xl opacity-50" />

          {/* Payment Info */}
          <div className="rounded-xl bg-gradient-to-br from-primary/5 to-gold/5 p-4 text-sm text-gray-700 border border-gold/10">
            <p className="font-semibold text-primary-dark flex items-center gap-2">
              <span className="text-gold">📌</span>
              {t("feeNotice")}
            </p>
            <p className="mt-1 text-gray-600">{t("feeInstruction")}</p>
            <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
              <div className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-2">
                <span>📱</span>
                <span className="text-xs text-gray-600">
                  {t("bkashNumber")}:
                </span>
                <span className="font-semibold text-primary-dark text-sm">
                  {bkashNumber}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-2">
                <span>📱</span>
                <span className="text-xs text-gray-600">
                  {t("nagadNumber")}:
                </span>
                <span className="font-semibold text-primary-dark text-sm">
                  {nagadNumber}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/50 rounded-lg px-3 py-2 sm:col-span-2">
                <span>🏦</span>
                <span className="text-xs text-gray-600">
                  {t("bankAccount")}:
                </span>
                <span className="font-semibold text-primary-dark text-sm">
                  {bankAccount}
                </span>
              </div>
            </div>
          </div>

          {status === "success" ? (
            <div className="mt-6 rounded-xl bg-primary/10 p-6 text-center border border-gold/20">
              <div className="flex justify-center mb-3">
                <span className="text-5xl">✅</span>
              </div>
              <p className="mt-2 font-semibold text-primary-dark text-lg">
                {t("successTitle")}
              </p>
              <p className="mt-1 text-sm text-gray-600">{t("successBody")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="text-gold">📚</span>
                  {t("selectCourse")}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  name="courseSlug"
                  required
                  defaultValue={defaultCourseSlug || ""}
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                >
                  <option value="" disabled>
                    -- {t("chooseCourse")} --
                  </option>
                  {courses.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="text-gold">👤</span>
                    {t("studentName")}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="studentName"
                    type="text"
                    required
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder={t("studentName")}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="text-gold">📱</span>
                    {t("whatsappNumber")}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="whatsappNumber"
                    type="tel"
                    required
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="+8801XXXXXXXXX"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="text-gold">👪</span>
                    {t("guardianName")}
                  </label>
                  <input
                    name="guardianName"
                    type="text"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder={t("guardianName")}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="text-gold">✉️</span>
                    {t("emailOptional")}
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <span className="text-gold">💳</span>
                    {t("paymentPlan")}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="paymentMethod"
                    required
                    className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {t(`paymentMethods.${method}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="text-gold">🔢</span>
                  {t("transactionId")}
                </label>
                <input
                  name="transactionId"
                  type="text"
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder={t("transactionIdPlaceholder")}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <span className="text-gold">📞</span>
                  {t("contactNumber")}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  name="contactNumber"
                  type="tel"
                  required
                  className="mt-1.5 w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="+8801XXXXXXXXX"
                />
              </div>

              <ConsentCheckbox checked={consentAccepted} onChange={setConsentAccepted} />

              {status === "error" && (
                <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 border border-red-200">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "loading" || !consentAccepted}
                className="group relative isolate w-full overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary-dark py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
              >
                <IslamicPattern tone="gold" opacity={0.12} className="z-0" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {status === "loading" ? t("submitting") : t("submitNow")}
                  {status !== "loading" && (
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
                  )}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
