import Link from "next/link";

export interface StudentEnrollmentSummary {
  id: string;
  paymentStatus: string;
  enrollmentStatus: string;
  createdAt: string;
  resultCount: number;
  course: {
    id: string;
    title: string;
    slug: string;
    duration: string | null;
    thumbnail: string | null;
  };
}

const enrollmentStatusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  ACTIVE: "bg-green-100 text-green-800",
  COMPLETED: "bg-primary/10 text-primary-dark",
  CANCELLED: "bg-red-100 text-red-700"
};

const paymentStatusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-blue-100 text-blue-800",
  VERIFIED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-700"
};

export default function StudentCourseCard({
  enrollment,
  labels
}: {
  enrollment: StudentEnrollmentSummary;
  labels: { enrolled: string; results: string; manage: string };
}) {
  const isApproved =
    enrollment.paymentStatus === "VERIFIED" &&
    ["APPROVED", "ACTIVE", "COMPLETED"].includes(enrollment.enrollmentStatus);

  return (
    <Link
      href={`/student/courses/${enrollment.course.id}`}
      className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="font-heading text-base font-bold text-primary-dark">
          {enrollment.course.title}
          {!isApproved && (
            <span className="ml-2 align-middle text-xs font-semibold text-amber-600">
              🔒 {enrollment.paymentStatus === "REJECTED" ? "Rejected" : "Pending approval"}
            </span>
          )}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {labels.enrolled}: {new Date(enrollment.createdAt).toLocaleDateString("en-GB")}
          {enrollment.course.duration ? ` · ${enrollment.course.duration}` : ""}
          {enrollment.resultCount > 0 ? ` · ${enrollment.resultCount} ${labels.results}` : ""}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            enrollmentStatusStyles[enrollment.enrollmentStatus] || "bg-gray-100 text-gray-700"
          }`}
        >
          {enrollment.enrollmentStatus}
        </span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            paymentStatusStyles[enrollment.paymentStatus] || "bg-gray-100 text-gray-700"
          }`}
        >
          💳 {enrollment.paymentStatus}
        </span>
        <span className="text-xs font-semibold text-primary">{labels.manage} →</span>
      </div>
    </Link>
  );
}
