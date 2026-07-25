import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import StudentCourseCard from "@/components/dashboard/StudentCourseCard";
import IslamicPattern from "@/components/shared/IslamicPattern";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Courses", robots: { index: false, follow: false } };

export default async function StudentCoursesPage() {
  const auth = await getAuthSession();
  if (!auth) redirect("/auth/login?callbackUrl=/student/courses");

  const enrollments = await api.enrollments.my(auth.token);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">My Courses</h1>
      <p className="mt-1 text-sm text-gray-500">
        All the courses you have enrolled in. Click a course to see its class routine, notes, results and payment.
      </p>

      {enrollments.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <p className="text-3xl">📖</p>
          <p className="mt-3 font-semibold text-gray-700">You have not enrolled in any course yet.</p>
          <Link
            href="/courses"
            className="relative isolate mt-4 inline-block overflow-hidden rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            <IslamicPattern tone="gold" opacity={0.12} className="z-0" />
            <span className="relative z-10">Browse Courses</span>
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {enrollments.map((e: any) => (
            <StudentCourseCard
              key={e.id}
              labels={{ enrolled: "Enrolled", results: "results", manage: "Manage this course" }}
              enrollment={{
                id: e.id,
                paymentStatus: e.paymentStatus,
                enrollmentStatus: e.enrollmentStatus,
                createdAt: e.createdAt,
                resultCount: e.results?.length ?? 0,
                course: {
                  id: e.course.id,
                  title: e.course.title,
                  slug: e.course.slug,
                  duration: e.course.duration,
                  thumbnail: e.course.thumbnail
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
