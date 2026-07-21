"use client";

import { useMemo, useState } from "react";
import MonthlyPdfDownload from "@/components/teacher/MonthlyPdfDownload";

export interface ClassReportRow {
  id: string;
  classDate: string;
  startTime: string;
  endTime: string | null;
  completed: boolean;
  attended: number | null;
  notes: string | null;
  teacher: { id: string; name: string };
  course: { id: string; title: string };
}

export default function ClassReportsTable({ initialReports }: { initialReports: ClassReportRow[] }) {
  const [search, setSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const teachers = useMemo(() => {
    const map = new Map<string, string>();
    initialReports.forEach((report) => map.set(report.teacher.id, report.teacher.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [initialReports]);

  const courses = useMemo(() => {
    const map = new Map<string, string>();
    initialReports.forEach((report) => map.set(report.course.id, report.course.title));
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [initialReports]);

  const filtered = initialReports.filter((report) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      report.teacher.name.toLowerCase().includes(q) ||
      report.course.title.toLowerCase().includes(q) ||
      (report.notes || "").toLowerCase().includes(q);
    const matchesTeacher = !teacherFilter || report.teacher.id === teacherFilter;
    const matchesCourse = !courseFilter || report.course.id === courseFilter;
    const reportDate = report.classDate.slice(0, 10);
    const matchesFrom = !dateFrom || reportDate >= dateFrom;
    const matchesTo = !dateTo || reportDate <= dateTo;
    return matchesSearch && matchesTeacher && matchesCourse && matchesFrom && matchesTo;
  });

  const selectClass = "rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search teacher, course or notes..."
          className={`${selectClass} w-full max-w-xs`}
        />
        <select value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)} className={selectClass}>
          <option value="">All teachers</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
        <select value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className={selectClass}>
          <option value="">All courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-1.5 text-xs text-gray-500">
          From
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className={selectClass} />
        </label>
        <label className="flex items-center gap-1.5 text-xs text-gray-500">
          To
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className={selectClass} />
        </label>
        {(search || teacherFilter || courseFilter || dateFrom || dateTo) && (
          <button
            onClick={() => {
              setSearch("");
              setTeacherFilter("");
              setCourseFilter("");
              setDateFrom("");
              setDateTo("");
            }}
            className="text-xs font-semibold text-red-500 hover:underline"
          >
            Clear filters
          </button>
        )}
        <div className="ml-auto">
          <MonthlyPdfDownload teacherId={teacherFilter || undefined} />
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        {teacherFilter
          ? "Exports the selected teacher's monthly report."
          : "Exports a combined monthly report across all teachers. Select a teacher above to export just theirs."}
      </p>

      <p className="mt-3 text-xs text-gray-400">
        Showing {filtered.length} of {initialReports.length} reports
      </p>

      <div className="mt-2 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Teacher</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Attended</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((report) => (
              <tr key={report.id}>
                <td className="px-4 py-3">{new Date(report.classDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-medium text-primary-dark">{report.teacher.name}</td>
                <td className="px-4 py-3">{report.course.title}</td>
                <td className="px-4 py-3">
                  {report.startTime}
                  {report.endTime ? ` - ${report.endTime}` : ""}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      report.completed ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {report.completed ? "Completed" : "Incomplete"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{report.attended ?? "—"}</td>
                <td className="px-4 py-3 text-gray-500">{report.notes || "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No class reports found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
