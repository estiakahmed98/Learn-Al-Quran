"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CourseForm from "./CourseForm";
import { deleteCourse } from "@/app/admin/courses/actions";

export interface CourseRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  duration: string | null;
  fee: number;
  thumbnail: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  _count: { enrollments: number };
}

export default function CoursesTable({
  initialCourses,
  teachers = [],
}: {
  initialCourses: CourseRow[];
  teachers?: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [courses, setCourses] = useState(initialCourses);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  async function remove(course: CourseRow) {
    if (
      !confirm(
        `Delete "${course.title}"? All ${course._count.enrollments} enrollment(s) of this course will also be deleted. This cannot be undone.`,
      )
    )
      return;
    setSavingId(course.id);
    try {
      await deleteCourse(course.id);
      setCourses((prev) => prev.filter((c) => c.id !== course.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete course");
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

      {courses.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="relative h-36 w-full shrink-0 bg-cream">
                {course.thumbnail ? (
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-full w-full object-contain object-center"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gold">
                    <svg
                      className="h-10 w-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2m0-1h.01"
                      />
                    </svg>
                  </div>
                )}
                {course.isFeatured && (
                  <span className="absolute left-2 top-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    Featured
                  </span>
                )}
                <span
                  className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    course.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {course.isActive ? "Active" : "Hidden"}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-medium text-gray-800">{course.title}</h3>
                <p className="mt-0.5 text-xs text-gray-400">/{course.slug}</p>
                <p className="mt-2 line-clamp-2 text-xs text-gray-500">
                  {course.description}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{course.duration || "—"}</span>
                  <span className="font-semibold text-gray-700">
                    ৳{course.fee}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {course._count.enrollments} student
                  {course._count.enrollments === 1 ? "" : "s"}
                </p>

                <div className="mt-4 flex items-center gap-2 pt-2">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="flex-1 rounded-lg bg-primary px-3 py-2 text-center text-xs font-semibold text-white hover:opacity-90"
                  >
                    View details
                  </Link>
                  <button
                    onClick={() => remove(course)}
                    disabled={savingId === course.id}
                    className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-sm text-gray-400">
            No courses yet. Click &quot;Add New Course&quot; to create one.
          </p>
        </div>
      )}

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
              teachers={teachers}
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
