import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BooksClient from "./BooksClient";
import { buildAlternates, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site-config";
import JsonLd from "@/components/shared/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("sitePages.books");

  return {
    title: `${t("title")} | Learn Al Quran Online BD`,
    description: t("subtitle"),
    alternates: buildAlternates("/books")
  };
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
