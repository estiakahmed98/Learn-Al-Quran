import { prisma } from "@/lib/prisma";
import CoursesTable from "@/components/admin/CoursesTable";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const [courses, teachers] = await Promise.all([
    prisma.course
      .findMany({
        include: { _count: { select: { enrollments: true } } },
        orderBy: { sortOrder: "asc" },
      })
      .catch(() => []),
    prisma.user.findMany({
      where: { role: "TEACHER", isActive: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <div>
      <div className="mt-6">
        <CoursesTable initialCourses={JSON.parse(JSON.stringify(courses))} teachers={teachers} />
      </div>
    </div>
  );
}
