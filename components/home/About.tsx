const highlights = [
  { icon: "🎓", title: "Qualified", subtitle: "Teachers" },
  { icon: "👥", title: "1000+", subtitle: "Students" },
  { icon: "🕐", title: "Flexible", subtitle: "Timing" },
  { icon: "🛡️", title: "Trusted", subtitle: "Platform" }
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
      <div className="overflow-hidden rounded-3xl border border-gold/20 bg-cream shadow-sm">
        <div className="grid items-stretch gap-0 lg:grid-cols-[1fr_1.4fr]">
          <div className="relative min-h-[220px] lg:min-h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/about-madrasa.jpg"
              alt="Learn Al Quran Online BD teachers and students"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <p className="text-sm font-bold uppercase tracking-wide text-secondary">About Us</p>
            <h2 className="mt-2 font-heading text-2xl font-bold leading-snug text-primary-dark lg:text-3xl">
              Building Stronger Iman,
              <br className="hidden sm:block" /> One Lesson at a Time
            </h2>
            <p className="mt-4 text-sm text-gray-600 lg:text-base">
              At Learn Al Quran Online BD, we are dedicated to providing high-quality Quran
              education for students of all ages. Our experienced teachers ensure a
              personalized and effective learning experience from the comfort of your home.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {highlights.map((h) => (
                <div key={h.title + h.subtitle} className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg">
                    {h.icon}
                  </span>
                  <span className="leading-tight">
                    <span className="block text-sm font-bold text-primary-dark">{h.title}</span>
                    <span className="block text-xs text-gray-600">{h.subtitle}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
