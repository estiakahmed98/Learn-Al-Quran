import type { Metadata } from "next";
import BooksClient from "./BooksClient";
import { buildAlternates, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site-config";
import JsonLd from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Islamic & Quran Learning Books | Learn Al Quran Online BD",
  description:
    "Browse selected Quran learning books, Tajweed guides and Islamic study materials for every stage of learning.",
  alternates: buildAlternates("/books")
};

export default function BooksPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Books", url: `${siteUrl}/books` }
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <BooksClient />
    </>
  );
}
