"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [selectedReport, setSelectedReport] = useState<ClassReportRow | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!selectedReport) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedReport]);

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
                <td className="px-4 py-3 text-gray-500">
                  <p className="max-w-[220px] break-words">
                    {report.notes?.trim().split(/\s+/).slice(0, 5).join(" ") || "—"}
                    {(report.notes?.trim().split(/\s+/).length ?? 0) > 5 ? "…" : ""}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedReport(report)}
                    aria-haspopup="dialog"
                    aria-label={`See full class report for ${report.teacher.name}, ${report.course.title}, ${report.classDate.slice(0, 10)}`}
                    className="mt-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    See more
                  </button>
                </td>
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
      <dialog
        ref={dialogRef}
        aria-labelledby="class-report-title"
        onCancel={() => setSelectedReport(null)}
        onClose={() => setSelectedReport(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setSelectedReport(null);
        }}
        className="m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-2xl overflow-hidden rounded-2xl bg-white p-0 shadow-2xl backdrop:bg-slate-950/60"
      >
        {selectedReport && (
          <div className="flex max-h-[90dvh] flex-col">
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-gray-100 bg-emerald-50 px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Teacher report</p>
                <h2 id="class-report-title" className="mt-1 text-xl font-bold text-primary-dark">Class report details</h2>
              </div>
              <button type="button" autoFocus onClick={() => setSelectedReport(null)} aria-label="Close class report" className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                Close
              </button>
            </div>
            <div className="min-h-0 overflow-y-auto overscroll-contain p-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  ["Date", new Date(selectedReport.classDate).toLocaleDateString()],
                  ["Teacher", selectedReport.teacher.name],
                  ["Course", selectedReport.course.title],
                  ["Time", `${selectedReport.startTime}${selectedReport.endTime ? ` – ${selectedReport.endTime}` : ""}`],
                  ["Status", selectedReport.completed ? "Completed" : "Incomplete"],
                  ["Attended", selectedReport.attended ?? "Not recorded"]
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0 rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <dt className="text-xs font-medium text-gray-500">{label}</dt>
                    <dd className="mt-1 whitespace-pre-wrap break-words text-sm font-semibold text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
              <section className="mt-5 rounded-xl border border-gray-200 p-4" aria-labelledby="class-report-notes">
                <h3 id="class-report-notes" className="font-semibold text-primary-dark">Notes</h3>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">{selectedReport.notes?.trim() || "No notes provided."}</p>
              </section>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
