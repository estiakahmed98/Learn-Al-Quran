import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import UserForm from "@/components/admin/UserForm";
import EnrollmentsTable from "@/components/admin/EnrollmentsTable";

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const user = await prisma.user
    .findUnique({
      where: { id: params.id },
      include: {
        enrollments: {
          include: {
            course: { select: { title: true } },
            results: { orderBy: { examDate: "desc" } }
          },
          orderBy: { createdAt: "desc" }
        }
      }
    })
    .catch(() => null);

  if (!user) notFound();

  const enrollments = user.enrollments;
  const stats = {
    total: enrollments.length,
    active: enrollments.filter((e) => ["APPROVED", "ACTIVE"].includes(e.enrollmentStatus)).length,
    completed: enrollments.filter((e) => e.enrollmentStatus === "COMPLETED").length,
    verifiedPaid: enrollments
      .filter((e) => e.paymentStatus === "VERIFIED")
      .reduce((sum, e) => sum + e.paymentAmount, 0)
  };

  const statCards = [
    { label: "Total Enrollments", value: stats.total, color: "text-primary-dark" },
    { label: "Active / Approved", value: stats.active, color: "text-green-600" },
    { label: "Completed", value: stats.completed, color: "text-blue-600" },
    { label: "Verified Paid (৳)", value: stats.verifiedPaid.toLocaleString(), color: "text-primary-dark" }
  ];

  return (
    <div>
      <Link href="/admin/users" className="text-sm font-semibold text-primary hover:underline">
        &larr; Back to Users
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-bold text-primary-dark">{user.name}</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-blue-50 text-blue-700"
          }`}
        >
          {user.role}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            user.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {user.isActive ? "Active" : "Blocked"}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {user.email} · Joined {formatDate(user.createdAt)}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold text-gray-500">{card.label}</p>
            <p className={`mt-1 text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-heading text-lg font-bold text-primary-dark">Profile & Account</h2>
        <UserForm
          userId={user.id}
          initial={{
            name: user.name,
            email: user.email,
            phone: user.phone ?? "",
            whatsapp: user.whatsapp ?? "",
            address: user.address ?? "",
            imageURL: user.imageURL ?? "",
            role: user.role,
            isActive: user.isActive
          }}
        />
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-lg font-bold text-primary-dark">
          Enrollments ({stats.total})
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          All courses this user has enrolled in. Update payment and enrollment status directly.
        </p>
        <div className="mt-4">
          <EnrollmentsTable initialEnrollments={JSON.parse(JSON.stringify(enrollments))} />
        </div>
      </div>
    </div>
  );
}
