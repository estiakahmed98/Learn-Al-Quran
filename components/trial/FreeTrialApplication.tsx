"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { BookOpen, CalendarClock, CheckCircle2, Eye, EyeOff, LockKeyhole, Users } from "lucide-react";
import { useTranslations } from "next-intl";

type Course = { id: string; title: string; titleBn: string | null; slug: string };
type Application = {
  status: "PENDING" | "GROUP_ASSIGNED" | "COMPLETED" | "CANCELLED";
  preferredSchedule: string | null;
  course: { title: string; titleBn: string | null };
} | null;

export default function FreeTrialApplication({
  courses,
  defaultCourseId,
  user,
  application,
  isBangla
}: {
  courses: Course[];
  defaultCourseId?: string;
  user: { name: string; email: string } | null;
  application: Application;
  isBangla: boolean;
}) {
  const t = useTranslations("sitePages.freeTrial");
  const router = useRouter();
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    password: "",
    courseId: defaultCourseId || courses[0]?.id || "",
    preferredSchedule: "",
    note: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    const response = await fetch("/api/free-trial/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setError(data?.message || t("error"));
      setSubmitting(false);
      return;
    }

    if (!user) {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false
      });
      if (result?.error) {
        router.push("/auth/login?callbackUrl=/student/dashboard");
        return;
      }
    }
    router.push("/student/dashboard?trial=applied");
    router.refresh();
  }

  const fieldClass =
    "w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-white/45 focus:border-secondary focus:bg-white/[0.14]";

  if (application) {
    return (
      <section className="mx-auto max-w-5xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="overflow-hidden rounded-[2rem] bg-primary-dark shadow-2xl">
          <div className="grid lg:grid-cols-[.9fr_1.1fr]">
            <div className="bg-secondary/95 p-8 text-primary-dark sm:p-12">
              <CheckCircle2 className="h-12 w-12" />
              <p className="mt-8 text-xs font-bold uppercase tracking-[.25em]">{t("applicationReceived")}</p>
              <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">{t("statusTitle")}</h1>
              <p className="mt-4 leading-7 text-primary-dark/75">{t("statusIntro")}</p>
            </div>
            <div className="p-8 text-white sm:p-12">
              <span className="inline-flex rounded-full bg-secondary/15 px-4 py-2 text-xs font-bold uppercase tracking-wider text-secondary">
                {t(`statuses.${application.status}`)}
              </span>
              <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                <div><dt className="text-xs uppercase tracking-wider text-white/50">{t("course")}</dt><dd className="mt-1 font-semibold">{isBangla && application.course.titleBn ? application.course.titleBn : application.course.title}</dd></div>
                <div><dt className="text-xs uppercase tracking-wider text-white/50">{t("preferredSchedule")}</dt><dd className="mt-1 font-semibold">{application.preferredSchedule?.replace("T", " ") || t("notProvided")}</dd></div>
              </dl>
              <Link href="/student/dashboard" className="mt-8 block text-sm font-semibold text-secondary hover:text-white">{t("openDashboard")} →</Link>
            </div>
          </div>
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
          <p className="text-xs font-bold uppercase tracking-[.28em] text-secondary">{t("eyebrow")}</p>
          <h1 className="mt-4 max-w-xl font-heading text-4xl font-bold leading-tight text-primary-dark sm:text-5xl">{t("title")}</h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-gray-600">{t("subtitle")}</p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              [LockKeyhole, t("steps.accountTitle"), t("steps.accountBody")],
              [BookOpen, t("steps.applyTitle"), t("steps.applyBody")],
              [Users, t("steps.groupTitle"), t("steps.groupBody")],
              [CalendarClock, t("steps.classTitle"), t("steps.classBody")]
            ].map(([Icon, title, body], index) => {
              const StepIcon = Icon as typeof LockKeyhole;
              return <div key={String(title)} className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm"><div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/20 text-sm font-bold text-primary-dark">{index + 1}</span><StepIcon className="h-5 w-5 text-primary" /></div><h2 className="mt-4 font-heading font-bold text-primary-dark">{String(title)}</h2><p className="mt-2 text-sm leading-6 text-gray-500">{String(body)}</p></div>;
            })}
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-primary-dark shadow-2xl shadow-primary-dark/20">
          <div className="border-b border-white/10 px-6 py-6 sm:px-9">
            <p className="text-xs font-bold uppercase tracking-[.25em] text-secondary">{user ? t("applyNow") : t("signupAndApply")}</p>
            <h2 className="mt-2 font-heading text-2xl font-bold text-white">{user ? t("welcome", { name: user.name }) : t("formTitle")}</h2>
            {!user && <p className="mt-2 text-sm text-white/60">{t("accountNotice")}</p>}
          </div>
          <form onSubmit={submit} className="grid gap-4 p-6 sm:grid-cols-2 sm:p-9">
            {!user && <>
              <input required aria-label={t("fullName")} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder={t("fullName")} className={fieldClass} />
              <input required aria-label={t("email")} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder={t("email")} className={fieldClass} />
              <input required aria-label={t("phone")} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder={t("phone")} className={fieldClass} />
              <div className="relative">
                <input required aria-label={t("password")} minLength={6} type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder={t("password")} className={`${fieldClass} pr-12`} />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? t("hidePassword") : t("showPassword")} aria-pressed={showPassword} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-white/55 transition hover:text-secondary focus:outline-none focus-visible:text-secondary">
                  {showPassword ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
                </button>
              </div>
            </>}
            <select required aria-label={t("selectCourse")} value={form.courseId} onChange={(e) => update("courseId", e.target.value)} className={`${fieldClass} ${user ? "sm:col-span-1" : ""}`}>
              <option value="" className="text-gray-900">{t("selectCourse")}</option>
              {courses.map((course) => <option key={course.id} value={course.id} className="text-gray-900">{isBangla && course.titleBn ? course.titleBn : course.title}</option>)}
            </select>
            <label className="space-y-1.5 text-xs font-semibold text-white/70">
              <span>{t("scheduleLabel")}</span>
              <input type="datetime-local" aria-label={t("scheduleLabel")} value={form.preferredSchedule} onChange={(e) => update("preferredSchedule", e.target.value)} className={`${fieldClass} [color-scheme:dark]`} />
            </label>
            <textarea aria-label={t("notePlaceholder")} value={form.note} onChange={(e) => update("note", e.target.value)} placeholder={t("notePlaceholder")} rows={3} className={`${fieldClass} sm:col-span-2`} />
            {error && <p className="text-sm text-red-300 sm:col-span-2">{error}</p>}
            <button disabled={submitting || courses.length === 0} className="rounded-xl bg-secondary px-6 py-3.5 text-sm font-bold text-primary-dark transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2">
              {submitting ? t("submitting") : user ? t("submitApplication") : t("createAndApply")}
            </button>
            {!user && <p className="text-center text-xs text-white/55 sm:col-span-2">{t("alreadyRegistered")} <Link href="/auth/login?callbackUrl=/free-trial-class" className="font-bold text-secondary hover:text-white">{t("login")}</Link></p>}
          </form>
        </div>
      </div>
    </section>
  );
}
