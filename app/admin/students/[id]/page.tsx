import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import UserForm from "@/components/admin/UserForm";
import EnrollmentsTable from "@/components/admin/EnrollmentsTable";
import AssignCourseForm from "@/components/admin/AssignCourseForm";

export const dynamic = "force-dynamic";

export default async function AdminStudentDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const [student, courses] = await Promise.all([
    prisma.user
      .findUnique({
        where: { id: params.id, role: "STUDENT" },
        include: {
          enrollments: {
            include: {
              course: { select: { id: true, title: true } },
              results: { orderBy: { examDate: "desc" } }
            },
            orderBy: { createdAt: "desc" }
          }
        }
      })
      .catch(() => null),
    prisma.course
      .findMany({ select: { id: true, title: true, fee: true }, orderBy: { sortOrder: "asc" } })
      .catch(() => [])
  ]);

  if (!student) notFound();

  const enrollments = student.enrollments;
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
      <Link href="/admin/students" className="text-sm font-semibold text-primary hover:underline">
        &larr; Back to Student Management
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-bold text-primary-dark">{student.name}</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            student.studentStatus === "FREE_TRIAL" ? "bg-teal-50 text-teal-700" : "bg-blue-50 text-blue-700"
          }`}
        >
          {student.studentStatus === "FREE_TRIAL" ? "FREE TRIAL" : "REGULAR"}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            student.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {student.isActive ? "Active" : "Blocked"}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {student.email} · Joined {formatDate(student.createdAt)}
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
        <h2 className="mb-4 font-heading text-lg font-bold text-primary-dark">Student Details</h2>
        <UserForm
          userId={student.id}
          roleOptions={["STUDENT"]}
          initial={{
            name: student.name,
            email: student.email,
            phone: student.phone ?? "",
            whatsapp: student.whatsapp ?? "",
            address: student.address ?? "",
            description: student.description ?? "",
            designation: student.designation ?? "",
            imageURL: student.imageURL ?? "",
            role: student.role,
            isActive: student.isActive,
            permissions: student.permissions
          }}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-1 font-heading text-lg font-bold text-primary-dark">Assign a Course</h2>
        <p className="mb-4 text-sm text-gray-500">
          Manually enroll this student in a course. It is added as approved (payment verified, active)
          and appears on their dashboard immediately.
        </p>
        <AssignCourseForm userId={student.id} courses={courses} enrolledCourseIds={enrolledCourseIds} />
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-lg font-bold text-primary-dark">
          Enrollments & Payments ({stats.total})
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          All courses this student has enrolled in. Update payment/enrollment status, add results, or
          remove an enrollment directly below.
        </p>

        <div className="mt-4">
          <EnrollmentsTable initialEnrollments={JSON.parse(JSON.stringify(enrollments))} />
        </div>
      </div>
    </div>
  );
}
