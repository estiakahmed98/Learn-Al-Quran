"use client";

import { useMemo, useState } from "react";
import MonthlyPdfDownload from "@/components/teacher/MonthlyPdfDownload";

export interface ClassReportRow {
  id: string;
  classDate: string;
  startTime: string;
  endTime: string | null;
  completed: boolean;
  notes: string | null;
  teacher: { id: string; name: string };
  course: { id: string; title: string };
}

export default function ClassReportsTable({ initialReports }: { initialReports: ClassReportRow[] }) {
  const [teacherFilter, setTeacherFilter] = useState("");

  const teachers = useMemo(() => {
    const map = new Map<string, string>();
    initialReports.forEach((report) => map.set(report.teacher.id, report.teacher.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [initialReports]);

  const filtered = teacherFilter
    ? initialReports.filter((report) => report.teacher.id === teacherFilter)
    : initialReports;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <select
          value={teacherFilter}
          onChange={(e) => setTeacherFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
        >
          <option value="">All teachers</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
        {teacherFilter && <MonthlyPdfDownload teacherId={teacherFilter} />}
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Teacher</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
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
                <td className="px-4 py-3 text-gray-500">{report.notes || "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
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
