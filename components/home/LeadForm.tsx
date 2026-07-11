"use client";

import { useState } from "react";
import type { Course } from "@prisma/client";
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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

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

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Something went wrong. Please try again.");
      }

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
            Admission Now
          </p>
          <h2 className="mt-1 font-heading text-2xl font-bold text-white">
            Book Your Seat Today!
          </h2>

          {status === "success" ? (
            <div className="mt-6 rounded-xl bg-white/10 p-6 text-center backdrop-blur">
              <p className="text-2xl">✅</p>
              <p className="mt-2 font-semibold text-white">আপনার আবেদন সফলভাবে জমা হয়েছে!</p>
              <p className="mt-1 text-sm text-cream/80">
                আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে। ধন্যবাদ।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-5 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  name="studentName"
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-white/20 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-gold focus:outline-none"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Your Email"
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
                    Select Course
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
                  placeholder="Your Phone Number"
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
                  placeholder="Transaction ID (optional)"
                  className="w-full rounded-lg border border-white/20 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:border-gold focus:outline-none"
                />
              </div>

              <p className="text-xs text-cream/80">
                📱 বিকাশ: <span className="font-semibold text-white">{bkashNumber}</span> · নগদ:{" "}
                <span className="font-semibold text-white">{nagadNumber}</span> · 🏦{" "}
                <span className="font-semibold text-white">{bankAccount}</span>
              </p>

              {status === "error" && (
                <p className="rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-gold py-3 font-semibold text-white shadow transition hover:bg-gold-light disabled:opacity-60"
              >
                {status === "loading" ? "Submitting..." : "Submit Now ✈"}
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
          <p className="font-semibold uppercase tracking-wide text-gold">ভর্তি ফর্ম</p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-primary-dark lg:text-3xl">
            Admission Now
          </h2>
        </div>

        <div className="mt-8 rounded-2xl border border-gold/20 bg-white p-6 shadow-sm lg:p-8">
          <div className="rounded-xl bg-primary/5 p-4 text-sm text-gray-700">
            <p className="font-semibold text-primary-dark">কোর্স ফি: ১৫০০ টাকা</p>
            <p className="mt-1">অনুগ্রহ করে ফি পরিশোধ করে নিচের ফর্মটি পূরণ করুন।</p>
            <ul className="mt-3 space-y-1">
              <li>📱 বিকাশ নম্বর: <span className="font-semibold">{bkashNumber}</span></li>
              <li>📱 নগদ নম্বর: <span className="font-semibold">{nagadNumber}</span></li>
              <li>🏦 ব্যাংক অ্যাকাউন্ট: <span className="font-semibold">{bankAccount}</span></li>
            </ul>
          </div>

          {status === "success" ? (
            <div className="mt-6 rounded-xl bg-primary/10 p-6 text-center">
              <p className="text-2xl">✅</p>
              <p className="mt-2 font-semibold text-primary-dark">
                আপনার আবেদন সফলভাবে জমা হয়েছে!
              </p>
              <p className="mt-1 text-sm text-gray-600">
                আমাদের টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে। ধন্যবাদ।
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">কোর্স নির্বাচন করুন</label>
                <select
                  name="courseSlug"
                  required
                  defaultValue={defaultCourseSlug || ""}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                >
                  <option value="" disabled>
                    -- Select a course --
                  </option>
                  {courses.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Student Name</label>
                <input
                  name="studentName"
                  type="text"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="শিক্ষার্থীর নাম"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">WhatsApp Number</label>
                <input
                  name="whatsappNumber"
                  type="tel"
                  required
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="+8801XXXXXXXXX"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email (Optional)</label>
                <input
                  name="email"
                  type="email"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Select Your Payment Plan</label>
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
                <label className="text-sm font-medium text-gray-700">Transaction ID</label>
                <input
                  name="transactionId"
                  type="text"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                  placeholder="Payment Transaction ID"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Contact Number</label>
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
                {status === "loading" ? "Submitting..." : "Submit Now"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
