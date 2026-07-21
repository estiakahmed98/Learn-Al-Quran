import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ClassReportForm from "@/components/teacher/ClassReportForm";

export default async function TeacherClassesPage(
  props: {
    searchParams: Promise<{ courseId?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authOptions);
  const teacherId = session!.user.id;

  const courses = await prisma.course.findMany({
    where: { instructorId: teacherId, isActive: true },
    orderBy: { title: "asc" },
    select: { id: true, title: true, titleBn: true }
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">Submit Class Report</h1>
      <p className="mt-1 text-sm text-gray-500">
        Select the course and fill in today&apos;s class details. If you conducted classes for multiple courses today,
        submit a separate report for each.
      </p>

      <div className="mt-6 max-w-xl">
        <ClassReportForm courses={courses} defaultCourseId={searchParams.courseId} />
      </div>
    </div>
  );
}
