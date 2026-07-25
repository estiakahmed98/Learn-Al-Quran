"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  updateEnrollment,
  deleteEnrollment,
  addEnrollmentResult,
  deleteEnrollmentResult
} from "@/components/admin/enrollments-actions";

interface ResultRow {
  id: string;
  examName: string;
  marks: number | null;
  grade: string | null;
  remarks: string | null;
  examDate: string;
}

interface EnrollmentRow {
  id: string;
  studentName: string;
  whatsappNumber: string;
  contactNumber: string;
  email: string | null;
  paymentMethod: string;
  transactionId: string | null;
  paymentStatus: string;
  enrollmentStatus: string;
  createdAt: string;
  course: { title: string };
  results?: ResultRow[];
}

const paymentStatuses = ["PENDING", "PAID", "VERIFIED", "REJECTED"];
const enrollmentStatuses = ["PENDING", "APPROVED", "ACTIVE", "COMPLETED", "CANCELLED"];

const emptyResultForm = { examName: "", marks: "", grade: "", remarks: "", examDate: "" };

export default function EnrollmentsTable({
  initialEnrollments
}: {
  initialEnrollments: EnrollmentRow[];
}) {
  const [rows, setRows] = useState(initialEnrollments);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resultForm, setResultForm] = useState(emptyResultForm);
  const [savingResult, setSavingResult] = useState(false);

  async function update(id: string, patch: Partial<EnrollmentRow>) {
    setSavingId(id);
    try {
      const updated = await updateEnrollment(id, patch);
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
    } catch {
      // no-op: leave the row as-is, admin can retry
    } finally {
      setSavingId(null);
    }
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
    setResultForm(emptyResultForm);
  }

  async function remove(row: EnrollmentRow) {
    if (
      !confirm(
        `Remove "${row.studentName}" from ${row.course?.title || "this course"}? This deletes the enrollment and its results. This cannot be undone.`
      )
    )
      return;
    setSavingId(row.id);
    try {
      await deleteEnrollment(row.id);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch {
      // no-op
    } finally {
      setSavingId(null);
    }
  }

  async function addResult(enrollmentId: string) {
    if (!resultForm.examName.trim()) return;
    setSavingResult(true);
    try {
      const created = await addEnrollmentResult({
        enrollmentId,
        examName: resultForm.examName.trim(),
        marks: resultForm.marks,
        grade: resultForm.grade.trim(),
        remarks: resultForm.remarks.trim(),
        examDate: resultForm.examDate || undefined
      });
      setRows((prev) =>
        prev.map((r) =>
          r.id === enrollmentId ? { ...r, results: [...(r.results || []), created] } : r
        )
      );
      setResultForm(emptyResultForm);
    } catch {
      // no-op
    } finally {
      setSavingResult(false);
    }
  }

  async function removeResult(enrollmentId: string, resultId: string) {
    if (!confirm("Delete this result entry?")) return;
    try {
      await deleteEnrollmentResult(resultId);
      setRows((prev) =>
        prev.map((r) =>
          r.id === enrollmentId
            ? { ...r, results: (r.results || []).filter((res) => res.id !== resultId) }
            : r
        )
      );
    } catch {
      // no-op
    }
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-cream text-gray-600">
          <tr>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Course</th>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Payment</th>
            <th className="px-4 py-3">Payment Status</th>
            <th className="px-4 py-3">Enrollment Status</th>
            <th className="px-4 py-3">Results</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <>
              <tr key={row.id} className="border-t border-gray-100 align-top">
                <td className="px-4 py-3 text-gray-500">{formatDate(row.createdAt)}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">{row.studentName}</p>
                  {row.email && <p className="text-xs text-gray-400">{row.email}</p>}
                </td>
                <td className="px-4 py-3 text-gray-600">{row.course?.title}</td>
                <td className="px-4 py-3 text-gray-600">
                  <p>WA: {row.whatsappNumber}</p>
                  <p>Tel: {row.contactNumber}</p>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  <p>{row.paymentMethod}</p>
                  {row.transactionId && <p className="text-xs text-gray-400">TxID: {row.transactionId}</p>}
                </td>
                <td className="px-4 py-3">
                  <select
                    defaultValue={row.paymentStatus}
                    disabled={savingId === row.id}
                    onChange={(e) => update(row.id, { paymentStatus: e.target.value as any })}
                    className="rounded border border-gray-300 px-2 py-1 text-xs"
                  >
                    {paymentStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <select
                    defaultValue={row.enrollmentStatus}
                    disabled={savingId === row.id}
                    onChange={(e) => update(row.id, { enrollmentStatus: e.target.value as any })}
                    className="rounded border border-gray-300 px-2 py-1 text-xs"
                  >
                    {enrollmentStatuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleExpand(row.id)}
                    className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700 hover:bg-purple-100"
                  >
                    {row.results?.length ? `${row.results.length} result(s)` : "Add Result"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => remove(row)}
                    disabled={savingId === row.id}
                    className="text-xs font-semibold text-red-500 hover:underline disabled:opacity-50"
                  >
                    Remove
                  </button>
                </td>
              </tr>

              {expandedId === row.id && (
                <tr key={`${row.id}-results`} className="border-t border-gray-100 bg-gray-50">
                  <td colSpan={9} className="px-4 py-4">
                    <div className="space-y-3">
                      {(row.results || []).length > 0 && (
                        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-gray-100 text-gray-500">
                              <tr>
                                <th className="px-3 py-2">Exam</th>
                                <th className="px-3 py-2">Marks</th>
                                <th className="px-3 py-2">Grade</th>
                                <th className="px-3 py-2">Remarks</th>
                                <th className="px-3 py-2">Date</th>
                                <th className="px-3 py-2"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {(row.results || []).map((r) => (
                                <tr key={r.id} className="border-t border-gray-100">
                                  <td className="px-3 py-2 font-medium text-gray-700">{r.examName}</td>
                                  <td className="px-3 py-2">{r.marks ?? "-"}</td>
                                  <td className="px-3 py-2">{r.grade ?? "-"}</td>
                                  <td className="px-3 py-2 text-gray-500">{r.remarks ?? "-"}</td>
                                  <td className="px-3 py-2 text-gray-500">{formatDate(r.examDate)}</td>
                                  <td className="px-3 py-2">
                                    <button
                                      onClick={() => removeResult(row.id, r.id)}
                                      className="font-semibold text-red-500 hover:underline"
                                    >
                                      Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      <div className="flex flex-wrap items-end gap-2">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-500">Exam Name *</label>
                          <input
                            value={resultForm.examName}
                            onChange={(e) => setResultForm({ ...resultForm, examName: e.target.value })}
                            placeholder="e.g. Midterm"
                            className="w-36 rounded border border-gray-300 px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-500">Marks</label>
                          <input
                            type="number"
                            value={resultForm.marks}
                            onChange={(e) => setResultForm({ ...resultForm, marks: e.target.value })}
                            className="w-20 rounded border border-gray-300 px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-500">Grade</label>
                          <input
                            value={resultForm.grade}
                            onChange={(e) => setResultForm({ ...resultForm, grade: e.target.value })}
                            placeholder="A+"
                            className="w-16 rounded border border-gray-300 px-2 py-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-500">Date</label>
                          <input
                            type="date"
                            value={resultForm.examDate}
                            onChange={(e) => setResultForm({ ...resultForm, examDate: e.target.value })}
                            className="rounded border border-gray-300 px-2 py-1 text-xs"
                          />
                        </div>
                        <div className="min-w-[160px] flex-1">
                          <label className="mb-1 block text-xs font-semibold text-gray-500">Remarks</label>
                          <input
                            value={resultForm.remarks}
                            onChange={(e) => setResultForm({ ...resultForm, remarks: e.target.value })}
                            className="w-full rounded border border-gray-300 px-2 py-1 text-xs"
                          />
                        </div>
                        <button
                          onClick={() => addResult(row.id)}
                          disabled={savingResult || !resultForm.examName.trim()}
                          className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                        >
                          {savingResult ? "Saving..." : "Add Result"}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="p-6 text-center text-sm text-gray-400">No enrollments yet.</p>
      )}
    </div>
  );
}
