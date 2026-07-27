import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import UsersTable from "@/components/admin/UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const auth = await getAuthSession();
  const { data: allUsers } = auth
    ? await api.users.adminList(auth.token, { perPage: 200 }).catch(() => ({ data: [] }))
    : { data: [] };

  const users = allUsers
    .filter((u) => u.role !== "STUDENT")
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone ?? null,
      whatsapp: u.whatsapp ?? null,
      imageUrl: u.imageUrl ?? null,
      role: u.role,
      studentStatus: u.studentStatus,
      isActive: u.isActive,
      createdAt: (u as any).createdAt,
      _count: { enrollments: u.enrollmentsCount ?? 0 }
    }));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">Users</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage admin and teacher accounts. Student accounts are managed under Student Management.
      </p>

      <div className="mt-6">
        <UsersTable initialUsers={users} />
      </div>
    </div>
  );
}
