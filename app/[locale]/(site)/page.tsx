import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Courses from "@/components/home/Courses";
import Teachers from "@/components/home/Teachers";
import Reviews from "@/components/home/Reviews";
import ReviewForm from "@/components/home/ReviewForm";
import FAQ from "@/components/home/FAQ";
import LeadForm from "@/components/home/LeadForm";
import GoogleMapSection from "@/components/home/GoogleMapSection";
import { getLocale } from "next-intl/server";
import { api } from "@/lib/api-client";
import { getSiteSettings } from "@/lib/site-config";
import { getCachedActiveCourses, getCachedTeachers } from "@/lib/cached-data";
import { pickText } from "@/lib/course-content";
import { publicPageMetadata, homeTitle, homeDescription } from "@/lib/seo";
import type { Locale } from "@/i18n/routing";
import JsonLd from "@/components/shared/JsonLd";

export async function generateMetadata({ params }: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return publicPageMetadata(locale, "/", {
    title: { absolute: homeTitle },
    description:
      homeDescription,
    openGraph: { title: homeTitle, description: homeDescription },
    twitter: { title: homeTitle, description: homeDescription }
  });
}

export const revalidate = 3600;

async function getHomeData() {
  try {
    const [courses, teachers, reviewsResult, faqsResult, settings] = await Promise.all([
      getCachedActiveCourses(),
      getCachedTeachers(),
      api.content.list("REVIEW"),
      api.content.list("FAQ"),
      getSiteSettings(),
    ]);

    const reviews = reviewsResult.data.filter((item: any) => item.isPublished);
    const faqs = faqsResult.data.filter((item: any) => item.isPublished);

    return { courses, teachers, reviews, faqs, settings };
  } catch {
    const settings = await getSiteSettings();

    return {
      courses: [],
      teachers: [],
      reviews: [],
      faqs: [],
      settings,
    };
  }
}

export default async function HomePage() {
  const [{ courses, teachers, reviews, faqs, settings }, locale] = await Promise.all([
    getHomeData(),
    getLocale(),
  ]);

  const heroBadge = pickText(locale, settings.heroBadgeEn, settings.heroBadgeBn);
  const heroTitle = pickText(locale, settings.heroTitleEn, settings.heroTitleBn);
  const heroSubtitle = pickText(locale, settings.heroSubtitleEn, settings.heroSubtitleBn);
  const aboutTitle = pickText(locale, settings.aboutTitleEn, settings.aboutTitleBn);
  const aboutDescription = pickText(locale, settings.aboutDescriptionEn, settings.aboutDescriptionBn);

  const faqJsonLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.title,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.description || ""
          }
        }))
      }
    : null;

  return (
    <>
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <Hero
        phone={settings.phone || ""}
        badge={heroBadge || undefined}
        title={heroTitle || undefined}
        subtitle={heroSubtitle || undefined}
        image={settings.heroImage || undefined}
      />
      <About
        title={aboutTitle || undefined}
        description={aboutDescription || undefined}
        image={settings.aboutImage || undefined}
      />
      <Courses courses={courses} />

      <Teachers teachers={teachers} embedded />
      <Reviews reviews={reviews} />

      {/* Lead form and map */}
      <section className="bg-cream py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl items-stretch gap-10 px-4 lg:grid-cols-2 lg:px-8">
          <LeadForm
            courses={courses}
            bkashNumber={settings.bkashNumber || ""}
            nagadNumber={settings.nagadNumber || ""}
            bankAccount={settings.bankAccount || ""}
            embedded
          />

          <GoogleMapSection
            mapUrl={settings.googleMapUrl || ""}
            address={settings.address || ""}
            phone={settings.phone || ""}
            email={settings.email || ""}
            embedded
          />
        </div>
      </section>

      {/* Full-width FAQ accommodates 8?10 questions above the review form. */}
      <section className="bg-primary/5 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl space-y-12 px-4 lg:px-8">
          <FAQ faqs={faqs} />

          <div className="mx-auto w-full max-w-2xl">
            <ReviewForm />
          </div>
        </div>
      </section>
    </>
  );
}
