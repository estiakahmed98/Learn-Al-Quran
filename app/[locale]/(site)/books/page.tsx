import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BooksClient from "./BooksClient";
import { buildBreadcrumbJsonLd, publicPageMetadata } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import { siteUrl } from "@/lib/site-config";
import JsonLd from "@/components/shared/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("sitePages.books");

  return publicPageMetadata(locale, "/books", {
    title: `${t("title")} | Learn Al Quran Online BD`,
    description: t("subtitle")
  });
}

export default async function BooksPage() {
  const t = await getTranslations("sitePages.books");

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: t("eyebrow"), url: `${siteUrl}/books` }
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <BooksClient />
    </>
  );
}
