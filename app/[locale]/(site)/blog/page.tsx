import type { Metadata } from "next";
import AllBlogs from "@/components/admin/blog/AllBlogs";
import { ArrowRight, BookOpenText, Mail, Search, Sparkles } from "lucide-react";
import { buildAlternates, buildBreadcrumbJsonLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site-config";
import JsonLd from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Blog | Learn Al Quran Online BD",
  description:
    "Read articles and guidance on Quran learning, Tajweed, Hifz, Islamic education and student stories from Learn Al Quran Online BD.",
  alternates: buildAlternates("/blog")
};

const categories = [
  "All Posts",
  "Quran Learning",
  "Tajweed",
  "Hifz",
  "Islamic Education",
  "Student Stories",
];

export default function BlogsPage() {
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: "Blog", url: `${siteUrl}/blog` }
  ]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fbfcfa]">
      <JsonLd data={breadcrumbJsonLd} />
      {/* Global decorative background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent 0,
                transparent 28px,
                rgba(212,175,55,0.55) 28px,
                rgba(212,175,55,0.55) 29px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent 0,
                transparent 28px,
                rgba(212,175,55,0.55) 28px,
                rgba(212,175,55,0.55) 29px
              )
            `,
          }}
        />

        <div className="absolute -left-36 top-44 h-96 w-96 rounded-full border-[34px] border-primary/5" />
        <div className="absolute -right-24 top-[36rem] h-72 w-72 rounded-full border-[26px] border-gold/10" />
        <div className="absolute left-1/2 top-72 h-80 w-80 -translate-x-1/2 rounded-full bg-gold/5 blur-3xl" />
      </div>

      {/* Hero */}
      <section className="relative border-b border-gold/10 bg-gradient-to-b from-primary/[0.07] via-primary/[0.035] to-transparent">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-gold/20 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark shadow-sm backdrop-blur sm:text-sm">
              <Sparkles className="h-4 w-4 text-gold" />
              Our Blog
            </div>

            <h1 className="mt-5 font-heading text-3xl font-bold leading-tight text-primary-dark sm:text-4xl lg:text-5xl">
              Insights, Guidance &amp;{" "}
              <span className="relative inline-block text-gold">
                Islamic Knowledge
                <span className="absolute -bottom-2 left-1/2 h-1 w-4/5 -translate-x-1/2 rounded-full bg-gold/20" />
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base lg:text-lg">
              Explore thoughtful articles about Quran learning, Tajweed, Hifz,
              Islamic education, character building, and spiritual growth.
            </p>

            <form
              action="/blogs"
              method="GET"
              className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 rounded-2xl border border-primary/10 bg-white/90 p-2 shadow-xl shadow-primary/5 backdrop-blur sm:flex-row"
            >
              <label className="relative flex-1">
                <span className="sr-only">Search blog articles</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  name="q"
                  placeholder="Search articles, topics, or keywords..."
                  className="h-12 w-full rounded-xl border border-transparent bg-slate-50 pl-12 pr-4 text-sm text-slate-800 outline-none transition focus:border-gold/40 focus:bg-white focus:ring-4 focus:ring-gold/10"
                />
              </label>

              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Search
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Blog listing */}
      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-gold">
              <BookOpenText className="h-4 w-4" />
              Latest Resources
            </div>

            <h2 className="mt-2 font-heading text-2xl font-bold text-primary-dark sm:text-3xl">
              Explore Our Latest Articles
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Read practical, educational, and inspiring content prepared for
              students, parents, teachers, and lifelong learners.
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
                Newsletter
              </div>

              <h2 className="mt-4 max-w-2xl font-heading text-2xl font-bold text-white sm:text-3xl">
                Receive beneficial articles directly in your inbox
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
                Subscribe for new learning resources, Islamic reminders, and
                important educational updates. No spam.
              </p>
            </div>

            <form className="rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-md">
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Enter your email address"
                  className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/55 focus:border-gold/70 focus:ring-4 focus:ring-gold/10"
                />

                <button
                  type="submit"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gold px-5 text-sm font-semibold text-primary-dark transition hover:-translate-y-0.5 hover:bg-white"
                >
                  Subscribe
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
