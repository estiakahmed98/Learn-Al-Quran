import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import MonthlyPdfDownload from "@/components/teacher/MonthlyPdfDownload";

export default async function TeacherReportsPage() {
  const session = await getServerSession(authOptions);
  const teacherId = session!.user.id;

  const reports = await prisma.classReport.findMany({
    where: { teacherId },
    include: { course: { select: { title: true } } },
    orderBy: { classDate: "desc" },
    take: 100
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-primary-dark">My Reports</h1>
          <p className="mt-1 text-sm text-gray-500">History of your submitted class reports.</p>
        </div>
        <MonthlyPdfDownload teacherId={teacherId} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-4 py-3">{new Date(report.classDate).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-medium text-primary-dark">{report.course.title}</td>
                <td className="px-4 py-3">{report.startTime}{report.endTime ? ` - ${report.endTime}` : ""}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      report.completed ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {report.completed ? "Completed" : "Incomplete"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{report.notes || "—"}</td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  No class reports submitted yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
