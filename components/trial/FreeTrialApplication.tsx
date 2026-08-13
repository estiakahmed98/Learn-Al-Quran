"use client";

import { useState } from "react";
import Link from "next/link";
import { BookOpen, CalendarClock, CheckCircle2, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import ConsentCheckbox from "@/components/shared/ConsentCheckbox";
import IslamicPattern from "@/components/shared/IslamicPattern";
import { trackEvent } from "@/components/shared/GoogleAnalytics";
import { submitTrialApplication } from "@/app/public-actions";

type Course = {
  id: string;
  title: string;
  titleBn: string | null;
  slug: string;
};

export default function FreeTrialApplication({
  courses,
  defaultCourseId,
}: {
  courses: Course[];
  defaultCourseId?: string;
}) {
  const t = useTranslations("sitePages.freeTrial");
  const [form, setForm] = useState({
    studentName: "",
    whatsappNumber: "",
    email: "",
    courseId: defaultCourseId || courses[0]?.id || "",
    country: "",
    note: "",
  });
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!consentAccepted) {
      setError(t("error"));
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      // The API currently keeps mobile_number for backwards compatibility.
      // Reuse the visible WhatsApp number so removing the duplicate field does
      // not require a database or backend-contract change.
      await submitTrialApplication({
        ...form,
        mobileNumber: form.whatsappNumber,
        consentAccepted,
      });
      trackEvent("trial_class_book", {
        course_id: form.courseId,
        form_location: "trial_class_page",
      });
      setSubmitted(true);
    } catch {
      setError(t("error"));
      setSubmitting(false);
    }
  }

  const fieldClass =
    "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-secondary focus:bg-white/[0.14]";

  if (submitted) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="overflow-hidden rounded-[2rem] bg-primary-dark p-8 text-center text-white shadow-2xl sm:p-12">
          <CheckCircle2 className="mx-auto h-14 w-14 text-secondary" />
          <p className="mt-6 text-xs font-bold uppercase tracking-[.25em] text-secondary">
            {t("applicationReceived")}
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
            {t("statusTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-white/70">
            {t("statusIntro")}
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex rounded-full bg-secondary px-7 py-3 text-sm font-bold text-primary-dark hover:bg-white"
          >
            {t("backHome")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#f5f7f5] py-14 lg:py-24">
      <div className="absolute -left-32 top-16 h-80 w-80 rounded-full border-[36px] border-primary/5" />
      <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.28em] text-secondary">
            {t("eyebrow")}
          </p>
          <h1 className="mt-4 max-w-xl font-heading text-4xl font-bold leading-tight text-primary-dark sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-gray-600">
            {t("subtitle")}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              [BookOpen, t("steps.accountTitle"), t("steps.accountBody")],
              [Users, t("steps.applyTitle"), t("steps.applyBody")],
              [CalendarClock, t("steps.groupTitle"), t("steps.groupBody")],
              [CheckCircle2, t("steps.classTitle"), t("steps.classBody")],
            ].map(([Icon, title, body], index) => {
              const StepIcon = Icon as typeof BookOpen;
              return (
                <div
                  key={String(title)}
                  className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/20 text-sm font-bold text-primary-dark">
                      {index + 1}
                    </span>
                    <StepIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="mt-4 font-heading font-bold text-primary-dark">
                    {String(title)}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {String(body)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-primary-dark shadow-2xl shadow-primary-dark/20">
          <IslamicPattern tone="gold" opacity={0.08} />
          <div className="relative border-b border-white/10 px-6 py-6 sm:px-9">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-secondary">
              {t("eyebrow")}
            </p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-white">
              {t("formTitle")}
            </h2>
          </div>
          <form
            onSubmit={submit}
            className="relative grid gap-4 p-6 sm:grid-cols-2 sm:p-9"
          >
            <input
              required
              aria-label={t("studentName")}
              value={form.studentName}
              onChange={(e) => update("studentName", e.target.value)}
              placeholder={t("studentName")}
              className={fieldClass}
            />
            <input
              required
              aria-label={t("whatsapp")}
              value={form.whatsappNumber}
              onChange={(e) => update("whatsappNumber", e.target.value)}
              placeholder={t("whatsapp")}
              className={fieldClass}
            />
            <input
              required
              aria-label={t("email")}
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder={t("email")}
              className={fieldClass}
            />
            <select
              required
              aria-label={t("selectCourse")}
              value={form.courseId}
              onChange={(e) => update("courseId", e.target.value)}
              className={fieldClass}
            >
              <option value="" className="text-gray-900">
                {t("selectCourse")}
              </option>
              {courses.map((course) => (
                <option
                  key={course.id}
                  value={course.id}
                  className="text-gray-900"
                >
                  {course.title}
                </option>
              ))}
            </select>
            <input
              aria-label={t("country")}
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder={t("countryOptional")}
              className={`${fieldClass} sm:col-span-2`}
            />
            <textarea
              aria-label={t("notePlaceholder")}
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
              placeholder={t("notePlaceholder")}
              rows={3}
              className={`${fieldClass} sm:col-span-2`}
            />
            <div className="sm:col-span-2">
              <ConsentCheckbox
                checked={consentAccepted}
                onChange={setConsentAccepted}
                dark
              />
            </div>
            {error && (
              <p className="text-sm text-red-300 sm:col-span-2">{error}</p>
            )}
            <button
              disabled={submitting || courses.length === 0 || !consentAccepted}
              className="relative isolate overflow-hidden rounded-xl bg-gold px-6 py-3.5 text-sm font-bold text-primary-dark transition hover:bg-white disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/50 sm:col-span-2"
            >
              <IslamicPattern tone="green" opacity={0.12} className="z-0" />
              <span className="relative z-10">
                {submitting ? t("submitting") : t("submitApplication")}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
