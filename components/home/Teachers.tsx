import type { Content } from "@prisma/client";

export default function Teachers({
  teachers,
  embedded = false
}: {
  teachers: Content[];
  embedded?: boolean;
}) {
  if (!teachers.length) return null;

  const grid = (
    <div
      className={
        embedded
          ? "mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
          : "mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4"
      }
    >
      {teachers.map((teacher) => (
        <div
          key={teacher.id}
          className="rounded-2xl border border-gold/20 bg-white p-4 text-center shadow-sm transition hover:shadow-md"
        >
          <div className="mx-auto h-16 w-16 overflow-hidden rounded-full bg-cream ring-2 ring-gold/40 sm:h-20 sm:w-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={teacher.image || "/images/teacher-placeholder.jpg"}
              alt={teacher.title}
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="mt-3 font-heading text-sm font-bold text-primary-dark">
            {teacher.title}
          </h3>
          <p className="text-xs text-gray-600">{teacher.subtitle}</p>
          <p className="mt-1 text-sm tracking-wide text-secondary">★★★★★</p>
        </div>
      ))}
    </div>
  );

  if (embedded) {
    return (
      <div>
        <h2 className="flex items-center gap-2 font-heading text-lg font-bold uppercase tracking-wide text-primary-dark sm:text-xl">
          Our Teachers <span className="text-secondary">⟶</span>
        </h2>
        {grid}
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-semibold uppercase tracking-wide text-secondary">Our Teachers</p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-primary-dark lg:text-3xl">
          Learn From Certified Huffaz &amp; Qaris
        </h2>
      </div>
      {grid}
    </section>
  );
}
