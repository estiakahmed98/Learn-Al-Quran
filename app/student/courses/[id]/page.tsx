import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import CourseWorkspace from "@/components/student/CourseWorkspace";

export const dynamic = "force-dynamic";

export default async function StudentCourseDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await getAuthSession();
  if (!auth) redirect(`/auth/login?callbackUrl=/student/courses/${params.id}`);

  const enrollments = await api.enrollments.my(auth.token);
  const enrollment = enrollments.find((e: any) => e.courseId === params.id || e.course?.id === params.id);

  if (!enrollment) notFound();

  const fullCourse = await api.courses.get(enrollment.course.id).catch(() => null);
  const classSchedules = (fullCourse?.classSchedules ?? [])
    .filter((cs: any) => cs.isActive)
    .sort((a: any, b: any) => a.dayOfWeek - b.dayOfWeek);
  const notes = (fullCourse?.notes ?? [])
    .filter((n: any) => n.isPublished)
    .sort((a: any, b: any) => (a.createdAt < b.createdAt ? 1 : -1));

  const isApproved =
    enrollment.paymentStatus === "VERIFIED" &&
    ["APPROVED", "ACTIVE", "COMPLETED"].includes(enrollment.enrollmentStatus);

  return (
    <div>
      <Link href="/student/courses" className="text-sm font-semibold text-primary hover:underline">
        &larr; Back to My Courses
      </Link>

      <div className="mt-2">
        <CourseWorkspace
          data={{
            course: {
              slug: enrollment.course.slug,
              title: enrollment.course.title,
              duration: enrollment.course.duration,
              description: enrollment.course.description
            },
            enrollment: {
              paymentMethod: enrollment.paymentMethod,
              transactionId: enrollment.transactionId,
              paymentAmount: enrollment.paymentAmount,
              paymentStatus: enrollment.paymentStatus,
              enrollmentStatus: enrollment.enrollmentStatus,
              adminNote: enrollment.adminNote,
              createdAt: enrollment.createdAt
            },
            classSchedules: classSchedules.map((cs: any) => ({
              id: cs.id,
              dayOfWeek: cs.dayOfWeek,
              startTime: cs.startTime,
              endTime: cs.endTime,
              teacherName: cs.teacherName,
              meetingLink: cs.meetingLink,
              note: cs.note
            })),
            notes: notes.map((n: any) => ({
              id: n.id,
              title: n.title,
              content: n.content,
              fileUrl: n.fileUrl,
              createdAt: n.createdAt
            })),
            isApproved
          }}
        />
      </div>
    </div>
  );
}
