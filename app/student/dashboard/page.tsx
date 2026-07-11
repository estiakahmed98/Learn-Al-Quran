//app/student/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import SignOutButton from "@/components/admin/SignOutButton";
import StudentCourseCard from "@/components/dashboard/StudentCourseCard";

export const metadata = {
  title: "Student Dashboard",
  robots: { index: false, follow: false },
};

export default async function StudentDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login?callbackUrl=/dashboard");
  if (session.user.role === "ADMIN") redirect("/admin");

  const t = await getTranslations("dashboard");

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/auth/login");

  const enrollments = await prisma.enrollment.findMany({
    where: {
      OR: [{ userId: user.id }, ...(user.email ? [{ email: user.email }] : [])],
    },
    include: {
      course: true,
      results: { orderBy: { examDate: "desc" } },
    },
    orderBy: { createdAt: "desc" },
  });

  const dashboardLabels = {
    details: t("details"),
    payment: t("payment"),
    results: t("results"),
    duration: t("duration"),
    description: t("description"),
    paymentMethod: t("paymentMethod"),
    transactionId: t("transactionId"),
    amount: t("amount"),
    paymentStatus: t("paymentStatus"),
    noResults: t("noResults"),
    exam: t("exam"),
    marks: t("marks"),
    grade: t("grade"),
    remarks: t("remarks"),
    date: t("date"),
    viewCourse: t("viewCourse"),
    enrolled: t("enrolled"),
  };

  const activeCount = enrollments.filter(
    (e) => e.enrollmentStatus === "ACTIVE",
  ).length;
  const pendingCount = enrollments.filter(
    (e) => e.enrollmentStatus === "PENDING",
  ).length;
  const completedCount = enrollments.filter(
    (e) => e.enrollmentStatus === "COMPLETED",
  ).length;

  return (
    <div className="min-h-screen bg-cream py-10">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        {/* Profile card */}
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-gold/20 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            {user.imageURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageURL}
                alt={user.name}
                className="h-16 w-16 rounded-full border-2 border-gold object-cover"
              />
            ) : (
              <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-primary text-2xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            )}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                {t("title")}
              </p>
              <h1 className="font-heading text-xl font-bold text-primary-dark">
                {t("greeting", { name: user.name })}
              </h1>
              <p className="text-sm text-gray-500">
                {user.email}
                {user.phone ? ` · ${user.phone}` : ""}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-40">
            <SignOutButton />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            {
              label: t("totalEnrollments"),
              value: enrollments.length,
              icon: "📚",
            },
            { label: t("activeCourses"), value: activeCount, icon: "🟢" },
            { label: t("pending"), value: pendingCount, icon: "⏳" },
            { label: t("completed"), value: completedCount, icon: "🎓" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-gold/20 bg-white p-5 shadow-sm"
            >
              <p className="text-2xl">{s.icon}</p>
              <p className="mt-2 font-heading text-2xl font-bold text-primary-dark">
                {s.value}
              </p>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Enrollments */}
        <div className="mt-8">
          <h2 className="font-heading text-lg font-bold text-primary-dark">
            {t("myCourses")}
          </h2>

          {enrollments.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-gold/20 bg-white p-10 text-center shadow-sm">
              <p className="text-3xl">📖</p>
              <p className="mt-3 font-semibold text-gray-700">
                {t("noCourses")}
              </p>
              <Link
                href="/courses"
                className="mt-4 inline-block rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                {t("browseCourses")}
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {enrollments.map((e) => (
                <StudentCourseCard
                  key={e.id}
                  labels={dashboardLabels}
                  enrollment={{
                    id: e.id,
                    paymentMethod: e.paymentMethod,
                    transactionId: e.transactionId,
                    paymentAmount: e.paymentAmount,
                    paymentStatus: e.paymentStatus,
                    enrollmentStatus: e.enrollmentStatus,
                    adminNote: e.adminNote,
                    createdAt: e.createdAt.toISOString(),
                    results: e.results.map((r) => ({
                      id: r.id,
                      examName: r.examName,
                      marks: r.marks,
                      grade: r.grade,
                      remarks: r.remarks,
                      examDate: r.examDate.toISOString(),
                    })),
                    course: {
                      title: e.course.title,
                      slug: e.course.slug,
                      duration: e.course.duration,
                      description: e.course.description,
                      thumbnail: e.course.thumbnail,
                    },
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
