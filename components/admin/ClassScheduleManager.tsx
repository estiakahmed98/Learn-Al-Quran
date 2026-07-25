"use client";

import { useState } from "react";
import { addClassSchedule, updateClassSchedule, deleteClassSchedule } from "@/app/admin/courses/actions";

interface ScheduleRow {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string | null;
  teacherName: string | null;
  meetingLink: string | null;
  note: string | null;
  isActive: boolean;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const emptyForm = {
  dayOfWeek: "0",
  startTime: "",
  endTime: "",
  teacherName: "",
  meetingLink: "",
  note: ""
};

export default function ClassScheduleManager({
  courseId,
  initialSchedules
}: {
  courseId: string;
  initialSchedules: ScheduleRow[];
}) {
  const [schedules, setSchedules] = useState(initialSchedules);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function addSchedule(e: React.FormEvent) {
    e.preventDefault();
    if (!form.startTime) return;
    setSaving(true);
    try {
      const created = await addClassSchedule({ courseId, ...form, dayOfWeek: Number(form.dayOfWeek) });
      setSchedules((prev) => [...prev, created]);
      setForm(emptyForm);
    } catch {
      // no-op: keep existing UI behavior of silently ignoring failures
    }
    setSaving(false);
  }

  async function toggleActive(schedule: ScheduleRow) {
    try {
      const updated = await updateClassSchedule(schedule.id, { isActive: !schedule.isActive }, courseId);
      setSchedules((prev) => prev.map((s) => (s.id === schedule.id ? updated : s)));
    } catch {
      // no-op
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this class schedule entry?")) return;
    try {
      await deleteClassSchedule(id, courseId);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // no-op
    }
  }

  return (
    <div>
      <div className="space-y-3">
        {schedules.map((s) => (
          <div
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-200 p-4"
          >
            <div>
              <p className="font-semibold text-gray-800">
                {DAY_NAMES[s.dayOfWeek] ?? "Day"} · {s.startTime}
                {s.endTime ? ` - ${s.endTime}` : ""}
              </p>
              {s.teacherName && <p className="text-sm text-gray-500">Teacher: {s.teacherName}</p>}
              {s.meetingLink && (
                <p className="truncate text-xs text-gray-400">Link: {s.meetingLink}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleActive(s)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  s.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}
              >
                {s.isActive ? "Active" : "Hidden"}
              </button>
              <button
                onClick={() => remove(s.id)}
                className="text-xs font-semibold text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {schedules.length === 0 && (
          <p className="text-sm text-gray-400">No class routine added yet.</p>
        )}
      </div>

      <form onSubmit={addSchedule} className="mt-4 flex flex-wrap items-end gap-2">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Day</label>
          <select
            value={form.dayOfWeek}
            onChange={(e) => setForm({ ...form, dayOfWeek: e.target.value })}
            className="rounded border border-gray-300 px-2 py-1.5 text-xs"
          >
            {DAY_NAMES.map((d, i) => (
              <option key={d} value={i}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Start Time *</label>
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="rounded border border-gray-300 px-2 py-1.5 text-xs"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">End Time</label>
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            className="rounded border border-gray-300 px-2 py-1.5 text-xs"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Teacher</label>
          <input
            value={form.teacherName}
            onChange={(e) => setForm({ ...form, teacherName: e.target.value })}
            className="w-32 rounded border border-gray-300 px-2 py-1.5 text-xs"
          />
        </div>
        <div className="min-w-[160px] flex-1">
          <label className="mb-1 block text-xs font-semibold text-gray-500">Meeting Link</label>
          <input
            value={form.meetingLink}
            onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
            placeholder="https://meet.google.com/..."
            className="w-full rounded border border-gray-300 px-2 py-1.5 text-xs"
          />
        </div>
        <button
          type="submit"
          disabled={saving || !form.startTime}
          className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Add"}
        </button>
      </form>
    </div>
  );
}
