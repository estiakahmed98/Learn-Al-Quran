import type { Content } from "@prisma/client";

function ReviewCard({ review, index }: { review: Content; index: number }) {
  const rating = (review.data as { rating?: number })?.rating || 5;

  return (
    <div
      className="group relative flex w-72 shrink-0 flex-col rounded-2xl border border-gold/10 bg-white/90 backdrop-blur-sm p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-gold/30 sm:w-80 lg:w-96"
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

      {/* Decorative quote marks */}
      <div className="absolute -top-2 -left-2 text-4xl text-gold/10 font-serif">
        "
      </div>
      <div className="absolute -bottom-2 -right-2 text-4xl text-gold/10 font-serif">
        "
      </div>

      <div className="relative">
        {/* Rating Stars */}
        <div className="flex justify-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-lg transition-all duration-300 ${
                i < rating ? "text-gold drop-shadow-sm" : "text-gray-300"
              } group-hover:scale-110`}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Decorative line */}
        <div className="mx-auto mt-2 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-gold/20" />
          <span className="h-1 w-1 rounded-full bg-gold/40" />
          <span className="h-px w-8 bg-gold/20" />
        </div>

        {/* Review Text */}
        <p className="mt-3 flex-1 text-xs leading-relaxed text-gray-600 line-clamp-4 transition-colors duration-300 group-hover:text-gray-700 sm:text-sm lg:text-sm">
          &ldquo;{review.description}&rdquo;
        </p>

        {/* Divider */}
        <div className="my-4 h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        {/* User Info */}
        <div className="flex items-center justify-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/20 to-primary/20 animate-pulse" />
            <div className="absolute inset-0.5 rounded-full bg-white" />
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-gold/40 ring-offset-2 ring-offset-white transition-all duration-300 group-hover:ring-4 group-hover:ring-gold/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={review.image || "/images/teacher-placeholder.jpg"}
                alt={review.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          <div className="text-left">
            <p className="text-sm font-bold text-primary-dark group-hover:text-primary transition-colors duration-300">
              {review.title}
            </p>
            {review.subtitle && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <span className="text-gold/40">✦</span>
                {review.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Reviews({ reviews }: { reviews: Content[] }) {
  if (!reviews.length) return null;

  const loop = reviews.length > 2 ? [...reviews, ...reviews] : reviews;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-primary/5">
      {/* Islamic Geometric Pattern Background */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.1) 0%, transparent 40%),
            repeating-linear-gradient(45deg, 
              transparent 0px, 
              transparent 25px, 
              rgba(212, 175, 55, 0.06) 25px, 
              rgba(212, 175, 55, 0.06) 26px
            ),
            repeating-linear-gradient(-45deg, 
              transparent 0px, 
              transparent 25px, 
              rgba(212, 175, 55, 0.06) 25px, 
              rgba(212, 175, 55, 0.06) 26px
            )
          `,
          }}
        />

        {/* Islamic Star Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            radial-gradient(circle at 90% 10%, rgba(212, 175, 55, 0.05) 0%, transparent 25%),
            radial-gradient(circle at 10% 90%, rgba(212, 175, 55, 0.05) 0%, transparent 25%),
            repeating-linear-gradient(60deg, 
              transparent 0px, 
              transparent 40px, 
              rgba(212, 175, 55, 0.04) 40px, 
              rgba(212, 175, 55, 0.04) 41px
            ),
            repeating-linear-gradient(-60deg, 
              transparent 0px, 
              transparent 40px, 
              rgba(212, 175, 55, 0.04) 40px, 
              rgba(212, 175, 55, 0.04) 41px
            )
          `,
          }}
        />
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none absolute -right-16 top-1/2 hidden h-[16rem] w-[16rem] -translate-y-1/2 rounded-full border-[16px] border-gold/5 lg:block" />
      <div className="pointer-events-none absolute -left-8 bottom-0 h-24 w-24 rounded-full border-[8px] border-gold/5 lg:hidden" />
      <div className="pointer-events-none absolute -right-8 top-20 h-20 w-20 rounded-full border-[8px] border-gold/5 lg:hidden" />

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

          <p className="font-semibold uppercase tracking-wider text-secondary text-xs sm:text-sm">
            Testimonials
          </p>

          <h2 className="mt-2 font-heading text-2xl font-bold text-primary-dark sm:text-3xl lg:text-4xl">
            What Our Students Say
          </h2>

          <div className="mx-auto mt-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/40" />
            <span className="h-1.5 w-3 rounded-full bg-gold" />
            <span className="h-px w-8 bg-gold/40" />
          </div>

          <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:mt-5 sm:text-base">
            Real stories from our students about their learning journey
          </p>
        </div>
      </div>

      {/* Reviews Carousel */}
      <div className="group relative overflow-hidden pb-12 sm:pb-14 lg:pb-20">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white/80 to-transparent sm:w-24 lg:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white/80 to-transparent sm:w-24 lg:w-32" />

        <div className="flex w-max gap-4 px-4 pb-4 animate-marquee group-hover:[animation-play-state:paused] sm:gap-6 lg:px-8">
          {loop.map((review, i) => (
            <ReviewCard key={`${review.id}-${i}`} review={review} index={i} />
          ))}
        </div>

        {/* Bottom decorative dots */}
        <div className="mt-8 flex justify-center gap-2">
          {reviews.slice(0, 3).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                i === 0 ? "bg-gold w-6" : "bg-gold/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
