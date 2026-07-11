"use client";

import { useState } from "react";
import Link from "next/link";

interface ResultRow {
  id: string;
  examName: string;
  marks: number | null;
  grade: string | null;
  remarks: string | null;
  examDate: string;
}

export interface StudentEnrollment {
  id: string;
  paymentMethod: string;
  transactionId: string | null;
  paymentAmount: number;
  paymentStatus: string;
  enrollmentStatus: string;
  adminNote: string | null;
  createdAt: string;
  results: ResultRow[];
  course: {
    title: string;
    slug: string;
    duration: string | null;
    description: string;
    thumbnail: string | null;
  };
}

const enrollmentStatusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  ACTIVE: "bg-green-100 text-green-800",
  COMPLETED: "bg-primary/10 text-primary-dark",
  CANCELLED: "bg-red-100 text-red-700"
};

const paymentStatusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  VERIFIED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-700"
};

type Tab = "details" | "payment" | "results";

export default function StudentCourseCard({
  enrollment,
  labels
}: {
  enrollment: StudentEnrollment;
  labels: Record<string, string>;
}) {
  const [tab, setTab] = useState<Tab>("details");

  const tabs: { key: Tab; label: string }[] = [
    { key: "details", label: labels.details },
    { key: "payment", label: labels.payment },
    { key: "results", label: `${labels.results}${enrollment.results.length ? ` (${enrollment.results.length})` : ""}` }
  ];

  return (
    <div className="rounded-2xl border border-gold/20 bg-white shadow-sm">
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href={`/courses/${enrollment.course.slug}`}
            className="font-heading text-base font-bold text-primary-dark hover:text-primary"
          >
            {enrollment.course.title}
          </Link>
          <p className="mt-1 text-sm text-gray-500">
            {labels.enrolled}: {new Date(enrollment.createdAt).toLocaleDateString("en-GB")}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              enrollmentStatusStyles[enrollment.enrollmentStatus] || "bg-gray-100 text-gray-700"
            }`}
          >
            {enrollment.enrollmentStatus}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              paymentStatusStyles[enrollment.paymentStatus] || "bg-gray-100 text-gray-700"
            }`}
          >
            💳 {enrollment.paymentStatus}
          </span>
        </div>
      </div>

      <div className="flex gap-1 border-t border-gold/10 px-5 pt-3">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-t-lg px-3 py-2 text-xs font-semibold ${
              tab === t.key
                ? "bg-cream text-primary-dark"
                : "text-gray-500 hover:text-primary-dark"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="rounded-b-2xl bg-cream/60 p-5">
        {tab === "details" && (
          <div className="space-y-2 text-sm text-gray-700">
            {enrollment.course.duration && (
              <p>
                <span className="font-semibold text-gray-500">{labels.duration}:</span>{" "}
                {enrollment.course.duration}
              </p>
            )}
            <p>
              <span className="font-semibold text-gray-500">{labels.description}:</span>{" "}
              {enrollment.course.description}
            </p>
            {enrollment.adminNote && (
              <p className="rounded bg-white px-3 py-2 text-xs text-gray-600">
                📝 {enrollment.adminNote}
              </p>
            )}
            <Link
              href={`/courses/${enrollment.course.slug}`}
              className="inline-block pt-1 text-xs font-semibold text-primary hover:underline"
            >
              {labels.viewCourse} →
            </Link>
          </div>
        )}

        {tab === "payment" && (
          <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-gray-500">{labels.paymentMethod}:</span>{" "}
              {enrollment.paymentMethod}
            </p>
            <p>
              <span className="font-semibold text-gray-500">{labels.amount}:</span> ৳
              {enrollment.paymentAmount}
            </p>
            {enrollment.transactionId && (
              <p>
                <span className="font-semibold text-gray-500">{labels.transactionId}:</span>{" "}
                {enrollment.transactionId}
              </p>
            )}
            <p>
              <span className="font-semibold text-gray-500">{labels.paymentStatus}:</span>{" "}
              {enrollment.paymentStatus}
            </p>
          </div>
        )}

        {tab === "results" && (
          <div>
            {enrollment.results.length === 0 ? (
              <p className="text-sm text-gray-500">{labels.noResults}</p>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-gold/20 bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 text-gray-500">
                    <tr>
                      <th className="px-3 py-2">{labels.exam}</th>
                      <th className="px-3 py-2">{labels.marks}</th>
                      <th className="px-3 py-2">{labels.grade}</th>
                      <th className="px-3 py-2">{labels.remarks}</th>
                      <th className="px-3 py-2">{labels.date}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollment.results.map((r) => (
                      <tr key={r.id} className="border-t border-gray-100">
                        <td className="px-3 py-2 font-medium text-gray-700">{r.examName}</td>
                        <td className="px-3 py-2">{r.marks ?? "-"}</td>
                        <td className="px-3 py-2">{r.grade ?? "-"}</td>
                        <td className="px-3 py-2 text-gray-500">{r.remarks ?? "-"}</td>
                        <td className="px-3 py-2 text-gray-500">
                          {new Date(r.examDate).toLocaleDateString("en-GB")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
