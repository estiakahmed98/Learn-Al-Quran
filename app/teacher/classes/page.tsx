import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/session";
import { getCachedActiveCourses } from "@/lib/cached-data";
import ClassReportForm from "@/components/teacher/ClassReportForm";

export default async function TeacherClassesPage(
  props: {
    searchParams: Promise<{ courseId?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const auth = await getAuthSession();
  if (!auth) redirect("/auth/login?callbackUrl=/teacher/classes");
  const teacherId = auth.session.user.id;

  const allCourses = await getCachedActiveCourses();
  const courses = allCourses
    .filter((course: any) => course.instructorId === teacherId)
    .sort((a: any, b: any) => a.title.localeCompare(b.title));

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
