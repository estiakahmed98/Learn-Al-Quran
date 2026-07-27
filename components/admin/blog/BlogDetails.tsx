// components/admin/blog/BlogDetails.tsx
"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { Calendar, User, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import RecentBlogs, { type RecentBlog } from "./RecentBlogs";
import { publicMediaUrl } from "@/lib/media-url";

export interface Blog {
  id: number;
  slug: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  date: string | Date;
  image?: string;
  ads?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/* =================== RELATED CARD =================== */
const RelatedBlogsCard = ({ t }: { t: ReturnType<typeof useTranslations> }) => (
  <div className="sticky top-6 rounded-2xl border border-[#be923c]/20 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
    {/* Header */}
    <div className="flex items-center gap-3 px-6 py-5 border-b border-[#be923c]/20 bg-[#003535]/95">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#be923c]/15">
        <BookOpen className="h-5 w-5 text-[#be923c]" />
      </div>
      <h3 className="text-base font-semibold tracking-wide text-[#be923c]">
        {t("relatedReading")}
      </h3>
    </div>

    {/* Content */}
    <div className="px-6 py-6">
      <p className="text-sm leading-relaxed text-muted-foreground">
        {t("relatedReadingBody")}
      </p>

      {/* Subtle divider */}
      <div className="mt-5 h-px w-12 bg-[#be923c]/40" />
    </div>
  </div>
);

/* =================== SUMMARY =================== */
const ProfessionalSummary = ({
  summary,
  content,
  t,
}: {
  summary: string;
  content?: string;
  t: ReturnType<typeof useTranslations>;
}) => {
  const readingTime = Math.ceil((content || summary).split(/\s+/).length / 200);

  return (
    <div className="rounded-xl border bg-card shadow-lg">
      <div className="p-6 border-b bg-muted/40 flex items-center gap-3">
        <BookOpen className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">{t("articleOverview")}</h2>
        <span className="ml-auto text-sm text-muted-foreground">
          ~ {readingTime} {t("minRead")}
        </span>
      </div>

      <div className="p-6">
        <p className="leading-relaxed text-foreground/90">{summary}</p>
      </div>
    </div>
  );
};

export default function BlogDetails({
  blog,
  recentBlogs
}: {
  blog: Blog;
  recentBlogs: RecentBlog[];
}) {
  const router = useRouter();
  const t = useTranslations("sitePages.blog");

  return (
    <div className="w-full">
      {/* ===== DESKTOP ===== */}
      <div className="hidden lg:grid grid-cols-12 gap-6">
        {/* LEFT */}
        <aside className="col-span-2 sticky top-24 pl-8 h-fit">
          {blog.ads ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={publicMediaUrl(blog.ads)} alt="" className="rounded-lg border w-full" />
          ) : (
            <div className="text-center text-muted-foreground border rounded-lg p-4">
              {t("adsNotFound")}
            </div>
          )}
        </aside>

        {/* CONTENT */}
        <main className="col-span-7">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="mb-8"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("backToJournal")}
            </Button>

            <article className="space-y-8">
              <header className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">
                  {blog.title}
                </h1>

                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {blog.author}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(blog.date), "MMMM d, yyyy")}
                  </span>
                </div>

                {blog.image && (
                  <div className="relative aspect-video rounded-xl overflow-hidden border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={publicMediaUrl(blog.image)}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </header>

              <ProfessionalSummary
                summary={blog.summary}
                content={blog.content}
                t={t}
              />

              <div
                className="prose prose-slate max-w-none
                  prose-headings:font-semibold
                  prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </article>
          </div>
        </main>

        {/* RIGHT */}
        <aside className="col-span-3 sticky top-24 space-y-6 pr-6 h-fit">
          <RelatedBlogsCard t={t} />
          <RecentBlogs blogs={recentBlogs} />
        </aside>
      </div>

      {/* ===== MOBILE ===== */}
      <div className="lg:hidden">
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("back")}
          </Button>

          <h1 className="text-3xl font-bold">{blog.title}</h1>

          <ProfessionalSummary summary={blog.summary} content={blog.content} t={t} />

          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          <RecentBlogs blogs={recentBlogs} />
        </div>
      </div>
    </div>
  );
}
