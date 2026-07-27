"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import UserForm from "./UserForm";
import { updateUser, deleteUser } from "@/app/admin/users/actions";

export interface StudentRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  imageUrl: string | null;
  studentStatus: "FREE_TRIAL" | "REGULAR";
  isActive: boolean;
  createdAt: string;
  _count: { enrollments: number };
}

const PAGE_SIZE = 10;
const ACTIVE_FILTERS = ["ALL", "ACTIVE", "BLOCKED"] as const;
type ActiveFilter = (typeof ACTIVE_FILTERS)[number];

const STATUS_TABS: {
  id: "FREE_TRIAL" | "REGULAR";
  label: string;
  colorClasses: { active: string; inactive: string };
}[] = [
  {
    id: "FREE_TRIAL",
    label: "🎓 Free Trial",
    colorClasses: { active: "bg-teal-600 text-white shadow-teal-200", inactive: "bg-teal-50 text-teal-700 hover:bg-teal-100" }
  },
  {
    id: "REGULAR",
    label: "📘 Regular",
    colorClasses: { active: "bg-blue-600 text-white shadow-blue-200", inactive: "bg-blue-50 text-blue-700 hover:bg-blue-100" }
  }
];

export default function StudentsTable({ initialStudents }: { initialStudents: StudentRow[] }) {
  const router = useRouter();
  const [students, setStudents] = useState(initialStudents);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState<"FREE_TRIAL" | "REGULAR">("FREE_TRIAL");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("ALL");
  const [page, setPage] = useState(1);

  const filtered = students.filter((s) => {
    const q = search.toLowerCase();
    const matchesSearch =
      s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || (s.phone || "").includes(q);
    const matchesStatus = s.studentStatus === statusTab;
    const matchesActive =
      activeFilter === "ALL" || (activeFilter === "ACTIVE" ? s.isActive : !s.isActive);
    return matchesSearch && matchesStatus && matchesActive;
  });

  const counts = {
    FREE_TRIAL: students.filter((s) => s.studentStatus === "FREE_TRIAL").length,
    REGULAR: students.filter((s) => s.studentStatus === "REGULAR").length
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  async function toggleActive(student: StudentRow) {
    setSavingId(student.id);
    try {
      const updated = await updateUser(student.id, { isActive: !student.isActive });
      setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, ...updated } : s)));
    } catch {
      // ignore; button state will simply not change
    }
    setSavingId(null);
  }

  async function remove(student: StudentRow) {
    if (!confirm(`Delete student "${student.name}" (${student.email})? This cannot be undone.`)) return;
    setSavingId(student.id);
    try {
      await deleteUser(student.id);
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete student.");
    }
    setSavingId(null);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUS_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setStatusTab(t.id);
              setPage(1);
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition ${
              statusTab === t.id ? t.colorClasses.active : t.colorClasses.inactive
            }`}
          >
            {t.label}
            <span className="ml-1.5 opacity-80">({counts[t.id]})</span>
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value as ActiveFilter);
              setPage(1);
            }}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
        >
          + Add New Student
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-gray-600">
            <tr>
              <th className="px-4 py-3">Student</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Enrollments</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((student) => (
              <tr key={student.id} className="border-t border-gray-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/students/${student.id}`} className="shrink-0">
                      {student.imageUrl ? (
                        <img
                          src={student.imageUrl}
                          alt={`${student.name} avatar`}
                          className="h-10 w-10 rounded-full border border-gray-200 object-cover"
                        />
                      ) : (
                        <span
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold uppercase text-primary"
                          aria-hidden="true"
                        >
                          {student.name.trim().charAt(0) || "S"}
                        </span>
                      )}
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="font-medium text-gray-800 hover:text-primary hover:underline"
                      >
                        {student.name}
                      </Link>
                      <p className="truncate text-xs text-gray-400">{student.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {student.phone && <p>Tel: {student.phone}</p>}
                  {student.whatsapp && <p>WA: {student.whatsapp}</p>}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      student.studentStatus === "FREE_TRIAL"
                        ? "bg-teal-50 text-teal-700"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {student.studentStatus === "FREE_TRIAL" ? "FREE TRIAL" : "REGULAR"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/students/${student.id}`}
                    className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                  >
                    {student._count.enrollments}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-500">{formatDate(student.createdAt)}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(student)}
                    disabled={savingId === student.id}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      student.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {student.isActive ? "Active" : "Blocked"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/students/${student.id}`}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Manage
                    </Link>
                    <button
                      onClick={() => remove(student)}
                      disabled={savingId === student.id}
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
        {filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-gray-400">
            {students.length === 0 ? "No students yet. Click “Add New Student” to create one." : "No students match your search."}
          </p>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            Showing {(currentPage - 1) * PAGE_SIZE + 1}-
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-xs text-gray-500">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 py-10"
          onClick={() => setShowAddModal(false)}
        >
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-primary-dark">Add New Student</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <UserForm
              roleOptions={["STUDENT"]}
              onSaved={(created) => {
                setStudents((prev) => [{ ...created, _count: created._count ?? { enrollments: 0 } }, ...prev]);
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
