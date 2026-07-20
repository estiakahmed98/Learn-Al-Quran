import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import IslamicPattern from "@/components/shared/IslamicPattern";

export default async function TeacherDashboardPage() {
  const session = await getServerSession(authOptions);
  const teacherId = session!.user.id;

  const courses = await prisma.course.findMany({
    where: { instructorId: teacherId, isActive: true },
    orderBy: { title: "asc" },
    select: { id: true, title: true, titleBn: true, slug: true }
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">My Courses</h1>
      <p className="mt-1 text-sm text-gray-500">Courses assigned to you. Submit today&apos;s class report for any course below.</p>

      {courses.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          No courses are assigned to you yet. Please contact the admin.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h2 className="font-heading font-bold text-primary-dark">{course.title}</h2>
              {course.titleBn && <p className="text-sm text-gray-500">{course.titleBn}</p>}
              <Link
                href={`/teacher/classes?courseId=${course.id}`}
                className="relative isolate mt-4 inline-flex overflow-hidden rounded-full bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark"
              >
                <IslamicPattern tone="gold" opacity={0.12} className="z-0" />
                <span className="relative z-10">Submit Class Report</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
