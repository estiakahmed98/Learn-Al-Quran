import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import EnrollmentForm from "@/components/enrollment/EnrollmentForm";
import { getCachedActiveCourses } from "@/lib/cached-data";
import { getSiteSettings } from "@/lib/site-config";
import { publicPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  return publicPageMetadata(locale, "/enroll", {
    title: "Enroll in a Course",
    description: "Select a Quran course and submit your enrollment and payment details."
  });
}

export const dynamic = "force-dynamic";

export default async function EnrollPage(props: { searchParams: Promise<{ course?: string }> }) {
  const searchParams = await props.searchParams;
  const [locale, courses, settings] = await Promise.all([
    getLocale(),
    getCachedActiveCourses(),
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
