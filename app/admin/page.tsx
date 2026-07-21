import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

const paymentStatusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  PAID: "bg-sky-50 text-sky-700",
  VERIFIED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700"
};

const trialStatusStyles: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  GROUP_ASSIGNED: "bg-sky-50 text-sky-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700"
};

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    courseCount,
    activeCourseCount,
    enrollmentCount,
    enrollmentsThisMonth,
    enrollmentsLastMonth,
    pendingPayments,
    paidPayments,
    verifiedPayments,
    rejectedPayments,
    studentCount,
    teacherCount,
    activeTeacherCount,
    trialPending,
    trialTotal,
    blogCount,
    subscriberCount,
    recentEnrollments,
    recentTrials,
    upcomingClasses
  ] = await Promise.all([
    prisma.course.count().catch(() => 0),
    prisma.course.count({ where: { isActive: true } }).catch(() => 0),
    prisma.enrollment.count().catch(() => 0),
    prisma.enrollment.count({ where: { createdAt: { gte: startOfMonth } } }).catch(() => 0),
    prisma.enrollment
      .count({ where: { createdAt: { gte: startOfLastMonth, lt: startOfMonth } } })
      .catch(() => 0),
    prisma.enrollment.count({ where: { paymentStatus: "PENDING" } }).catch(() => 0),
    prisma.enrollment.count({ where: { paymentStatus: "PAID" } }).catch(() => 0),
    prisma.enrollment.count({ where: { paymentStatus: "VERIFIED" } }).catch(() => 0),
    prisma.enrollment.count({ where: { paymentStatus: "REJECTED" } }).catch(() => 0),
    prisma.user.count({ where: { role: "STUDENT" } }).catch(() => 0),
    prisma.user.count({ where: { role: "TEACHER" } }).catch(() => 0),
    prisma.user.count({ where: { role: "TEACHER", isActive: true } }).catch(() => 0),
    prisma.trialApplication.count({ where: { status: "PENDING" } }).catch(() => 0),
    prisma.trialApplication.count().catch(() => 0),
    prisma.blog.count().catch(() => 0),
    prisma.newsletterSubscriber.count({ where: { status: "subscribed" } }).catch(() => 0),
    prisma.enrollment
      .findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { course: { select: { title: true } } }
      })
      .catch(() => []),
    prisma.trialApplication
      .findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { course: { select: { title: true } } }
      })
      .catch(() => []),
    prisma.classReport
      .count({ where: { classDate: { gte: now }, completed: false } })
      .catch(() => 0)
  ]);

  const enrollmentTrend =
    enrollmentsLastMonth === 0
      ? enrollmentsThisMonth > 0
        ? 100
        : 0
      : Math.round(((enrollmentsThisMonth - enrollmentsLastMonth) / enrollmentsLastMonth) * 100);

  const kpis = [
    {
      label: "Active Courses",
      value: activeCourseCount,
      sub: `${courseCount} total`,
      icon: "📚",
      accent: "from-primary/10 to-primary/5 text-primary-dark"
    },
    {
      label: "Total Enrollments",
      value: enrollmentCount,
      sub: `${enrollmentsThisMonth} this month`,
      icon: "📝",
      accent: "from-sky-500/10 to-sky-500/5 text-sky-700",
      trend: enrollmentTrend
    },
    {
      label: "Pending Payments",
      value: pendingPayments,
      sub: "awaiting review",
      icon: "⏳",
      accent: "from-amber-500/10 to-amber-500/5 text-amber-700"
    },
    {
      label: "Verified Payments",
      value: verifiedPayments,
      sub: "confirmed",
      icon: "✅",
      accent: "from-green-500/10 to-green-500/5 text-green-700"
    },
    {
      label: "Students",
      value: studentCount,
      sub: "enrolled accounts",
      icon: "🎓",
      accent: "from-violet-500/10 to-violet-500/5 text-violet-700"
    },
    {
      label: "Teachers",
      value: teacherCount,
      sub: `${activeTeacherCount} active`,
      icon: "👨‍🏫",
      accent: "from-teal-500/10 to-teal-500/5 text-teal-700"
    },
    {
      label: "Trial Applications",
      value: trialTotal,
      sub: `${trialPending} pending`,
      icon: "🆓",
      accent: "from-rose-500/10 to-rose-500/5 text-rose-700"
    },
    {
      label: "Newsletter Subscribers",
      value: subscriberCount,
      sub: `${blogCount} blog posts published`,
      icon: "📧",
      accent: "from-fuchsia-500/10 to-fuchsia-500/5 text-fuchsia-700"
    }
  ];

  const quickLinks = [
    { href: "/admin/payments", label: "Payments & Approvals", icon: "💳" },
    { href: "/admin/courses", label: "Manage Courses", icon: "📚" },
    { href: "/admin/users", label: "Users Management", icon: "👥" },
    { href: "/admin/students", label: "Student Management", icon: "🎓" },
    { href: "/admin/class-reports", label: "Class Reports", icon: "🗓️" },
    { href: "/admin/blog", label: "Blog", icon: "✍️" },
    { href: "/admin/newsletter", label: "Newsletter", icon: "📧" },
    { href: "/admin/settings", label: "Site Settings", icon: "⚙️" }
  ];

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary-dark">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          A full overview of your madrasa's activity — enrollments, payments, teachers and students at a glance.
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className={`rounded-2xl border border-gray-100 bg-gradient-to-br ${kpi.accent} p-5 shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <span className="text-2xl">{kpi.icon}</span>
              {typeof kpi.trend === "number" && kpi.trend !== 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    kpi.trend > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {kpi.trend > 0 ? "▲" : "▼"} {Math.abs(kpi.trend)}%
                </span>
              )}
            </div>
            <p className="mt-3 font-heading text-2xl font-bold text-gray-900">{kpi.value.toLocaleString()}</p>
            <p className="text-sm font-medium text-gray-700">{kpi.label}</p>
            <p className="mt-0.5 text-xs text-gray-500">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Payments breakdown + quick links */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="font-heading text-base font-bold text-primary-dark">Payment Status Breakdown</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Pending", value: pendingPayments, style: paymentStatusStyles.PENDING },
              { label: "Paid", value: paidPayments, style: paymentStatusStyles.PAID },
              { label: "Verified", value: verifiedPayments, style: paymentStatusStyles.VERIFIED },
              { label: "Rejected", value: rejectedPayments, style: paymentStatusStyles.REJECTED }
            ].map((row) => (
              <div key={row.label} className={`rounded-xl p-4 text-center ${row.style}`}>
                <p className="text-2xl font-bold">{row.value}</p>
                <p className="text-xs font-semibold uppercase tracking-wide">{row.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
            <span>Upcoming classes not yet marked complete</span>
            <span className="font-bold text-primary-dark">{upcomingClasses}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading text-base font-bold text-primary-dark">Quick Actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex flex-col items-start gap-1 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary-dark"
              >
                <span className="text-lg">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-heading text-base font-bold text-primary-dark">Recent Enrollments</h2>
            <Link href="/admin/payments" className="text-xs font-semibold text-primary hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentEnrollments.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-gray-400">No enrollments yet.</p>
            ) : (
              recentEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center justify-between gap-3 px-6 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">{enrollment.studentName}</p>
                    <p className="truncate text-xs text-gray-500">
                      {enrollment.course.title} · {formatDate(enrollment.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      paymentStatusStyles[enrollment.paymentStatus] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {enrollment.paymentStatus}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="font-heading text-base font-bold text-primary-dark">Recent Trial Applications</h2>
            <span className="text-xs font-semibold text-gray-400">{trialTotal} total</span>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTrials.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-gray-400">No trial applications yet.</p>
            ) : (
              recentTrials.map((trial) => (
                <div key={trial.id} className="flex items-center justify-between gap-3 px-6 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {trial.studentName || "Unnamed"}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {trial.course.title} · {formatDate(trial.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      trialStatusStyles[trial.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {trial.status.replace("_", " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
