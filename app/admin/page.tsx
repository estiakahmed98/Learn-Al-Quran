import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [courseCount, enrollmentCount, pendingCount, verifiedCount] = await Promise.all([
    prisma.course.count().catch(() => 0),
    prisma.enrollment.count().catch(() => 0),
    prisma.enrollment.count({ where: { paymentStatus: "PENDING" } }).catch(() => 0),
    prisma.enrollment.count({ where: { paymentStatus: "VERIFIED" } }).catch(() => 0)
  ]);

  const stats = [
    { label: "Total Courses", value: courseCount, icon: "📚" },
    { label: "Total Enrollments", value: enrollmentCount, icon: "📝" },
    { label: "Pending Payments", value: pendingCount, icon: "⏳" },
    { label: "Verified Payments", value: verifiedCount, icon: "✅" }
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">Overview of your madrasa's activity.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-3xl">{s.icon}</p>
            <p className="mt-3 font-heading text-2xl font-bold text-primary-dark">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
