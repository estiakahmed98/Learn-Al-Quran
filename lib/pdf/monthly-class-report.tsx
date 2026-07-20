import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica" },
  title: { fontSize: 16, fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#555", marginBottom: 16 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  summaryBox: { border: "1pt solid #ddd", borderRadius: 4, padding: 8, width: "31%" },
  summaryLabel: { fontSize: 8, color: "#777", textTransform: "uppercase" },
  summaryValue: { fontSize: 14, fontWeight: 700, marginTop: 2 },
  courseSection: { marginBottom: 14 },
  courseTitle: { fontSize: 12, fontWeight: 700, marginBottom: 6, backgroundColor: "#f3f4f6", padding: 4 },
  tableHeader: { flexDirection: "row", borderBottom: "1pt solid #333", paddingBottom: 4, marginBottom: 4 },
  tableRow: { flexDirection: "row", paddingVertical: 3, borderBottom: "0.5pt solid #eee" },
  colDate: { width: "20%" },
  colTime: { width: "25%" },
  colStatus: { width: "17%" },
  colAttended: { width: "13%" },
  colNotes: { width: "25%" }
});

export interface MonthlyReportRow {
  courseTitle: string;
  classDate: Date;
  startTime: string;
  endTime: string | null;
  completed: boolean;
  attended: number | null;
  notes: string | null;
}

export function MonthlyClassReportDocument({
  teacherName,
  month,
  year,
  rows
}: {
  teacherName: string;
  month: number;
  year: number;
  rows: MonthlyReportRow[];
}) {
  const monthLabel = new Date(year, month - 1, 1).toLocaleString("en-US", { month: "long" });
  const totalClasses = rows.length;
  const completedClasses = rows.filter((row) => row.completed).length;
  const courseNames = Array.from(new Set(rows.map((row) => row.courseTitle)));

  const byCourse = courseNames.map((courseTitle) => ({
    courseTitle,
    rows: rows
      .filter((row) => row.courseTitle === courseTitle)
      .sort((a, b) => a.classDate.getTime() - b.classDate.getTime())
  }));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Monthly Class Report</Text>
        <Text style={styles.subtitle}>
          {teacherName} — {monthLabel} {year}
        </Text>

        <View style={styles.summaryRow}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Total Classes</Text>
            <Text style={styles.summaryValue}>{totalClasses}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Completed</Text>
            <Text style={styles.summaryValue}>{completedClasses}</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Courses Covered</Text>
            <Text style={styles.summaryValue}>{courseNames.length}</Text>
          </View>
        </View>

        {byCourse.map((group) => (
          <View key={group.courseTitle} style={styles.courseSection} wrap={false}>
            <Text style={styles.courseTitle}>
              {group.courseTitle} — {group.rows.length} class{group.rows.length === 1 ? "" : "es"}
            </Text>
            <View style={styles.tableHeader}>
              <Text style={styles.colDate}>Date</Text>
              <Text style={styles.colTime}>Time</Text>
              <Text style={styles.colStatus}>Status</Text>
              <Text style={styles.colAttended}>Attended</Text>
              <Text style={styles.colNotes}>Notes</Text>
            </View>
            {group.rows.map((row, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.colDate}>{row.classDate.toLocaleDateString()}</Text>
                <Text style={styles.colTime}>
                  {row.startTime}
                  {row.endTime ? ` - ${row.endTime}` : ""}
                </Text>
                <Text style={styles.colStatus}>{row.completed ? "Completed" : "Incomplete"}</Text>
                <Text style={styles.colAttended}>{row.attended ?? "—"}</Text>
                <Text style={styles.colNotes}>{row.notes || "—"}</Text>
              </View>
            ))}
          </View>
        ))}

        {rows.length === 0 && <Text>No classes recorded for this month.</Text>}
      </Page>
    </Document>
  );
}

export async function renderMonthlyClassReportPdf(props: {
  teacherName: string;
  month: number;
  year: number;
  rows: MonthlyReportRow[];
}) {
  return renderToBuffer(<MonthlyClassReportDocument {...props} />);
}
