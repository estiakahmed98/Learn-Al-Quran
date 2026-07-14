import type { Metadata } from "next";
import LeadForm from "@/components/home/LeadForm";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-config";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Free Trial Class",
  description:
    "Book your free trial class with Learn Al Quran Online BD. Experience our live one-to-one Quran, Tajweed and Hifz teaching before you enroll.",
  alternates: { canonical: "/free-trial-class" }
};

export const revalidate = 3600;

interface Props {
  searchParams: { course?: string };
}

export default async function FreeTrialClassPage({ searchParams }: Props) {
  const t = await getTranslations("sitePages.freeTrial");
  const [courses, settings] = await Promise.all([
    prisma.course.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }).catch(() => []),
    getSiteSettings()
  ]);

  return (
    <div>
      <div className="mx-auto max-w-3xl px-4 pt-16 text-center lg:px-8">
        <p className="font-semibold uppercase tracking-wide text-secondary">{t("eyebrow")}</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-primary-dark">
          {t("title")}
        </h1>
        <p className="mt-4 text-gray-600">
          {t("subtitle")}
        </p>
      </div>

      <LeadForm
        courses={courses}
        defaultCourseSlug={searchParams.course}
        bkashNumber={settings.bkashNumber || ""}
        nagadNumber={settings.nagadNumber || ""}
        bankAccount={settings.bankAccount || ""}
      />
    </div>
  );
}
