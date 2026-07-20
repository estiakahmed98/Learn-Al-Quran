import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StudentCourseCard from "@/components/dashboard/StudentCourseCard";
import IslamicPattern from "@/components/shared/IslamicPattern";

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

  const [enrollments, trialApplication] = await Promise.all([
    prisma.enrollment.findMany({
      where: { OR: [{ userId: user.id }, ...(user.email ? [{ email: user.email }] : [])] },
      include: { course: true, _count: { select: { results: true } } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.trialApplication.findFirst({
      where: { userId: user.id, status: { not: "CANCELLED" } },
      include: { course: { select: { title: true } } },
      orderBy: { createdAt: "desc" }
    })
  ]);

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

      {trialApplication && (
        <div className="mt-6 overflow-hidden rounded-2xl bg-primary-dark text-white shadow-lg">
          <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-dark">
                  {user.studentStatus === "FREE_TRIAL" ? t("trialStudent") : t("trialApplication")}
                </span>
                <span className="text-xs font-semibold text-secondary">
                  {t(`trialStatuses.${trialApplication.status}`)}
                </span>
              </div>
              <h2 className="mt-3 font-heading text-xl font-bold">{trialApplication.course.title}</h2>
              <p className="mt-2 text-sm text-white/70">
                {t("preferredTrialTime")}: {trialApplication.preferredSchedule?.replace("T", " ") || t("schedulePending")}
              </p>
            </div>
            <Link href="/free-trial-class" className="relative isolate overflow-hidden rounded-full border border-white/20 px-6 py-3 text-center text-sm font-bold hover:bg-white/10">
              <IslamicPattern tone="gold" opacity={0.12} className="z-0" />
              <span className="relative z-10">{t("viewTrialStatus")}</span>
            </Link>
          </div>
        </div>
      )}

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
              className="relative isolate mt-4 inline-block overflow-hidden rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              <IslamicPattern tone="gold" opacity={0.12} className="z-0" />
              <span className="relative z-10">{t("browseCourses")}</span>
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
