import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import UserForm from "@/components/admin/UserForm";
import EnrollmentsTable from "@/components/admin/EnrollmentsTable";
import AssignCourseForm from "@/components/admin/AssignCourseForm";

export const dynamic = "force-dynamic";

export default async function AdminUserDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await getAuthSession();
  if (!auth) notFound();

  const [user, courses, allEnrollments] = await Promise.all([
    api.users.adminGet(params.id, auth.token).catch(() => null),
    api.courses
      .list({ perPage: 100 }, auth.token)
      .then((res) => res.data.map((c: any) => ({ id: c.id, title: c.title, fee: c.fee })))
      .catch(() => []),
    api.enrollments
      .adminList(auth.token, { perPage: 500 })
      .then((res) => res.data)
      .catch(() => [])
  ]);

  if (!user) notFound();

  const enrollments = (allEnrollments as any[])
    .filter((e) => e.user?.id === user.id || e.userId === user.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const stats = {
    total: enrollments.length,
    active: enrollments.filter((e) => ["APPROVED", "ACTIVE"].includes(e.enrollmentStatus)).length,
    pendingPayment: enrollments.filter((e) => e.paymentStatus === "PENDING").length,
    verifiedPaid: enrollments
      .filter((e) => e.paymentStatus === "VERIFIED")
      .reduce((sum, e) => sum + e.paymentAmount, 0)
  };

  const statCards = [
    { label: "Total Enrollments", value: stats.total, color: "text-primary-dark" },
    { label: "Active / Approved", value: stats.active, color: "text-green-600" },
    { label: "Pending Payment", value: stats.pendingPayment, color: "text-amber-600" },
    { label: "Verified Paid (৳)", value: stats.verifiedPaid.toLocaleString(), color: "text-primary-dark" }
  ];

  const enrolledCourseIds = enrollments.map((e) => e.course.id);

  return (
    <div>
      <Link href="/admin/users" className="text-sm font-semibold text-primary hover:underline">
        &larr; Back to Users
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-bold text-primary-dark">{user.name}</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            user.role === "ADMIN"
              ? "bg-purple-100 text-purple-700"
              : user.role === "TEACHER"
                ? "bg-amber-100 text-amber-700"
                : "bg-blue-50 text-blue-700"
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
        {user.email} · Joined {formatDate(user.createdAt ?? new Date())}
      </p>

      {user.role === "STUDENT" && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="text-xs font-semibold text-gray-500">{card.label}</p>
              <p className={`mt-1 text-2xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

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
            description: user.description ?? "",
            designation: user.designation ?? "",
            imageUrl: user.imageUrl ?? "",
            role: user.role,
            isActive: user.isActive,
            permissions: user.permissions
          }}
        />
      </div>

      {user.role === "STUDENT" && (
        <>
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="mb-1 font-heading text-lg font-bold text-primary-dark">Assign a Course</h2>
            <p className="mb-4 text-sm text-gray-500">
              Manually enroll this user in a course. It is added as approved (payment verified, active)
              and appears on their dashboard immediately.
            </p>
            <AssignCourseForm
              userId={user.id}
              courses={courses}
              enrolledCourseIds={enrolledCourseIds}
            />
          </div>

          <div className="mt-8">
            <h2 className="font-heading text-lg font-bold text-primary-dark">
              Enrollments & Payments ({stats.total})
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              All courses this user has enrolled in. Update payment/enrollment status, add results, or
              remove an enrollment directly below.
            </p>

            <div className="mt-4">
              <EnrollmentsTable initialEnrollments={JSON.parse(JSON.stringify(enrollments))} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
