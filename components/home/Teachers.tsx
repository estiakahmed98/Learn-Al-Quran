import { getTranslations } from "next-intl/server";

export interface TeacherCard {
  id: string;
  name: string;
  designation: string | null;
  description: string | null;
  imageURL: string | null;
}

function TeacherCardItem({
  teacher,
  index,
}: {
  teacher: TeacherCard;
  index: number;
}) {
  return (
    <div
      className="group relative flex flex-col items-center overflow-hidden rounded-2xl border border-gold/10 bg-white/90 backdrop-blur-sm p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-gold/30"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Decorative corner elements */}
      <div className="absolute -top-1 -right-1 h-8 w-8 border-t-2 border-r-2 border-gold/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-2 border-l-2 border-gold/20 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
        style={{
          backgroundImage: `
          radial-gradient(circle at 30% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 70% 70%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)
        `,
        }}
      />

      <div className="relative">
        {/* Profile image with ring */}
        <div className="relative h-20 w-20 sm:h-24 sm:w-24">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/20 to-primary/20 animate-pulse" />
          <div className="absolute inset-0.5 rounded-full bg-white" />
          <div className="absolute inset-0 rounded-full ring-2 ring-gold/40 ring-offset-2 ring-offset-white transition-all duration-300 group-hover:ring-4 group-hover:ring-gold/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={teacher.imageURL || "/images/teacher-placeholder.jpg"}
              alt={teacher.name}
              className="h-full w-full rounded-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Decorative dots around the image */}
          <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-gold/30" />
          <div className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-gold/30" />
          <div className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-primary/20" />
          <div className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-primary/20" />
        </div>

        <h3 className="mt-4 font-heading text-sm sm:text-base font-bold uppercase tracking-wide text-primary-dark group-hover:text-primary transition-colors duration-300">
          {teacher.name}
        </h3>

        <div className="mx-auto mt-2 flex items-center gap-2">
          <span className="h-px w-6 bg-gold/30" />
          <span className="h-1 w-1 rounded-full bg-gold" />
          <span className="h-px w-6 bg-gold/30" />
        </div>

        {teacher.designation && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-secondary">
            {teacher.designation}
          </p>
        )}

        {teacher.description && (
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700 lg:text-sm">
            {teacher.description}
          </p>
        )}

        {/* Decorative bottom element */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="h-1 w-1 rounded-full bg-gold/40" />
          <span className="h-1 w-1 rounded-full bg-gold/60" />
          <span className="h-1 w-1 rounded-full bg-gold/40" />
        </div>
      </div>
    </div>
  );
}

export default async function Teachers({
  teachers,
  embedded = false,
}: {
  teachers: TeacherCard[];
  embedded?: boolean;
}) {
  if (!teachers.length) return null;

  const t = await getTranslations("sitePages.teachers");
  const title = embedded
    ? t("embeddedTitle")
    : t("title");
  const subtitle = embedded
    ? t("embeddedSubtitle")
    : t("eyebrow");

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-white">
      {/* Islamic Geometric Pattern Background */}
      <div className="absolute inset-0 opacity-[0.04]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.15) 0%, transparent 40%),
            repeating-linear-gradient(45deg, 
              transparent 0px, 
              transparent 30px, 
              rgba(212, 175, 55, 0.08) 30px, 
              rgba(212, 175, 55, 0.08) 31px
            ),
            repeating-linear-gradient(-45deg, 
              transparent 0px, 
              transparent 30px, 
              rgba(212, 175, 55, 0.08) 30px, 
              rgba(212, 175, 55, 0.08) 31px
            )
          `,
          }}
        />

        {/* Islamic Star Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 10% 80%, rgba(212, 175, 55, 0.06) 0%, transparent 30%),
            radial-gradient(circle at 90% 20%, rgba(212, 175, 55, 0.06) 0%, transparent 30%),
            repeating-linear-gradient(60deg, 
              transparent 0px, 
              transparent 50px, 
              rgba(212, 175, 55, 0.04) 50px, 
              rgba(212, 175, 55, 0.04) 51px
            ),
            repeating-linear-gradient(-60deg, 
              transparent 0px, 
              transparent 50px, 
              rgba(212, 175, 55, 0.04) 50px, 
              rgba(212, 175, 55, 0.04) 51px
            )
          `,
          }}
        />
      </div>

      {/* Decorative circles */}
      <div className="pointer-events-none absolute -left-20 top-1/2 hidden h-[20rem] w-[20rem] -translate-y-1/2 rounded-full border-[20px] border-primary-dark/5 lg:block" />
      <div className="pointer-events-none absolute -right-12 bottom-0 h-32 w-32 rounded-full border-[12px] border-gold/5 lg:hidden" />
      <div className="pointer-events-none absolute -left-8 top-20 h-24 w-24 rounded-full border-[10px] border-gold/5 lg:hidden" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        {/* Header Section */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Decorative top element */}
          <div className="flex justify-center gap-2 mb-4">
            <span className="text-gold/30 text-xl">✦</span>
            <span className="text-gold/30 text-xl">✦</span>
            <span className="text-gold/50 text-xl">✦</span>
            <span className="text-gold/30 text-xl">✦</span>
            <span className="text-gold/30 text-xl">✦</span>
          </div>

          {!embedded && (
            <p className="font-semibold uppercase tracking-wider text-secondary text-xs sm:text-sm">
              {subtitle}
            </p>
          )}

          <h2
            className={`font-heading font-bold text-primary-dark ${
              embedded
                ? "text-2xl sm:text-3xl lg:text-4xl"
                : "mt-2 text-2xl sm:text-3xl lg:text-4xl"
            }`}
          >
            {title}
          </h2>

          <div className="mx-auto mt-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/40" />
            <span className="h-1.5 w-3 rounded-full bg-gold" />
            <span className="h-px w-8 bg-gold/40" />
          </div>

          {embedded && (
            <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:mt-5 sm:text-base">
              {subtitle}
            </p>
          )}
        </div>

        {/* Teachers Grid */}
        <div className="mt-10 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.map((teacher, index) => (
            <TeacherCardItem key={teacher.id} teacher={teacher} index={index} />
          ))}
        </div>

        {/* Bottom Decorative Element */}
        <div className="mt-12 flex justify-center gap-2 opacity-30">
          <span className="h-px w-12 bg-gold/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="h-px w-12 bg-gold/30" />
        </div>
      </div>
    </section>
  );
}
