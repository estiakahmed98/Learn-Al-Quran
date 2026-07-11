"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CourseForm from "./CourseForm";

export interface CourseRow {
  id: string;
  title: string;
  slug: string;
  duration: string | null;
  fee: number;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  _count: { enrollments: number };
}

export default function CoursesTable({
  initialCourses,
}: {
  initialCourses: CourseRow[];
}) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  async function toggleActive(course: CourseRow) {
    setSavingId(course.id);
    const res = await fetch(`/api/admin/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !course.isActive }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, ...updated } : c)),
      );
    }
    setSavingId(null);
  }

  async function updateFee(course: CourseRow, fee: number) {
    setSavingId(course.id);
    const res = await fetch(`/api/admin/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fee }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, ...updated } : c)),
      );
    }
    setSavingId(null);
  }

  async function remove(course: CourseRow) {
    if (
      !confirm(
        `Delete "${course.title}"? All ${course._count.enrollments} enrollment(s) of this course will also be deleted. This cannot be undone.`,
      )
    )
      return;
    setSavingId(course.id);
    const res = await fetch(`/api/admin/courses/${course.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
    }
    setSavingId(null);
  }

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <div>
          {" "}
          <h1 className="font-heading text-2xl font-bold text-primary-dark">
            Courses
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage the courses shown on your website. Changes are saved directly
            to the database.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add New Course
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-gray-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Fee (৳)</th>
              <th className="px-4 py-3">Students</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id} className="border-t border-gray-100">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="font-medium text-gray-800 hover:text-primary hover:underline"
                  >
                    {course.title}
                  </Link>
                  {course.isFeatured && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      Featured
                    </span>
                  )}
                  <p className="text-xs text-gray-400">/{course.slug}</p>
                </td>
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
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    {course._count.enrollments} student
                    {course._count.enrollments === 1 ? "" : "s"}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(course)}
                    disabled={savingId === course.id}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      course.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {course.isActive ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/courses/${course.id}`}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Manage
                    </Link>
                    <button
                      onClick={() => remove(course)}
                      disabled={savingId === course.id}
                      className="text-xs font-semibold text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {courses.length === 0 && (
          <p className="p-6 text-center text-sm text-gray-400">
            No courses yet. Click &quot;Add New Course&quot; to create one.
          </p>
        )}
      </div>

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-primary-dark">
                Add New Course
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <CourseForm
              onSaved={(created) => {
                setCourses((prev) => [
                  ...prev,
                  { ...created, _count: { enrollments: 0 } },
                ]);
                setShowAddModal(false);
                router.refresh();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
