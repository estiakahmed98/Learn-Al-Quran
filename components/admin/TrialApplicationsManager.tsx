"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

type Application = {
  id: string;
  preferredSchedule: string | null;
  note: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    studentStatus: "FREE_TRIAL" | "REGULAR";
  };
  course: { id: string; title: string };
};

interface TrialApplicationsManagerProps {
  initialApplications: Application[];
  courses: { id: string; title: string }[];
}

function displayDateTime(value: string | null) {
  if (!value) return "Not selected";
  const [date, time = ""] = value.split("T");
  return `${date} ${time}`.trim();
}

export default function TrialApplicationsManager({
  initialApplications,
  courses
}: TrialApplicationsManagerProps) {
  const [search, setSearch] = useState("");
  const [courseId, setCourseId] = useState("");

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    return initialApplications.filter((application) => {
      const matchesCourse = !courseId || application.course.id === courseId;
      const matchesSearch =
        !query ||
        application.user.name.toLowerCase().includes(query) ||
        application.user.email.toLowerCase().includes(query) ||
        (application.user.phone || "").toLowerCase().includes(query);
      return matchesCourse && matchesSearch;
    });
  }, [courseId, initialApplications, search]);

  const inputClass =
    "h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10";

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search trial students"
            placeholder="Search by name, email or phone..."
            className={`${inputClass} w-full pl-10`}
          />
        </div>
        <select
          value={courseId}
          onChange={(event) => setCourseId(event.target.value)}
          aria-label="Filter by course"
          className={`${inputClass} w-full sm:w-64`}
        >
          <option value="">All courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Course</th>
                <th className="px-5 py-4">Note</th>
                <th className="px-5 py-4">Day &amp; Time</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="align-top transition hover:bg-gray-50/70">
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    <Link href={`/admin/users/${application.user.id}`} className="hover:text-primary hover:underline">
                      {application.user.name}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{application.user.email}</td>
                  <td className="px-5 py-4 text-gray-600">{application.user.phone || "—"}</td>
                  <td className="px-5 py-4 font-medium text-primary-dark">{application.course.title}</td>
                  <td className="max-w-xs px-5 py-4 text-gray-600">{application.note || "—"}</td>
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-700">
                    {displayDateTime(application.preferredSchedule)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        application.user.studentStatus === "FREE_TRIAL"
                          ? "bg-teal-50 text-teal-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {application.user.studentStatus === "FREE_TRIAL" ? "Free Trial" : "Regular"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="px-6 py-14 text-center">
            <p className="font-semibold text-gray-700">No trial students found.</p>
            <p className="mt-1 text-sm text-gray-400">Try changing the name or course filter.</p>
          </div>
        )}

        <div className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">
          Showing {filteredApplications.length} of {initialApplications.length} trial students
        </div>
      </div>
    </div>
  );
}
