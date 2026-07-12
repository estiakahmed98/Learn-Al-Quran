import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StudentCourseCard from "@/components/dashboard/StudentCourseCard";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Courses", robots: { index: false, follow: false } };

export default async function StudentCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login?callbackUrl=/student/courses");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/auth/login");

  const enrollments = await prisma.enrollment.findMany({
    where: {
      OR: [{ userId: user.id }, ...(user.email ? [{ email: user.email }] : [])]
    },
    include: {
      course: true,
      _count: { select: { results: true } }
    },
    orderBy: { createdAt: "desc" }
  });

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
            className="mt-4 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {enrollments.map((e) => (
            <StudentCourseCard
              key={e.id}
              labels={{ enrolled: "Enrolled", results: "results", manage: "Manage this course" }}
              enrollment={{
                id: e.id,
                paymentStatus: e.paymentStatus,
                enrollmentStatus: e.enrollmentStatus,
                createdAt: e.createdAt.toISOString(),
                resultCount: e._count.results,
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
