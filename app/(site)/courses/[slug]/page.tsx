import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import JsonLd from "@/components/shared/JsonLd";
import { siteUrl } from "@/lib/site-config";

export const revalidate = 3600;

interface Props {
  params: { slug: string };
}

async function getCourse(slug: string) {
  return prisma.course.findUnique({ where: { slug, isActive: true } }).catch(() => null);
}

export async function generateStaticParams() {
  const courses = await prisma.course.findMany({ select: { slug: true } }).catch(() => []);
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = await getCourse(params.slug);
  if (!course) return { title: "Course Not Found" };

  return {
    title: course.metaTitle || course.title,
    description: course.metaDescription || course.description.slice(0, 160),
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      title: course.title,
      description: course.description.slice(0, 160),
      images: course.bannerImage ? [{ url: course.bannerImage }] : undefined
    }
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const course = await getCourse(params.slug);
  if (!course) notFound();

  const curriculum = (course.curriculum as { modules?: string[] } | null)?.modules || [];

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "Organization",
      name: "Learn Al Quran Online BD",
      sameAs: siteUrl
    },
    offers: {
      "@type": "Offer",
      price: course.fee,
      priceCurrency: "BDT"
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
      <JsonLd data={courseJsonLd} />

      <p className="font-semibold uppercase tracking-wide text-secondary">Course Details</p>
      <h1 className="mt-2 font-heading text-3xl font-bold text-primary-dark">{course.title}</h1>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
        <span>⏱ Duration: {course.duration}</span>
        <span className="font-semibold text-primary">Fee: ৳{course.fee}</span>
      </div>

      <p className="mt-6 text-gray-700">{course.description}</p>

      {curriculum.length > 0 && (
        <div className="mt-8">
          <h2 className="font-heading text-xl font-bold text-primary-dark">Course Modules</h2>
          <ul className="mt-3 space-y-2">
            {curriculum.map((module, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-700">
                <span className="text-primary">✔</span> {module}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href={`/free-trial-class?course=${course.slug}`}
          className="rounded-full bg-gold px-6 py-3 font-semibold text-primary-dark shadow hover:bg-gold-light"
        >
          Enroll Now — ভর্তি হন
        </Link>
        <Link
          href="/courses"
          className="rounded-full border-2 border-primary px-6 py-3 font-semibold text-primary hover:bg-primary hover:text-white"
        >
          ← Back to All Courses
        </Link>
      </div>
    </div>
  );
}
