import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { getLocale } from "next-intl/server";
import EnrollmentForm from "@/components/enrollment/EnrollmentForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Enroll in a Course",
  description: "Create your student account, select a Quran course and submit your payment details.",
  alternates: { canonical: "/enroll" }
};

export const dynamic = "force-dynamic";

export default async function EnrollPage({ searchParams }: { searchParams: { course?: string } }) {
  const [session, locale, courses, settings] = await Promise.all([
    getServerSession(authOptions),
    getLocale(),
    prisma.course.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, slug: true, title: true, titleBn: true, fee: true }
    }),
    getSiteSettings()
  ]);
  const student = session?.user?.id && session.user.role === "STUDENT"
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true, email: true, phone: true, whatsapp: true }
      })
    : null;

  return (
    <EnrollmentForm
      courses={courses}
      defaultCourseSlug={searchParams.course}
      student={student}
      isBangla={locale === "bn"}
      paymentInfo={{
        bkashNumber: settings.bkashNumber || "",
        nagadNumber: settings.nagadNumber || "",
        rocketNumber: settings.rocketNumber || "",
        bankAccount: settings.bankAccount || "",
        westernUnionInfo: settings.westernUnionInfo || ""
      }}
    />
  );
}
