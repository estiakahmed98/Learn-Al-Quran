"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { CheckCircle2, CreditCard, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";

type Course = {
  id: string;
  slug: string;
  title: string;
  titleBn: string | null;
  fee: number;
};

type Student = {
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
} | null;

const paymentMethods = ["BKASH", "NAGAD", "ROCKET", "WESTERN_UNION", "BANK_TRANSFER"] as const;

interface EnrollmentFormProps {
  courses: Course[];
  defaultCourseSlug?: string;
  student: Student;
  isBangla: boolean;
  paymentInfo: {
    bkashNumber: string;
    nagadNumber: string;
    rocketNumber: string;
    bankAccount: string;
    westernUnionInfo: string;
  };
}

export default function EnrollmentForm({
  courses,
  defaultCourseSlug,
  student,
  isBangla,
  paymentInfo
}: EnrollmentFormProps) {
  const t = useTranslations("enrollmentPage");
  const initialCourse = courses.find((course) => course.slug === defaultCourseSlug) || courses[0];
  const [form, setForm] = useState({
    courseSlug: initialCourse?.slug || "",
    studentName: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || student?.whatsapp || "",
    password: "",
    paymentMethod: "BKASH",
    transactionId: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");

  const selectedCourse = courses.find((course) => course.slug === form.courseSlug);
  const inputClass =
    "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

  function update(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    const response = await fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      setError(body?.message || t("genericError"));
      setStatus("idle");
      return;
    }

    if (!student) {
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false
      });
    }
    setStatus("success");
  }

  if (status === "success") {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 lg:px-8">
        <div className="rounded-[2rem] border border-green-100 bg-white p-8 text-center shadow-xl sm:p-12">
          <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
          <h1 className="mt-5 font-heading text-3xl font-bold text-primary-dark">{t("successTitle")}</h1>
          <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600">{t("successBody")}</p>
          <Link href="/student/dashboard" className="mt-7 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-bold text-white hover:bg-primary-dark">
            {t("openDashboard")}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[#f5f7f5] py-14 lg:py-20">
      <div className="absolute -left-24 top-20 h-72 w-72 rounded-full border-[32px] border-primary/5" />
      <div className="relative mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
        <aside className="rounded-[2rem] bg-primary-dark p-7 text-white shadow-xl sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[.25em] text-secondary">{t("eyebrow")}</p>
          <h1 className="mt-4 font-heading text-3xl font-bold leading-tight sm:text-4xl">{t("title")}</h1>
          <p className="mt-4 leading-7 text-white/65">{t("subtitle")}</p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-3"><CreditCard className="h-5 w-5 text-secondary" /><h2 className="font-bold">{t("paymentDetails")}</h2></div>
            <dl className="mt-4 space-y-3 text-sm">
              {paymentInfo.bkashNumber && <div><dt className="text-white/45">bKash</dt><dd className="font-semibold">{paymentInfo.bkashNumber}</dd></div>}
              {paymentInfo.nagadNumber && <div><dt className="text-white/45">Nagad</dt><dd className="font-semibold">{paymentInfo.nagadNumber}</dd></div>}
              {paymentInfo.rocketNumber && <div><dt className="text-white/45">Rocket</dt><dd className="font-semibold">{paymentInfo.rocketNumber}</dd></div>}
              {paymentInfo.bankAccount && <div><dt className="text-white/45">{t("bankAccount")}</dt><dd className="whitespace-pre-line font-semibold">{paymentInfo.bankAccount}</dd></div>}
              {paymentInfo.westernUnionInfo && <div><dt className="text-white/45">Western Union</dt><dd className="whitespace-pre-line font-semibold">{paymentInfo.westernUnionInfo}</dd></div>}
            </dl>
          </div>
        </aside>

        <div className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-xl sm:p-9">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary/20 text-primary-dark"><LockKeyhole className="h-5 w-5" /></span><div><h2 className="font-heading text-2xl font-bold text-primary-dark">{t("formTitle")}</h2><p className="text-sm text-gray-500">{student ? t("signedInHint") : t("guestHint")}</p></div></div>

          {student && (
            <div className="mt-6 flex items-center gap-4 rounded-2xl bg-cream p-4">
              <UserRound className="h-8 w-8 text-primary" />
              <div><p className="font-bold text-primary-dark">{student.name}</p><p className="text-sm text-gray-500">{student.email}{student.phone || student.whatsapp ? ` · ${student.phone || student.whatsapp}` : ""}</p></div>
            </div>
          )}

          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            {!student && <>
              <label className="text-sm font-semibold text-gray-700">{t("name")}<input required minLength={2} value={form.studentName} onChange={(event) => update("studentName", event.target.value)} className={inputClass} /></label>
              <label className="text-sm font-semibold text-gray-700">{t("email")}<input required type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className={inputClass} /></label>
              <label className="text-sm font-semibold text-gray-700">{t("phone")}<input required minLength={6} type="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} className={inputClass} /></label>
              <label className="relative text-sm font-semibold text-gray-700">{t("password")}<span className="relative block"><input required minLength={6} type={showPassword ? "text" : "password"} value={form.password} onChange={(event) => update("password", event.target.value)} className={`${inputClass} pr-12`} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? t("hidePassword") : t("showPassword")} className="absolute inset-y-0 right-0 mt-1.5 flex w-12 items-center justify-center text-gray-400 hover:text-primary">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></span></label>
            </>}

            <label className="text-sm font-semibold text-gray-700">{t("course")}<select required value={form.courseSlug} onChange={(event) => update("courseSlug", event.target.value)} className={inputClass}><option value="">{t("selectCourse")}</option>{courses.map((course) => <option key={course.id} value={course.slug}>{isBangla && course.titleBn ? course.titleBn : course.title} — ৳{course.fee.toLocaleString()}</option>)}</select></label>
            <label className="text-sm font-semibold text-gray-700">{t("paymentMethod")}<select required value={form.paymentMethod} onChange={(event) => update("paymentMethod", event.target.value)} className={inputClass}>{paymentMethods.map((method) => <option key={method} value={method}>{t(`paymentMethods.${method}`)}</option>)}</select></label>
            <label className="text-sm font-semibold text-gray-700 sm:col-span-2">{t("transactionId")}<input value={form.transactionId} onChange={(event) => update("transactionId", event.target.value)} placeholder={t("transactionPlaceholder")} className={inputClass} /></label>

            {selectedCourse && <div className="flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3 text-sm sm:col-span-2"><span className="text-gray-600">{t("courseFee")}</span><span className="font-heading text-lg font-bold text-primary-dark">৳{selectedCourse.fee.toLocaleString()}</span></div>}
            {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 sm:col-span-2">{error}</p>}
            <button disabled={status === "submitting" || !form.courseSlug} className="rounded-xl bg-secondary px-6 py-3.5 text-sm font-bold text-primary-dark transition hover:bg-primary hover:text-white disabled:opacity-50 sm:col-span-2">{status === "submitting" ? t("submitting") : t("submit")}</button>
            {!student && <p className="text-center text-xs text-gray-500 sm:col-span-2">{t("haveAccount")} <Link href={`/auth/login?callbackUrl=${encodeURIComponent(`/enroll?course=${form.courseSlug}`)}`} className="font-bold text-primary hover:underline">{t("login")}</Link></p>}
          </form>
        </div>
      </div>
    </section>
  );
}
