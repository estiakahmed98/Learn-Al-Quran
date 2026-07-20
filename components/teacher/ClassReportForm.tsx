"use client";

import { useState } from "react";
import IslamicPattern from "@/components/shared/IslamicPattern";

type Course = { id: string; title: string; titleBn: string | null };

export default function ClassReportForm({
  courses,
  defaultCourseId
}: {
  courses: Course[];
  defaultCourseId?: string;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    courseId: defaultCourseId || courses[0]?.id || "",
    classDate: today,
    startTime: "",
    endTime: "",
    completed: true,
    attended: "",
    notes: ""
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("submitting");
    setError("");
    const response = await fetch("/api/teacher/class-reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      setError(body?.message || "Unable to submit report.");
      setStatus("idle");
      return;
    }
    setStatus("success");
    setForm((current) => ({ ...current, startTime: "", endTime: "", attended: "", notes: "" }));
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <label className="block text-sm font-semibold text-gray-700">
        Course
        <select required value={form.courseId} onChange={(e) => update("courseId", e.target.value)} className={inputClass}>
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm font-semibold text-gray-700">
        Class date
        <input required type="date" value={form.classDate} onChange={(e) => update("classDate", e.target.value)} className={inputClass} />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-gray-700">
          Start time
          <input required type="time" value={form.startTime} onChange={(e) => update("startTime", e.target.value)} className={inputClass} />
        </label>
        <label className="block text-sm font-semibold text-gray-700">
          End time
          <input type="time" value={form.endTime} onChange={(e) => update("endTime", e.target.value)} className={inputClass} />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={form.completed} onChange={(e) => update("completed", e.target.checked)} className="h-4 w-4" />
        Class completed
      </label>

      <label className="block text-sm font-semibold text-gray-700">
        Students attended
        <input
          type="number"
          min={0}
          value={form.attended}
          onChange={(e) => update("attended", e.target.value)}
          placeholder="Number of students present"
          className={inputClass}
        />
      </label>

      <label className="block text-sm font-semibold text-gray-700">
        Notes (optional)
        <textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} rows={3} className={inputClass} />
      </label>

      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      {status === "success" && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">Class report submitted successfully.</p>
      )}

      <button
        disabled={status === "submitting" || !form.courseId}
        className="relative isolate w-full overflow-hidden rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-white transition hover:bg-primary-dark disabled:opacity-50"
      >
        <IslamicPattern tone="gold" opacity={0.12} className="z-0" />
        <span className="relative z-10">{status === "submitting" ? "Submitting..." : "Submit report"}</span>
      </button>
    </form>
  );
}
