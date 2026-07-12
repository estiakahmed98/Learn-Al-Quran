import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Teachers from "@/components/home/Teachers";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Learn Al Quran Online BD — our mission, teaching methodology, and certified Huffaz and Qaris dedicated to online Quran education.",
  alternates: { canonical: "/about-us" }
};

export const revalidate = 3600;

export default async function AboutUsPage() {
  const teachers = await prisma.content
    .findMany({ where: { type: "TEACHER", isPublished: true }, orderBy: { sortOrder: "asc" } })
    .catch(() => []);

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <p className="text-center font-semibold uppercase tracking-wide text-secondary">About Us</p>
        <h1 className="mt-2 text-center font-heading text-3xl font-bold text-primary-dark">
          Our Mission Is To Make Quran Learning Accessible To All
        </h1>

        <div className="mt-8 space-y-4 text-gray-700">
          <p>
            Learn Al Quran Online BD was founded with a simple goal: to bring authentic,
            structured Quran education to every home, regardless of location. Whether you are a
            child taking your first steps in Arabic, or an adult learning to read the Quran for
            the first time, our certified teachers provide personalized, one-to-one classes
            built around your schedule.
          </p>
          <p>
            We combine traditional Islamic teaching methods with modern online learning tools —
            live video classes, structured curriculums, and continuous progress tracking — so
            every student, wherever they are in the world, gets the same quality of education as
            in a traditional madrasa.
          </p>
          <p>
            Our teaching staff includes certified Huffaz (those who have memorized the complete
            Quran) and Qaris (expert reciters), each carefully vetted for both knowledge and
            teaching ability before joining our platform.
          </p>
        </div>
      </div>

      <Teachers teachers={teachers} />
    </div>
  );
}
