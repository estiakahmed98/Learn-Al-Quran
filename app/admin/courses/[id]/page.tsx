import Link from "next/link";
import { notFound } from "next/navigation";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import CourseForm from "@/components/admin/CourseForm";
import EnrollmentsTable from "@/components/admin/EnrollmentsTable";
import ClassScheduleManager from "@/components/admin/ClassScheduleManager";
import NotesManager from "@/components/admin/NotesManager";
import {
  getCurriculumSections,
  getFaqs,
  getFeatures,
  getLearnPoints,
  getWhyCards
} from "@/lib/course-content";

export const dynamic = "force-dynamic";

export default async function AdminCourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await getAuthSession();
  const token = auth?.token;

  const [course, teachersResult, enrollmentsResult] = await Promise.all([
    api.courses.get(params.id, token).catch(() => null),
    token
      ? api.users.adminList(token, { perPage: 200 }).catch(() => ({ data: [] as any[] }))
      : Promise.resolve({ data: [] as any[] }),
    // The Laravel admin/enrollments index has no course_id filter param, so we
    // fetch a broader page and filter client-side. Pragmatic at current data
    // volumes, but not ideal at scale — a course_id filter would be a good
    // backend follow-up.
    token
      ? api.enrollments.adminList(token, { perPage: 500 }).catch(() => ({ data: [] as any[] }))
      : Promise.resolve({ data: [] as any[] })
  ]);

  if (!course) notFound();

  const teachers = teachersResult.data
    .filter((user: any) => user.role === "TEACHER" && user.isActive)
    .map((user: any) => ({ id: user.id, name: user.name }));

  const enrollments = enrollmentsResult.data.filter(
    (enrollment: any) => (enrollment.course?.id ?? enrollment.courseId) === course.id
  );

  const stats = {
    total: enrollments.length,
    pending: enrollments.filter((e: any) => e.enrollmentStatus === "PENDING").length,
    active: enrollments.filter((e: any) => ["APPROVED", "ACTIVE"].includes(e.enrollmentStatus)).length,
    completed: enrollments.filter((e: any) => e.enrollmentStatus === "COMPLETED").length,
    verifiedRevenue: enrollments
      .filter((e: any) => e.paymentStatus === "VERIFIED")
      .reduce((sum: number, e: any) => sum + e.paymentAmount, 0)
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
          teachers={teachers}
          initial={{
            title: course.title,
            titleBn: course.titleBn ?? "",
            slug: course.slug,
            description: course.description,
            descriptionBn: course.descriptionBn ?? "",
            category: course.category ?? "",
            categoryBn: course.categoryBn ?? "",
            courseType: course.courseType ?? "",
            courseTypeBn: course.courseTypeBn ?? "",
            classType: course.classType ?? "",
            classTypeBn: course.classTypeBn ?? "",
            level: course.level ?? "",
            levelBn: course.levelBn ?? "",
            instructorName: course.instructorName ?? "",
            instructorId: course.instructorId ?? "",
            totalLessons: course.totalLessons?.toString() ?? "",
            totalHours: course.totalHours?.toString() ?? "",
            startDate: course.startDate ? new Date(course.startDate).toISOString().slice(0, 10) : "",
            enrollDeadline: course.enrollDeadline
              ? new Date(course.enrollDeadline).toISOString().slice(0, 10)
              : "",
            fee: course.fee,
            originalFee: course.originalFee?.toString() ?? "",
            couponCode: course.couponCode ?? "",
            couponPercent: course.couponPercent?.toString() ?? "",
            certificate: course.certificate,
            duration: course.duration ?? "",
            thumbnail: course.thumbnail ?? "",
            bannerImage: course.bannerImage ?? "",
            sortOrder: course.sortOrder,
            isActive: course.isActive,
            isFeatured: course.isFeatured,
            metaTitle: course.metaTitle ?? "",
            metaDescription: course.metaDescription ?? "",
            learnPoints: getLearnPoints(course),
            features: getFeatures(course),
            whyCards: getWhyCards(course),
            curriculumSections: getCurriculumSections(course),
            faqs: getFaqs(course)
          }}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-heading text-lg font-bold text-primary-dark">Class Routine</h2>
        <ClassScheduleManager
          courseId={course.id}
          initialSchedules={course.classSchedules ?? []}
        />
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-heading text-lg font-bold text-primary-dark">Notes</h2>
        <NotesManager courseId={course.id} initialNotes={course.notes ?? []} />
      </div>

      <div className="mt-8">
        <h2 className="font-heading text-lg font-bold text-primary-dark">
          Students ({stats.total})
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Enrollments for this course. Update payment and enrollment status directly.
        </p>
        <div className="mt-4">
          <EnrollmentsTable initialEnrollments={enrollments} />
        </div>
      </div>
    </div>
  );
}
