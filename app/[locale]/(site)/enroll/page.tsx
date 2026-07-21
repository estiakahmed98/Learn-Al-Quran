import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import EnrollmentForm from "@/components/enrollment/EnrollmentForm";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-config";
import { buildAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Enroll in a Course",
  description: "Select a Quran course and submit your enrollment and payment details.",
  alternates: buildAlternates("/enroll")
};

export const dynamic = "force-dynamic";

export default async function EnrollPage(props: { searchParams: Promise<{ course?: string }> }) {
  const searchParams = await props.searchParams;
  const [locale, courses, settings] = await Promise.all([
    getLocale(),
    prisma.course.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, slug: true, title: true, titleBn: true, fee: true }
    }),
    getSiteSettings()
  ]);

  return (
    <EnrollmentForm
      courses={courses}
      defaultCourseSlug={searchParams.course}
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
