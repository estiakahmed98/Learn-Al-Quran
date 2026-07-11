import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payments", robots: { index: false, follow: false } };

const paymentStatusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  VERIFIED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-700"
};

export default async function StudentPaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login?callbackUrl=/student/payments");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/auth/login");

  const enrollments = await prisma.enrollment.findMany({
    where: {
      OR: [{ userId: user.id }, ...(user.email ? [{ email: user.email }] : [])]
    },
    include: { course: { select: { id: true, title: true } } },
    orderBy: { createdAt: "desc" }
  });

  const totalPaid = enrollments
    .filter((e) => e.paymentStatus === "VERIFIED" || e.paymentStatus === "PAID")
    .reduce((sum, e) => sum + e.paymentAmount, 0);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">Payments</h1>
      <p className="mt-1 text-sm text-gray-500">Your course fee payments and their verification status.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total Payments</p>
          <p className="mt-1 text-2xl font-bold text-primary-dark">{enrollments.length}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold text-gray-500">Total Paid (৳)</p>
          <p className="mt-1 text-2xl font-bold text-primary-dark">{totalPaid.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-gray-600">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Amount (৳)</th>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((e) => (
              <tr key={e.id} className="border-t border-gray-100">
                <td className="px-4 py-3 text-gray-500">{formatDate(e.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/student/courses/${e.course.id}`}
                    className="font-medium text-gray-800 hover:text-primary hover:underline"
                  >
                    {e.course.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-600">{e.paymentMethod}</td>
                <td className="px-4 py-3 text-gray-600">{e.paymentAmount}</td>
                <td className="px-4 py-3 text-gray-500">{e.transactionId || "-"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      paymentStatusStyles[e.paymentStatus] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {e.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {enrollments.length === 0 && (
          <p className="p-6 text-center text-sm text-gray-400">No payments yet.</p>
        )}
      </div>
    </div>
  );
}
