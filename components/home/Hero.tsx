"use client";

import { trackEvent } from "@/components/shared/GoogleAnalytics";

const features = [
  { icon: "💻", label: "Live Interactive Classes" },
  { icon: "👥", label: "Expert Teachers" },
  { icon: "📅", label: "Flexible Schedule" },
  { icon: "📈", label: "Track Your Progress" }
];

export default function Hero({ phone }: { phone: string }) {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:px-8 lg:py-20">
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-primary-dark shadow-sm sm:text-sm">
            <span className="text-gold">👨‍👩‍👧</span> Trusted by Thousands of Families Worldwide
          </p>

          <h1 className="mt-5 font-heading text-4xl font-bold leading-[1.1] text-primary-dark sm:text-5xl lg:text-6xl">
            Learn Quran
            <br />
            From Anywhere,
            <br />
            <span className="text-gold">Anytime</span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-gray-600 lg:mx-0 lg:text-lg">
            Quality Islamic Education for Kids &amp; Adults with Experienced Teachers
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {features.map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-2 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-white text-xl shadow-sm">
                  {f.icon}
                </span>
                <span className="text-xs font-semibold leading-snug text-primary-dark">
                  {f.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start sm:justify-center">
            <a
              href={`tel:${phone}`}
              onClick={() => trackEvent("call_click", { location: "hero" })}
              className="w-full rounded-full bg-primary px-8 py-3 text-center font-semibold text-white shadow-lg transition hover:bg-primary-dark sm:w-auto"
            >
              📞 Call Now
            </a>
            <a
              href={`tel:${phone}`}
              className="w-full rounded-full bg-white px-8 py-3 text-center font-semibold text-primary-dark shadow sm:w-auto"
            >
              {phone}
            </a>
          </div>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-3xl shadow-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-banner.jpg"
            alt="Children learning Quran online with a certified teacher"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
