import { getAuthSession } from "@/lib/session";
import { api } from "@/lib/api-client";
import StudentsTable from "@/components/admin/StudentsTable";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const auth = await getAuthSession();
  const [usersResult, trialsResult] = auth
    ? await Promise.all([
        api.users.adminList(auth.token, { perPage: 200 }).catch(() => ({ data: [] })),
        api.trialApplications.adminList(auth.token, { perPage: 200 }).catch(() => ({ data: [] }))
      ])
    : [{ data: [] }, { data: [] }];

  const students = usersResult.data
    .filter((u) => u.role === "STUDENT")
    .map((u) => ({
      id: u.id,
      recordType: "USER" as const,
      userId: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone ?? null,
      whatsapp: u.whatsapp ?? null,
      imageUrl: u.imageUrl ?? null,
      studentStatus: u.studentStatus,
      isActive: u.isActive,
      createdAt: (u as any).createdAt,
      _count: { enrollments: u.enrollmentsCount ?? 0 }
    }));

  const trialApplications = trialsResult.data.map((application: any) => ({
    id: application.id,
    recordType: "TRIAL_APPLICATION" as const,
    userId: application.user?.id ?? null,
    name: application.studentName || application.user?.name || "Unknown applicant",
    email: application.email || application.user?.email || "",
    phone: application.mobileNumber || application.user?.phone || null,
    whatsapp: application.whatsappNumber || application.user?.whatsapp || null,
    imageUrl: application.user?.imageUrl ?? null,
    studentStatus: "FREE_TRIAL" as const,
    applicationStatus: application.status,
    courseTitle: application.course?.title ?? null,
    isActive: application.status !== "CANCELLED",
    createdAt: application.createdAt,
    _count: { enrollments: 0 }
  }));

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-primary-dark">Student Management</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage student accounts, enrollments, payments and results. Click a student for full control.
      </p>

      <div className="mt-6">
        <StudentsTable
          initialStudents={JSON.parse(JSON.stringify([...trialApplications, ...students]))}
        />
      </div>
    </div>
  );
}
