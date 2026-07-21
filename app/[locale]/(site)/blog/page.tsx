import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import AllBlogs from "@/components/admin/blog/AllBlogs";
import { ArrowRight, BookOpenText, Mail, Newspaper, Search } from "lucide-react";
import { buildAlternates, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site-config";
import JsonLd from "@/components/shared/JsonLd";
import IslamicPattern from "@/components/shared/IslamicPattern";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("sitePages.blog");

  return {
    title: `${t("title")} | Learn Al Quran Online BD`,
    description: t("heroSubtitle"),
    alternates: buildAlternates("/blog")
  };
}

export default async function BlogsPage() {
  const t = await getTranslations("sitePages.blog");

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: t("eyebrow"), url: `${siteUrl}/blog` }
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-primary/[0.045] via-white to-white">
      <JsonLd data={breadcrumbJsonLd} />

      {/* Compact Page Header */}
      <section className="relative overflow-hidden border-b border-gold/10">
        <IslamicPattern tone="green" opacity={0.045} className="absolute inset-0" />

        {/* Small decorative shapes */}
        <div className="pointer-events-none absolute -left-12 top-1/2 hidden h-32 w-32 -translate-y-1/2 rounded-full border-[12px] border-primary-dark/[0.03] lg:block" />
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full border-[10px] border-gold/[0.04]" />

        <div className="relative mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 lg:py-9">
          <nav className="flex items-center justify-center gap-2 text-xs text-gray-400 sm:text-sm">
            <Link href="/" className="hover:text-gold-dark">
              {t("breadcrumbHome")}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-primary-dark">{t("eyebrow")}</span>
          </nav>

          <div className="mx-auto mt-3 max-w-2xl text-center">
            <div className="mb-2 flex items-center justify-center gap-1.5">
              <span className="text-[10px] text-gold/30">✦</span>
              <span className="text-xs text-gold/50">✦</span>
              <span className="text-sm text-gold">✦</span>
              <span className="text-xs text-gold/50">✦</span>
              <span className="text-[10px] text-gold/30">✦</span>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/20 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-dark shadow-sm backdrop-blur-sm sm:text-xs">
              <Newspaper className="h-3.5 w-3.5 text-gold" />
              {t("eyebrow")}
            </span>

            <h1 className="mt-3 font-heading text-2xl font-bold leading-tight text-primary-dark sm:text-3xl lg:text-4xl">
              {t("title")}
            </h1>

            <div className="mx-auto mt-3 flex items-center justify-center gap-2">
              <span className="h-px w-7 bg-gold/30" />
              <span className="h-1 w-3 rounded-full bg-gold" />
              <span className="h-px w-7 bg-gold/30" />
            </div>

            <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-gray-600 sm:text-sm">
              {t("heroSubtitle")}
            </p>

            <form
              action="/blogs"
              method="GET"
              className="mx-auto mt-6 flex max-w-2xl flex-col gap-3 rounded-2xl border border-gold/15 bg-white/90 p-2 shadow-lg shadow-primary/5 backdrop-blur-md sm:flex-row"
            >
              <label className="relative flex-1">
                <span className="sr-only">{t("searchPlaceholder")}</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  type="search"
                  name="q"
                  placeholder={t("searchPlaceholder")}
                  className="h-12 w-full rounded-xl border border-transparent bg-gray-50/80 pl-12 pr-4 text-sm text-primary-dark outline-none transition focus:border-gold/50 focus:bg-white focus:ring-4 focus:ring-gold/10"
                />
              </label>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                {t("search")}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Decorative background circles */}
      <div className="pointer-events-none absolute -left-32 top-40 hidden h-[26rem] w-[26rem] rounded-full border-[30px] border-primary-dark/[0.035] lg:block" />
      <div className="pointer-events-none absolute -right-24 top-20 h-64 w-64 rounded-full border-[22px] border-gold/[0.045]" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full border-[18px] border-gold/[0.035]" />

      {/* Blog listing */}
      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
              <BookOpenText className="h-4 w-4" />
              {t("latestResources")}
            </div>

            <h2 className="mt-2 font-heading text-2xl font-bold text-primary-dark sm:text-3xl">
              {t("listingTitle")}
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              {t("listingSubtitle")}
            </p>
          </div>
        </div>

        <AllBlogs />
      </section>

      {/* Newsletter CTA */}
      <section className="relative mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-primary-dark px-6 py-10 shadow-2xl shadow-primary/20 sm:rounded-3xl sm:px-10 sm:py-12 lg:px-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  transparent 0,
                  transparent 22px,
                  rgba(255,255,255,0.8) 22px,
                  rgba(255,255,255,0.8) 23px
                ),
                repeating-linear-gradient(
                  -45deg,
                  transparent 0,
                  transparent 22px,
                  rgba(255,255,255,0.8) 22px,
                  rgba(255,255,255,0.8) 23px
                )
              `,
            }}
          />

          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-[28px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-gold/10 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_minmax(320px,460px)]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-gold backdrop-blur">
                <Mail className="h-4 w-4" />
                {t("newsletter")}
              </div>

              <h2 className="mt-4 max-w-2xl font-heading text-2xl font-bold text-white sm:text-3xl">
                {t("newsletterTitle")}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                {t("newsletterBody")}
              </p>
            </div>

            <form className="rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-md">
              <label className="sr-only" htmlFor="newsletter-email">
                {t("newsletterPlaceholder")}
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder={t("newsletterPlaceholder")}
                  className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/55 focus:border-gold/70 focus:ring-4 focus:ring-gold/10"
                />

                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gold px-5 text-sm font-semibold text-primary-dark transition hover:-translate-y-0.5 hover:bg-white"
                >
                  {t("subscribe")}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
