import { prisma } from "@/lib/prisma";
import CoursesTable from "@/components/admin/CoursesTable";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const courses = await prisma.course
    .findMany({
      include: { _count: { select: { enrollments: true } } },
      orderBy: { sortOrder: "asc" },
    })
    .catch(() => []);

  return (
    <div>
      <div className="mt-6">
        <CoursesTable initialCourses={JSON.parse(JSON.stringify(courses))} />
      </div>
    </div>
  );
}
