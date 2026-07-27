"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { setEnrollmentPaymentStatus } from "@/app/admin/payments/actions";

interface PaymentRow {
  id: string;
  studentName: string;
  email: string | null;
  contactNumber: string;
  whatsappNumber: string;
  paymentMethod: string;
  transactionId: string | null;
  paymentAmount: number;
  paymentStatus: string;
  enrollmentStatus: string;
  createdAt: string;
  userId: string | null;
  course: { id: string; title: string };
}

const paymentStatusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  VERIFIED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-700"
};

type Filter = "PENDING" | "ALL";

export default function PaymentApprovals({ initialRows }: { initialRows: PaymentRow[] }) {
  const [rows, setRows] = useState(initialRows);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("PENDING");

  const pendingRows = rows.filter(
    (r) => r.paymentStatus === "PENDING" || r.paymentStatus === "PAID"
  );
  const visible = filter === "PENDING" ? pendingRows : rows;

  async function act(id: string, reject: boolean) {
    setBusyId(id);
    try {
      const updated = await setEnrollmentPaymentStatus(id, reject);
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
      window.dispatchEvent(
        new CustomEvent("admin:pending-payments-change", { detail: -1 }),
      );
    } catch {
      // no-op: leave the row as-is, admin can retry
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
          {(["PENDING", "ALL"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold ${
                filter === f ? "bg-primary text-white" : "text-gray-500 hover:text-primary-dark"
              }`}
            >
              {f === "PENDING" ? `Pending (${pendingRows.length})` : `All (${rows.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-gray-600">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Amount (৳)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => {
              const isPending = row.paymentStatus === "PENDING" || row.paymentStatus === "PAID";
              return (
                <tr key={row.id} className="border-t border-gray-100 align-top">
                  <td className="px-4 py-3 text-gray-500">{formatDate(row.createdAt)}</td>
                  <td className="px-4 py-3">
                    {row.userId ? (
                      <Link
                        href={`/admin/users/${row.userId}`}
                        className="font-medium text-gray-800 hover:text-primary hover:underline"
                      >
                        {row.studentName}
                      </Link>
                    ) : (
                      <p className="font-medium text-gray-800">{row.studentName}</p>
                    )}
                    {row.email && <p className="text-xs text-gray-400">{row.email}</p>}
                    <p className="text-xs text-gray-400">📞 {row.contactNumber}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/courses/${row.course.id}`}
                      className="text-gray-700 hover:text-primary hover:underline"
                    >
                      {row.course.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    <p>{row.paymentMethod}</p>
                    {row.transactionId && (
                      <p className="text-xs text-gray-400">TxID: {row.transactionId}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{row.paymentAmount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        paymentStatusStyles[row.paymentStatus] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {row.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {isPending ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => act(row.id, false)}
                          disabled={busyId === row.id}
                          className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          {busyId === row.id ? "…" : "Approve"}
                        </button>
                        <button
                          onClick={() => act(row.id, true)}
                          disabled={busyId === row.id}
                          className="rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">{row.enrollmentStatus}</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {visible.length === 0 && (
          <p className="p-6 text-center text-sm text-gray-400">
            {filter === "PENDING" ? "No pending payments to approve. 🎉" : "No payments yet."}
          </p>
        )}
      </div>
    </div>
  );
}
