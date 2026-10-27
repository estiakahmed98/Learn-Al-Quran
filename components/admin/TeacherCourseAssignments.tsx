"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { changeTeacherCourseAssignment } from "./teacher-course-actions";

type Option = { id: string; label: string };
type Props = {
  ownerId: string;
  mode: "teacher" | "course";
  options: Option[];
  assigned: Option[];
};

export default function TeacherCourseAssignments({ ownerId, mode, options, assigned }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const available = options.filter((option) => !assigned.some((item) => item.id === option.id));
  const label = mode === "teacher" ? "Course" : "Teacher";

  async function change(id: string, remove: boolean) {
    setBusy(true);
    setError(null);
    setMessage("");
    try {
      await changeTeacherCourseAssignment({
        teacherId: mode === "teacher" ? ownerId : id,
        courseId: mode === "course" ? ownerId : id,
        remove
      });
      setSelected("");
      setMessage(remove ? "Assignment removed." : "Assigned successfully.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update assignment.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <ul className="divide-y divide-gray-100">
        {assigned.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-3 py-3">
            <Link href={`/admin/${mode === "teacher" ? "courses" : "users"}/${item.id}`} className="text-sm font-semibold text-primary hover:underline">
              {item.label}
            </Link>
            <button type="button" disabled={busy} onClick={() => change(item.id, true)} className="text-sm font-semibold text-red-600 disabled:opacity-50" aria-label={`Remove ${item.label}`}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      {assigned.length === 0 && <p className="text-sm text-gray-500">No {label.toLowerCase()}s assigned yet.</p>}
      <form onSubmit={(event) => { event.preventDefault(); if (selected) void change(selected, false); }} className="flex flex-wrap items-end gap-3">
        <label className="min-w-[220px] flex-1 text-xs font-semibold text-gray-600">
          {label}
          <select value={selected} disabled={busy} onChange={(event) => setSelected(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="">Select a {label.toLowerCase()}...</option>
            {available.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </select>
        </label>
        <button type="submit" disabled={busy || !selected} className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? "Saving..." : `Assign ${label}`}
        </button>
      </form>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {message && <p role="status" className="text-sm text-green-600">{message}</p>}
    </div>
  );
}
