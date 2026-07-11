import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Courses", robots: { index: false, follow: false } };

const enrollmentStatusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  ACTIVE: "bg-green-100 text-green-800",
  COMPLETED: "bg-primary/10 text-primary-dark",
  CANCELLED: "bg-red-100 text-red-700"
};

export default async function StudentCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login?callbackUrl=/student/courses");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/auth/login");

  const enrollments = await prisma.enrollment.findMany({
    where: {
      OR: [{ userId: user.id }, ...(user.email ? [{ email: user.email }] : [])]
    },
    include: { course: true },
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
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((e) => (
            <Link
              key={e.id}
              href={`/student/courses/${e.course.id}`}
              className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="font-heading text-base font-bold text-primary-dark">{e.course.title}</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    enrollmentStatusStyles[e.enrollmentStatus] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {e.enrollmentStatus}
                </span>
              </div>
              {e.course.duration && <p className="text-sm text-gray-500">{e.course.duration}</p>}
              <span className="text-xs font-semibold text-primary">Manage this course →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
