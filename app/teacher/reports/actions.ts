"use server";

import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import {
  renderMonthlyClassReportPdf,
  renderAllTeachersClassReportPdf,
  type MonthlyReportRow
} from "@/lib/pdf/monthly-class-report";

export async function downloadMonthlyClassReportPdf(month: number, year: number) {
  const auth = await getAuthSession();
  if (!auth) throw new Error("Unauthorized");

  const reports = await api.classReports.list(auth.token);
  const filtered = reports.filter((r: any) => {
    const date = new Date(r.classDate);
    return date.getMonth() + 1 === month && date.getFullYear() === year;
  });

  const rows: MonthlyReportRow[] = filtered.map((r: any) => ({
    teacherName: r.teacher?.name ?? "",
    courseTitle: r.course?.title ?? "",
    classDate: new Date(r.classDate),
    startTime: r.startTime,
    endTime: r.endTime,
    completed: r.completed,
    attended: r.attended,
    notes: r.notes
  }));

  const isAdmin = auth.session.user.role === "ADMIN";
  const buffer = isAdmin
    ? await renderAllTeachersClassReportPdf({ month, year, rows })
    : await renderMonthlyClassReportPdf({ teacherName: rows[0]?.teacherName ?? auth.session.user.name ?? "", month, year, rows });

  return Buffer.from(buffer).toString("base64");
}
