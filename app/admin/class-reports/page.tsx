import { prisma } from "@/lib/prisma";
import ClassReportsTable from "@/components/admin/ClassReportsTable";

export default async function AdminClassReportsPage() {
  const reports = await prisma.classReport.findMany({
    include: {
      teacher: { select: { id: true, name: true } },
      course: { select: { id: true, title: true } }
    },
    orderBy: { classDate: "desc" },
    take: 200
  });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">Teacher Class Reports</h1>
      <p className="mt-1 text-sm text-gray-500">
        Daily class reports submitted by all teachers. Filter by teacher to download their monthly PDF report.
      </p>

      <div className="mt-6">
        <ClassReportsTable
          initialReports={reports.map((report) => ({
            id: report.id,
            classDate: report.classDate.toISOString(),
            startTime: report.startTime,
            endTime: report.endTime,
            completed: report.completed,
            notes: report.notes,
            teacher: report.teacher,
            course: report.course
          }))}
        />
      </div>
    </div>
  );
}
