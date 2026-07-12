"use client";

import { useState } from "react";
import Link from "next/link";
import type { Course } from "@prisma/client";
import { useTranslations } from "next-intl";
import { trackEvent } from "@/components/shared/GoogleAnalytics";

interface LeadFormProps {
  courses: Course[];
  defaultCourseSlug?: string;
  bkashNumber: string;
  nagadNumber: string;
  bankAccount: string;
  embedded?: boolean;
}

const paymentMethods = [
  { value: "BKASH", label: "বিকাশ" },
  { value: "NAGAD", label: "নগদ" },
  { value: "ROCKET", label: "রকেট" },
  { value: "WESTERN_UNION", label: "Western Union" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" }
];

export default function LeadForm({
  courses,
  defaultCourseSlug,
  bkashNumber,
  nagadNumber,
  bankAccount,
  embedded = false
}: LeadFormProps) {
  const t = useTranslations("leadForm");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [account, setAccount] = useState<{ email: string; password: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const phone = data.get("phone");
    const payload = {
      courseSlug: data.get("courseSlug"),
      studentName: data.get("studentName"),
      whatsappNumber: data.get("whatsappNumber") || phone,
      email: data.get("email") || undefined,
      paymentMethod: data.get("paymentMethod"),
      transactionId: data.get("transactionId") || undefined,
      contactNumber: data.get("contactNumber") || phone
    };

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body.message || "Something went wrong. Please try again.");
      }

      setAccount(body.account || null);
      trackEvent("generate_lead", { course: payload.courseSlug });
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (embedded) {
    return (
      <div
        id="admission"
        className="relative overflow-hidden rounded-2xl bg-primary-dark p-6 shadow-lg sm:p-8"
      >
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-10" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest text-gold-light">
            {t("admissionNow")}
          </p>
          <h2 className="mt-1 font-heading text-2xl font-bold text-white">
            {t("bookSeat")}
          </h2>

          {status === "success" ? (
            <div className="mt-6 rounded-xl bg-white/10 p-6 text-center backdrop-blur">
              <p className="text-2xl">✅</p>
              <p className="mt-2 font-semibold text-white">{t("successTitle")}</p>
              <p className="mt-1 text-sm text-cream/80">
                {t("successBody")}
              </p>
              {account && (
                <div className="mt-4 rounded-lg bg-white/10 p-4 text-left text-sm text-cream">
                  <p className="font-semibold text-gold-light">
                    {t("accountCreated")}
                  </p>
                  <p className="mt-2">
                    {t("emailLabel")}: <span className="font-semibold text-white">{account.email}</span>
                  </p>
                  <p>
                    {t("passwordLabel")}: <span className="font-semibold text-white">{account.password}</span>
                  </p>
                  <p className="mt-2 text-xs text-cream/70">
                    {t("savePassword")}{" "}
                    <Link href="/auth/login" className="font-semibold text-gold-light underline">
                      {t("loginNow")}
                    </Link>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  name="studentName"
                  type="text"
                  required
                  placeholder={t("yourName")}
                  className="w-full rounded-lg border border-white/20 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-gold focus:outline-none"
                />
                <input
                  name="email"
                  type="email"
                  placeholder={t("yourEmail")}
                  className="w-full rounded-lg border border-white/20 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  name="courseSlug"
                  required
                  defaultValue={defaultCourseSlug || ""}
                  className="w-full rounded-lg border border-white/20 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-gold focus:outline-none"
                >
                  <option value="" disabled>
                    {t("selectCourse")}
                  </option>
                  {courses.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder={t("yourPhone")}
                  className="w-full rounded-lg border border-white/20 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  name="paymentMethod"
                  required
                  className="w-full rounded-lg border border-white/20 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-gold focus:outline-none"
                >
                  {paymentMethods.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <input
                  name="transactionId"
                  type="text"
                  placeholder={t("transactionIdOptional")}
                  className="w-full rounded-lg border border-white/20 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-gold focus:outline-none"
                />
              </div>

              <p className="text-xs text-cream/80">
                📱 {t("bkashNumber")}: <span className="font-semibold text-white">{bkashNumber}</span> ·{" "}
                {t("nagadNumber")}:{" "}
                <span className="font-semibold text-white">{nagadNumber}</span> · 🏦{" "}
                <span className="font-semibold text-white">{bankAccount}</span>
              </p>

              {status === "error" && (
                <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-gold py-3 font-semibold text-primary-dark shadow transition hover:bg-gold-light disabled:opacity-60"
              >
                {status === "loading" ? t("submitting") : `${t("submitNow")} ✈`}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <section id="admission" className="bg-cream py-16">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="text-center">
          <p className="font-semibold uppercase tracking-wide text-secondary">{t("admissionForm")}</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-primary-dark lg:text-3xl">
            {t("admissionNow")}
          </h2>
        </div>

        <div className="mt-8 rounded-2xl border border-gold/20 bg-white p-6 shadow-sm lg:p-8">
          <div className="rounded-xl bg-primary/5 p-4 text-sm text-gray-700">
            <p className="font-semibold text-primary-dark">{t("feeNotice")}</p>
            <p className="mt-1">{t("feeInstruction")}</p>
            <ul className="mt-3 space-y-1">
              <li>📱 {t("bkashNumber")}: <span className="font-semibold">{bkashNumber}</span></li>
              <li>📱 {t("nagadNumber")}: <span className="font-semibold">{nagadNumber}</span></li>
              <li>🏦 {t("bankAccount")}: <span className="font-semibold">{bankAccount}</span></li>
            </ul>
          </div>

          {status === "success" ? (
            <div className="mt-6 rounded-xl bg-primary/10 p-6 text-center">
              <p className="text-2xl">✅</p>
              <p className="mt-2 font-semibold text-primary-dark">
                আপনার আবেদন সফলভাবে জমা হয়েছে!
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {t("successBody")}
              </p>
              {account && (
                <div className="mt-4 rounded-lg border border-gold/30 bg-white p-4 text-left text-sm text-gray-700">
                  <p className="font-semibold text-primary-dark">
                    {t("accountCreated")}
                  </p>
                  <p className="mt-2">
                    {t("emailLabel")}: <span className="font-semibold">{account.email}</span>
                  </p>
                  <p>
                    {t("passwordLabel")}: <span className="font-semibold">{account.password}</span>
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {t("savePassword")}{" "}
                    <Link href="/auth/login" className="font-semibold text-primary underline">
                      {t("loginNow")}
                    </Link>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">{t("selectCourse")}</label>
                <select
                  name="courseSlug"
                  required
                  defaultValue={defaultCourseSlug || ""}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
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

              <div>
                <label className="text-sm font-medium text-gray-700">{t("studentName")}</label>
                <input
                  name="studentName"
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder={t("studentName")}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">{t("whatsappNumber")}</label>
                <input
                  name="whatsappNumber"
                  type="tel"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="+8801XXXXXXXXX"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">{t("emailOptional")}</label>
                <input
                  name="email"
                  type="email"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">{t("paymentPlan")}</label>
                <select
                  name="paymentMethod"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                >
                  {paymentMethods.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">{t("transactionId")}</label>
                <input
                  name="transactionId"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder={t("transactionIdPlaceholder")}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">{t("contactNumber")}</label>
                <input
                  name="contactNumber"
                  type="tel"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="+8801XXXXXXXXX"
                />
              </div>

              {status === "error" && (
                <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-primary py-3 font-semibold text-white transition hover:bg-primary-light disabled:opacity-60"
              >
                {status === "loading" ? t("submitting") : t("submitNow")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
