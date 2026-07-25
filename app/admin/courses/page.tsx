import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import CoursesTable from "@/components/admin/CoursesTable";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage() {
  const auth = await getAuthSession();
  const token = auth?.token;

  const [coursesResult, teachersResult, enrollmentsResult] = await Promise.all([
    api.courses.list({ perPage: 100 }, token).catch(() => ({ data: [] as any[] })),
    token
      ? api.users.adminList(token, { perPage: 200 }).catch(() => ({ data: [] as any[] }))
      : Promise.resolve({ data: [] as any[] }),
    token
      ? api.enrollments.adminList(token, { perPage: 500 }).catch(() => ({ data: [] as any[] }))
      : Promise.resolve({ data: [] as any[] })
  ]);

  // The Laravel course-list endpoint doesn't eager-load an enrollment count,
  // so we tally it client-side from the admin enrollments list as a
  // pragmatic fallback (fine at current data volumes, not ideal at scale).
  const enrollmentCounts = new Map<string, number>();
  for (const enrollment of enrollmentsResult.data) {
    const courseId = enrollment.course?.id ?? enrollment.courseId;
    if (!courseId) continue;
    enrollmentCounts.set(courseId, (enrollmentCounts.get(courseId) ?? 0) + 1);
  }

  const courses = coursesResult.data.map((course: any) => ({
    ...course,
    _count: { enrollments: enrollmentCounts.get(course.id) ?? 0 }
  }));

  const teachers = teachersResult.data
    .filter((user: any) => user.role === "TEACHER")
    .map((user: any) => ({ id: user.id, name: user.name }));

  return (
    <div>
      <div className="mt-6">
        <CoursesTable initialCourses={courses} teachers={teachers} />
      </div>
    </div>
  );
}
