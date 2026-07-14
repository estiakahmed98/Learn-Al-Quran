import { prisma } from "@/lib/prisma";
import UsersTable from "@/components/admin/UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user
    .findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        whatsapp: true,
        role: true,
        studentStatus: true,
        isActive: true,
        createdAt: true,
        _count: { select: { enrollments: true } }
      },
      orderBy: { createdAt: "desc" }
    })
    .catch(() => []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">Users</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage student and admin accounts. Click a user to manage everything about them.
      </p>

      <div className="mt-6">
        <UsersTable initialUsers={JSON.parse(JSON.stringify(users))} />
      </div>
    </div>
  );
}
