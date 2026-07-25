"use client";

import { useState } from "react";
import IslamicPattern from "@/components/shared/IslamicPattern";
import { downloadMonthlyClassReportPdf } from "@/app/teacher/reports/actions";

export default function MonthlyPdfDownload({ teacherId }: { teacherId?: string }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [downloading, setDownloading] = useState(false);

  async function download() {
    setDownloading(true);
    try {
      const base64 = await downloadMonthlyClassReportPdf(month, year);
      const byteChars = atob(base64);
      const byteNumbers = new Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
      const blob = new Blob([new Uint8Array(byteNumbers)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `class-report-${year}-${String(month).padStart(2, "0")}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
      <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm">
        {Array.from({ length: 12 }, (_, index) => index + 1).map((m) => (
          <option key={m} value={m}>
            {new Date(2000, m - 1, 1).toLocaleString("en-US", { month: "long" })}
          </option>
        ))}
      </select>
      <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm">
        {Array.from({ length: 5 }, (_, index) => now.getFullYear() - index).map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <button
        onClick={download}
        disabled={downloading}
        className="relative isolate overflow-hidden rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        <IslamicPattern tone="gold" opacity={0.14} className="z-0" />
        <span className="relative z-10">{downloading ? "Preparing..." : "Download PDF"}</span>
      </button>
    </div>
  );
}
