import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Courses from "@/components/home/Courses";
import Teachers from "@/components/home/Teachers";
import Reviews from "@/components/home/Reviews";
import FAQ from "@/components/home/FAQ";
import LeadForm from "@/components/home/LeadForm";
import GoogleMapSection from "@/components/home/GoogleMapSection";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Learn Al Quran Online BD | Online Quran, Tajweed & Hifz Classes",
  description:
    "Learn the Holy Quran online with certified Huffaz and Qaris. One-to-one Nazera, Tajweed, Hifz, Maktab and Adult Quran learning classes. Book a free trial class today.",
  alternates: { canonical: "/" }
};

export const revalidate = 3600;

async function getHomeData() {
  try {
    const [courses, teachers, reviews, faqs, settings] = await Promise.all([
      prisma.course.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: "asc" }
      }),
      prisma.content.findMany({
        where: { type: "TEACHER", isPublished: true },
        orderBy: { sortOrder: "asc" }
      }),
      prisma.content.findMany({
        where: { type: "REVIEW", isPublished: true },
        orderBy: { sortOrder: "asc" }
      }),
      prisma.content.findMany({
        where: { type: "FAQ", isPublished: true },
        orderBy: { sortOrder: "asc" }
      }),
      getSiteSettings()
    ]);
    return { courses, teachers, reviews, faqs, settings };
  } catch {
    const settings = await getSiteSettings();
    return { courses: [], teachers: [], reviews: [], faqs: [], settings };
  }
}

export default async function HomePage() {
  const { courses, teachers, reviews, faqs, settings } = await getHomeData();

  return (
    <>
      <Hero phone={settings.phone || ""} />
      <About />
      <Courses />

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-2 lg:px-8 lg:py-16">
        <Teachers teachers={teachers} embedded />
        <Reviews reviews={reviews} />
      </section>

      <section className="bg-cream py-12 lg:py-16">
        <div className="mx-auto grid max-w-7xl items-start gap-10 px-4 lg:grid-cols-[1fr_1.2fr_0.9fr] lg:px-8">
          <FAQ faqs={faqs} />
          <LeadForm
            courses={courses}
            bkashNumber={settings.bkashNumber || ""}
            nagadNumber={settings.nagadNumber || ""}
            bankAccount={settings.bankAccount || ""}
            embedded
          />
          <GoogleMapSection mapUrl={settings.googleMapUrl || ""} embedded />
        </div>
      </section>
    </>
  );
}
