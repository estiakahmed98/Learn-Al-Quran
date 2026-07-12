import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CourseWorkspace from "@/components/student/CourseWorkspace";

export const dynamic = "force-dynamic";

export default async function StudentCourseDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect(`/auth/login?callbackUrl=/student/courses/${params.id}`);

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) redirect("/auth/login");

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      courseId: params.id,
      OR: [{ userId: user.id }, ...(user.email ? [{ email: user.email }] : [])]
    },
    include: {
      course: {
        include: {
          classSchedules: { where: { isActive: true }, orderBy: { dayOfWeek: "asc" } },
          notes: { where: { isPublished: true }, orderBy: { createdAt: "desc" } }
        }
      }
    }
  });

  if (!enrollment) notFound();

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
              createdAt: enrollment.createdAt.toISOString()
            },
            classSchedules: enrollment.course.classSchedules.map((cs) => ({
              id: cs.id,
              dayOfWeek: cs.dayOfWeek,
              startTime: cs.startTime,
              endTime: cs.endTime,
              teacherName: cs.teacherName,
              meetingLink: cs.meetingLink,
              note: cs.note
            })),
            notes: enrollment.course.notes.map((n) => ({
              id: n.id,
              title: n.title,
              content: n.content,
              fileUrl: n.fileUrl,
              createdAt: n.createdAt.toISOString()
            })),
            isApproved
          }}
        />
      </div>
    </div>
  );
}
