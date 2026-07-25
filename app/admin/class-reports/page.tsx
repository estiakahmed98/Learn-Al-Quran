import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import ClassReportsTable from "@/components/admin/ClassReportsTable";

export default async function AdminClassReportsPage() {
  const auth = await getAuthSession();
  if (!auth) redirect("/auth/login?callbackUrl=/admin/class-reports");

  const reports = await api.classReports.list(auth.token, { perPage: 200 });

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">Teacher Class Reports</h1>
      <p className="mt-1 text-sm text-gray-500">
        Daily class reports submitted by all teachers. Search or filter by teacher, course and date range. Filter by
        teacher to download their monthly PDF report.
      </p>

      <div className="mt-6">
        <ClassReportsTable
          initialReports={reports.map((report: any) => ({
            id: report.id,
            classDate: report.classDate,
            startTime: report.startTime,
            endTime: report.endTime,
            completed: report.completed,
            attended: report.attended,
            notes: report.notes,
            teacher: report.teacher,
            course: report.course
          }))}
        />
      </div>
    </div>
  );
}
