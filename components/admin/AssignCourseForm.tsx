"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CourseOption {
  id: string;
  title: string;
  fee: number;
}

export default function AssignCourseForm({
  userId,
  courses,
  enrolledCourseIds
}: {
  userId: string;
  courses: CourseOption[];
  enrolledCourseIds: string[];
}) {
  const router = useRouter();
  const [courseId, setCourseId] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const available = courses.filter((c) => !enrolledCourseIds.includes(c.id));

  async function assign(e: React.FormEvent) {
    e.preventDefault();
    if (!courseId) return;
    setSaving(true);
    setError(null);
    setDone(false);

    const res = await fetch("/api/admin/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, courseId, adminNote: note.trim() || undefined })
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.message || "Failed to assign course.");
      return;
    }

    setCourseId("");
    setNote("");
    setDone(true);
    router.refresh();
  }

  return (
    <form onSubmit={assign} className="flex flex-wrap items-end gap-3">
      <div className="min-w-[220px] flex-1">
        <label className="mb-1 block text-xs font-semibold text-gray-500">Course</label>
        <select
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value);
            setDone(false);
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">Select a course…</option>
          {available.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title} (৳{c.fee})
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[200px] flex-1">
        <label className="mb-1 block text-xs font-semibold text-gray-500">Note (optional)</label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Scholarship / manual enrollment"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={saving || !courseId}
        className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "Assigning…" : "Assign Course"}
      </button>

      {done && <span className="text-sm font-medium text-green-600">Assigned ✓</span>}
      {error && <span className="text-sm font-medium text-red-500">{error}</span>}
      {available.length === 0 && (
        <span className="text-sm text-gray-400">Already enrolled in all courses.</span>
      )}
    </form>
  );
}
