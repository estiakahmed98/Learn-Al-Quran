import { prisma } from "@/lib/prisma";
import StudentsTable from "@/components/admin/StudentsTable";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const students = await prisma.user
    .findMany({
      where: { role: "STUDENT" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        whatsapp: true,
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
