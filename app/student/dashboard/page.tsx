import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StudentCourseCard from "@/components/dashboard/StudentCourseCard";

export const metadata = {
  title: "Student Dashboard",
  robots: { index: false, follow: false }
};

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login?callbackUrl=/student/dashboard");
  if (session.user.role === "ADMIN") redirect("/admin");

  const t = await getTranslations("dashboard");

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

  const activeCount = enrollments.filter((e) => e.enrollmentStatus === "ACTIVE").length;
  const pendingCount = enrollments.filter((e) => e.enrollmentStatus === "PENDING").length;
  const completedCount = enrollments.filter((e) => e.enrollmentStatus === "COMPLETED").length;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">
        {t("greeting", { name: user.name })}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {user.email}
        {user.phone ? ` · ${user.phone}` : ""}
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: t("totalEnrollments"), value: enrollments.length, icon: "📚" },
          { label: t("activeCourses"), value: activeCount, icon: "🟢" },
          { label: t("pending"), value: pendingCount, icon: "⏳" },
          { label: t("completed"), value: completedCount, icon: "🎓" }
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-2xl">{s.icon}</p>
            <p className="mt-2 font-heading text-2xl font-bold text-primary-dark">{s.value}</p>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Enrollments */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-bold text-primary-dark">{t("myCourses")}</h2>

        {enrollments.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <p className="text-3xl">📖</p>
            <p className="mt-3 font-semibold text-gray-700">{t("noCourses")}</p>
            <Link
              href="/courses"
              className="mt-4 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              {t("browseCourses")}
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {enrollments.map((e) => (
              <StudentCourseCard
                key={e.id}
                labels={{ enrolled: t("enrolled"), results: t("results"), manage: t("manage") }}
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
    </div>
  );
}
