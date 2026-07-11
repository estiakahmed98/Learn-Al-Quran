import { prisma } from "@/lib/prisma";
import CoursesTable from "@/components/admin/CoursesTable";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({ orderBy: { sortOrder: "asc" } }).catch(() => []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">Courses</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage the courses shown on your website. Changes are saved directly to the database.
      </p>

      <div className="mt-6">
        <CoursesTable initialCourses={JSON.parse(JSON.stringify(courses))} />
      </div>
    </div>
  );
}
