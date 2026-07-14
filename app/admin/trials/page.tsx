import { prisma } from "@/lib/prisma";
import TrialApplicationsManager from "@/components/admin/TrialApplicationsManager";

export const dynamic = "force-dynamic";

export default async function AdminTrialsPage() {
  const [applications, courses] = await Promise.all([
    prisma.trialApplication.findMany({
      where: { user: { role: "STUDENT" } },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, studentStatus: true } },
        course: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: "desc" }
    }).catch(() => []),
    prisma.course.findMany({ where: { isActive: true }, select: { id: true, title: true }, orderBy: { sortOrder: "asc" } }).catch(() => [])
  ]);
  return <div><h1 className="font-heading text-2xl font-bold text-primary-dark">Free Trial Management</h1><p className="mt-1 text-sm text-gray-500">View and filter students who signed up for a free trial class.</p><div className="mt-6"><TrialApplicationsManager initialApplications={JSON.parse(JSON.stringify(applications))} courses={courses} /></div></div>;
}
