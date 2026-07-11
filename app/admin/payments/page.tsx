import { prisma } from "@/lib/prisma";
import PaymentApprovals from "@/components/admin/PaymentApprovals";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const enrollments = await prisma.enrollment
    .findMany({
      include: { course: { select: { id: true, title: true } } },
      orderBy: { createdAt: "desc" }
    })
    .catch(() => []);

  const pendingCount = enrollments.filter(
    (e) => e.paymentStatus === "PENDING" || e.paymentStatus === "PAID"
  ).length;
  const verifiedRevenue = enrollments
    .filter((e) => e.paymentStatus === "VERIFIED")
    .reduce((sum, e) => sum + e.paymentAmount, 0);

  const statCards = [
    { label: "Pending Approvals", value: pendingCount, color: "text-amber-600" },
    { label: "Total Payments", value: enrollments.length, color: "text-primary-dark" },
    {
      label: "Verified Revenue (৳)",
      value: verifiedRevenue.toLocaleString(),
      color: "text-green-600"
    }
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">Payments & Approvals</h1>
      <p className="mt-1 text-sm text-gray-500">
        When a student enrolls with a payment, it lands here as pending. Approve to verify the
        payment and unlock the course on their dashboard.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold text-gray-500">{card.label}</p>
            <p className={`mt-1 text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <PaymentApprovals initialRows={JSON.parse(JSON.stringify(enrollments))} />
      </div>
    </div>
  );
}
