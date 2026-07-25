import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import StudentsTable from "@/components/admin/StudentsTable";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const auth = await getAuthSession();
  const { data: allUsers } = auth
    ? await api.users.adminList(auth.token, { perPage: 200 }).catch(() => ({ data: [] }))
    : { data: [] };

  const students = allUsers
    .filter((u) => u.role === "STUDENT")
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone ?? null,
      whatsapp: u.whatsapp ?? null,
      studentStatus: u.studentStatus,
      isActive: u.isActive,
      createdAt: (u as any).createdAt,
      _count: { enrollments: u.enrollmentsCount ?? 0 }
    }));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">Student Management</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage student accounts, enrollments, payments and results. Click a student for full control.
      </p>

      <div className="mt-6">
        <StudentsTable initialStudents={JSON.parse(JSON.stringify(students))} />
      </div>
    </div>
  );
}
