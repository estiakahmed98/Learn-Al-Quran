"use client";

import { useState } from "react";
import type { Course } from "@prisma/client";

export default function CoursesTable({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function toggleActive(course: Course) {
    setSavingId(course.id);
    const res = await fetch(`/api/admin/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !course.isActive })
    });
    if (res.ok) {
      const updated = await res.json();
      setCourses((prev) => prev.map((c) => (c.id === course.id ? updated : c)));
    }
    setSavingId(null);
  }

  async function updateFee(course: Course, fee: number) {
    setSavingId(course.id);
    const res = await fetch(`/api/admin/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fee })
    });
    if (res.ok) {
      const updated = await res.json();
      setCourses((prev) => prev.map((c) => (c.id === course.id ? updated : c)));
    }
    setSavingId(null);
  }

  async function remove(course: Course) {
    if (!confirm(`Delete "${course.title}"? This cannot be undone.`)) return;
    setSavingId(course.id);
    const res = await fetch(`/api/admin/courses/${course.id}`, { method: "DELETE" });
    if (res.ok) {
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
    }
    setSavingId(null);
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-cream text-gray-600">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Duration</th>
            <th className="px-4 py-3">Fee (৳)</th>
            <th className="px-4 py-3">Active</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id} className="border-t border-gray-100">
              <td className="px-4 py-3 font-medium text-gray-800">{course.title}</td>
              <td className="px-4 py-3 text-gray-500">{course.duration}</td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  defaultValue={course.fee}
                  onBlur={(e) => updateFee(course, Number(e.target.value))}
                  className="w-20 rounded border border-gray-300 px-2 py-1"
                />
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => toggleActive(course)}
                  disabled={savingId === course.id}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    course.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {course.isActive ? "Active" : "Hidden"}
                </button>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => remove(course)}
                  disabled={savingId === course.id}
                  className="text-xs font-semibold text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
