"use client";

import { useState } from "react";
import Link from "next/link";

interface ClassScheduleRow {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string | null;
  teacherName: string | null;
  meetingLink: string | null;
  note: string | null;
}

interface NoteRow {
  id: string;
  title: string;
  content: string | null;
  fileUrl: string | null;
  createdAt: string;
}

export interface CourseWorkspaceData {
  course: {
    slug: string;
    title: string;
    duration: string | null;
    description: string;
  };
  enrollment: {
    paymentMethod: string;
    transactionId: string | null;
    paymentAmount: number;
    paymentStatus: string;
    enrollmentStatus: string;
    adminNote: string | null;
    createdAt: string;
  };
  classSchedules: ClassScheduleRow[];
  notes: NoteRow[];
  isApproved: boolean;
}

const enrollmentStatusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  ACTIVE: "bg-green-100 text-green-800",
  COMPLETED: "bg-primary/10 text-primary-dark",
  CANCELLED: "bg-red-100 text-red-700",
};

const paymentStatusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  VERIFIED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-700",
};

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

type Tab = "details" | "routine" | "notes" | "payment";

function LockedNotice({ paymentStatus }: { paymentStatus: string }) {
  const rejected = paymentStatus === "REJECTED";
  return (
    <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-6 text-center">
      <p className="text-3xl">{rejected ? "🚫" : "🔒"}</p>
      <p className="mt-2 font-semibold text-amber-800">
        {rejected
          ? "Your enrollment was not approved"
          : "Waiting for admin approval"}
      </p>
      <p className="mt-1 text-sm text-amber-700">
        {rejected
          ? "Please contact us regarding your payment to get access."
          : "Once the admin verifies your payment, class routine, notes and results will unlock here."}
      </p>
    </div>
  );
}

export default function CourseWorkspace({
  data,
}: {
  data: CourseWorkspaceData;
}) {
  const [tab, setTab] = useState<Tab>("details");
  const { course, enrollment, classSchedules, notes, isApproved } = data;

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: "details", label: "Details" },
    {
      key: "routine",
      label: "Class Routine",
      count: isApproved ? classSchedules.length : undefined,
    },
    {
      key: "notes",
      label: "Notes",
      count: isApproved ? notes.length : undefined,
    },
    { key: "payment", label: "Payment" },
  ];

  return (
    <div>
      {!isApproved && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <span>{enrollment.paymentStatus === "REJECTED" ? "🚫" : "⏳"}</span>
          <span>
            {enrollment.paymentStatus === "REJECTED"
              ? "This enrollment was rejected. Course content is locked."
              : "This enrollment is pending admin approval. Course content unlocks once your payment is verified."}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-primary-dark">
            {course.title}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Enrolled:{" "}
            {new Date(enrollment.createdAt).toLocaleDateString("en-GB")}
            {course.duration ? ` · ${course.duration}` : ""}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              enrollmentStatusStyles[enrollment.enrollmentStatus] ||
              "bg-gray-100 text-gray-700"
            }`}
          >
            {enrollment.enrollmentStatus}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              paymentStatusStyles[enrollment.paymentStatus] ||
              "bg-gray-100 text-gray-700"
            }`}
          >
            💳 {enrollment.paymentStatus}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-t-lg px-4 py-2 text-sm font-semibold ${
              tab === t.key
                ? "border-b-2 border-primary text-primary-dark"
                : "text-gray-500 hover:text-primary-dark"
            }`}
          >
            {t.label}
            {typeof t.count === "number" && t.count > 0 ? ` (${t.count})` : ""}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        {tab === "details" && (
          <div className="space-y-3 text-sm text-gray-700">
            <p>{course.description}</p>
            {enrollment.adminNote && (
              <p className="rounded bg-cream px-3 py-2 text-xs text-gray-600">
                📝 {enrollment.adminNote}
              </p>
            )}
            <Link
              href={`/courses/${course.slug}`}
              className="inline-block text-xs font-semibold text-primary hover:underline"
            >
              View Public Course Page →
            </Link>
          </div>
        )}

        {tab === "routine" && !isApproved && (
          <LockedNotice paymentStatus={enrollment.paymentStatus} />
        )}

        {tab === "routine" && isApproved && (
          <div>
            {classSchedules.length === 0 ? (
              <p className="text-sm text-gray-500">
                Class routine has not been published yet.
              </p>
            ) : (
              <div className="space-y-3">
                {classSchedules.map((cs) => (
                  <div
                    key={cs.id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-gray-800">
                        {DAY_NAMES[cs.dayOfWeek] ?? "Day"} · {cs.startTime}
                        {cs.endTime ? ` - ${cs.endTime}` : ""}
                      </p>
                      {cs.meetingLink && (
                        <a
                          href={cs.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary-dark"
                        >
                          Join Class
                        </a>
                      )}
                    </div>
                    {cs.teacherName && (
                      <p className="mt-1 text-sm text-gray-500">
                        Teacher: {cs.teacherName}
                      </p>
                    )}
                    {cs.note && (
                      <p className="mt-1 text-xs text-gray-500">{cs.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "notes" && !isApproved && (
          <LockedNotice paymentStatus={enrollment.paymentStatus} />
        )}

        {tab === "notes" && isApproved && (
          <div>
            {notes.length === 0 ? (
              <p className="text-sm text-gray-500">
                No notes have been shared for this course yet.
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-xl border border-gray-200 p-4"
                  >
                    <p className="font-semibold text-gray-800">{n.title}</p>
                    {n.content && (
                      <p className="mt-1 text-sm text-gray-600">{n.content}</p>
                    )}
                    {n.fileUrl && (
                      <a
                        href={n.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs font-semibold text-primary hover:underline"
                      >
                        📎 Download attachment
                      </a>
                    )}
                    <p className="mt-2 text-xs text-gray-400">
                      {new Date(n.createdAt).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "payment" && (
          <div className="grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <p>
              <span className="font-semibold text-gray-500">Method:</span>{" "}
              {enrollment.paymentMethod}
            </p>
            <p>
              <span className="font-semibold text-gray-500">Amount:</span> ৳
              {enrollment.paymentAmount}
            </p>
            {enrollment.transactionId && (
              <p>
                <span className="font-semibold text-gray-500">
                  Transaction ID:
                </span>{" "}
                {enrollment.transactionId}
              </p>
            )}
            <p>
              <span className="font-semibold text-gray-500">Status:</span>{" "}
              {enrollment.paymentStatus}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
