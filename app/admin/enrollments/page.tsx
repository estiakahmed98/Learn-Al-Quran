import { prisma } from "@/lib/prisma";
import EnrollmentsTable from "@/components/admin/EnrollmentsTable";

export const dynamic = "force-dynamic";

export default async function AdminEnrollmentsPage() {
  const enrollments = await prisma.enrollment
    .findMany({
      include: { course: { select: { title: true } } },
      orderBy: { createdAt: "desc" }
    })
    .catch(() => []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">Enrollments</h1>
      <p className="mt-1 text-sm text-gray-500">
        Review submitted admission forms, verify payments, and update enrollment status.
      </p>

      <div className="mt-6">
        <EnrollmentsTable initialEnrollments={JSON.parse(JSON.stringify(enrollments))} />
      </div>
    </div>
  );
}
