import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import Teachers from "@/components/home/Teachers";
import { buildAlternates } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about our mission, teaching methodology, and certified Quran teachers.",
  alternates: buildAlternates("/about-us")
};

export const revalidate = 3600;

export default async function AboutUsPage() {
  const [t, teachers] = await Promise.all([
    getTranslations("sitePages.about"),
    prisma.user
      .findMany({
        where: { role: "TEACHER", isActive: true },
        select: { id: true, name: true, designation: true, description: true, imageURL: true },
        orderBy: { name: "asc" }
      })
      .catch(() => [])
  ]);

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <p className="text-center font-semibold uppercase tracking-wide text-secondary">
          {t("eyebrow")}
        </p>
        <h1 className="mt-2 text-center font-heading text-3xl font-bold text-primary-dark">
          {t("title")}
        </h1>
        <div className="mt-8 space-y-4 text-gray-700">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>
      </div>

      <Teachers teachers={teachers} />
    </div>
  );
}
