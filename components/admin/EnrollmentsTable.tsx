"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";

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
}

const paymentStatuses = ["PENDING", "PAID", "VERIFIED", "REJECTED"];
const enrollmentStatuses = ["PENDING", "APPROVED", "ACTIVE", "COMPLETED", "CANCELLED"];

export default function EnrollmentsTable({
  initialEnrollments
}: {
  initialEnrollments: EnrollmentRow[];
}) {
  const [rows, setRows] = useState(initialEnrollments);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function update(id: string, patch: Partial<EnrollmentRow>) {
    setSavingId(id);
    const res = await fetch(`/api/admin/enrollments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch)
    });
    if (res.ok) {
      const updated = await res.json();
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
    }
    setSavingId(null);
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
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
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
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <p className="p-6 text-center text-sm text-gray-400">No enrollments yet.</p>
      )}
    </div>
  );
}
