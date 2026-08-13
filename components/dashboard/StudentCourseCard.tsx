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
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-primary/40 hover:shadow-md">
      <div className="relative h-36 w-full shrink-0 bg-cream">
        {enrollment.course.thumbnail ? (
          <img
            src={enrollment.course.thumbnail}
            alt={enrollment.course.title}
            className="h-full w-full object-contain object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gold">
            <svg
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2m0-1h.01"
              />
            </svg>
          </div>
        )}
        {!isApproved && (
          <span className="absolute left-2 top-2 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
            🔒 {enrollment.paymentStatus === "REJECTED" ? "Rejected" : "Pending approval"}
          </span>
        )}
        <span
          className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            enrollmentStatusStyles[enrollment.enrollmentStatus] || "bg-gray-100 text-gray-700"
          }`}
        >
          {enrollment.enrollmentStatus}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-heading text-base font-bold text-primary-dark">
          {enrollment.course.title}
        </h3>
        <p className="mt-0.5 text-xs text-gray-400">
          {labels.enrolled}: {new Date(enrollment.createdAt).toLocaleDateString("en-GB")}
        </p>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
          <span>{enrollment.course.duration || "—"}</span>
          <span
            className={`rounded-full px-2 py-0.5 font-semibold ${
              paymentStatusStyles[enrollment.paymentStatus] || "bg-gray-100 text-gray-700"
            }`}
          >
            💳 {enrollment.paymentStatus}
          </span>
        </div>
        {enrollment.resultCount > 0 && (
          <p className="mt-1 text-xs text-gray-400">
            {enrollment.resultCount} {labels.results}
          </p>
        )}

        <div className="mt-4 pt-2">
          <Link
            href={`/student/courses/${enrollment.course.id}`}
            className="block rounded-lg bg-primary px-3 py-2 text-center text-xs font-semibold text-white hover:opacity-90"
          >
            {labels.manage} →
          </Link>
        </div>
      </div>
    </div>
  );
}
