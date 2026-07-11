import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CourseForm from "@/components/admin/CourseForm";
import EnrollmentsTable from "@/components/admin/EnrollmentsTable";
import ClassScheduleManager from "@/components/admin/ClassScheduleManager";
import NotesManager from "@/components/admin/NotesManager";

export const dynamic = "force-dynamic";

export default async function AdminCourseDetailPage({ params }: { params: { id: string } }) {
  const course = await prisma.course
    .findUnique({
      where: { id: params.id },
      include: {
        enrollments: {
          include: {
            course: { select: { title: true } },
            results: { orderBy: { examDate: "desc" } }
          },
          orderBy: { createdAt: "desc" }
        },
        classSchedules: { orderBy: { dayOfWeek: "asc" } },
        notes: { orderBy: { createdAt: "desc" } }
      }
    })
    .catch(() => null);

  if (!course) notFound();

  const enrollments = course.enrollments;
  const stats = {
    total: enrollments.length,
    pending: enrollments.filter((e) => e.enrollmentStatus === "PENDING").length,
    active: enrollments.filter((e) => ["APPROVED", "ACTIVE"].includes(e.enrollmentStatus)).length,
    completed: enrollments.filter((e) => e.enrollmentStatus === "COMPLETED").length,
    verifiedRevenue: enrollments
      .filter((e) => e.paymentStatus === "VERIFIED")
      .reduce((sum, e) => sum + e.paymentAmount, 0)
  };

  const statCards = [
    { label: "Total Students", value: stats.total, color: "text-primary-dark" },
    { label: "Pending", value: stats.pending, color: "text-amber-600" },
    { label: "Active / Approved", value: stats.active, color: "text-green-600" },
    { label: "Completed", value: stats.completed, color: "text-blue-600" },
    { label: "Verified Revenue (৳)", value: stats.verifiedRevenue.toLocaleString(), color: "text-primary-dark" }
  ];

  return (
    <div>
      <Link href="/admin/courses" className="text-sm font-semibold text-primary hover:underline">
        &larr; Back to Courses
      </Link>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="font-heading text-2xl font-bold text-primary-dark">{course.title}</h1>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            course.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {course.isActive ? "Active" : "Hidden"}
        </span>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Edit this course and manage its enrolled students below.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold text-gray-500">{card.label}</p>
            <p className={`mt-1 text-2xl font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-heading text-lg font-bold text-primary-dark">Course Details</h2>
        <CourseForm
          courseId={course.id}
          initial={{
            title: course.title,
            slug: course.slug,
            description: course.description,
            fee: course.fee,
            duration: course.duration ?? "",
            thumbnail: course.thumbnail ?? "",
            bannerImage: course.bannerImage ?? "",
            sortOrder: course.sortOrder,
            isActive: course.isActive,
            isFeatured: course.isFeatured,
            metaTitle: course.metaTitle ?? "",
            metaDescription: course.metaDescription ?? ""
          }}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-heading text-lg font-bold text-primary-dark">Class Routine</h2>
        <ClassScheduleManager
          courseId={course.id}
          initialSchedules={JSON.parse(JSON.stringify(course.classSchedules))}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-heading text-lg font-bold text-primary-dark">Notes</h2>
        <NotesManager courseId={course.id} initialNotes={JSON.parse(JSON.stringify(course.notes))} />
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-lg font-bold text-primary-dark">
          Students ({stats.total})
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enrollments for this course. Update payment and enrollment status directly.
        </p>
        <div className="mt-4">
          <EnrollmentsTable initialEnrollments={JSON.parse(JSON.stringify(enrollments))} />
        </div>
      </div>
    </div>
  );
}
