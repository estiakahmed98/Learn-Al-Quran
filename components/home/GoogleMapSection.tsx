import { getTranslations } from "next-intl/server";
import IslamicPattern from "@/components/shared/IslamicPattern";

export default async function GoogleMapSection({
  mapUrl,
  embedded = false,
  address,
  phone,
  email,
}: {
  mapUrl: string;
  embedded?: boolean;
  address?: string;
  phone?: string;
  email?: string;
}) {
  const t = await getTranslations("sitePages.map");
  const isEmbeddableUrl =
    mapUrl.includes("/maps/embed") || mapUrl.includes("output=embed");
  const mapQuery = address?.trim() || "Dhaka, Bangladesh";
  const googleMapUrl = isEmbeddableUrl
    ? mapUrl
    : `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`;

  if (embedded) {
    return (
      <div className="group relative flex h-full flex-col">
        {/* Decorative elements */}
        <div className="absolute -top-3 -left-3 h-8 w-8 border-t-2 border-l-2 border-gold/20 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute -bottom-3 -right-3 h-8 w-8 border-b-2 border-r-2 border-gold/20 rounded-br-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex items-center gap-3 mb-4">
          <div className="flex gap-1">
            <span className="h-1 w-1 rounded-full bg-gold/60" />
            <span className="h-1 w-3 rounded-full bg-gold" />
            <span className="h-1 w-1 rounded-full bg-gold/60" />
          </div>
          <h2 className="flex items-center gap-2 font-heading text-base font-bold uppercase tracking-wide text-primary-dark sm:text-lg">
            <span className="text-gold">📍</span>
            {t("title")}
          </h2>
        </div>

        <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-2xl border-2 border-gold/10 shadow-lg transition-all duration-300 group-hover:border-gold/30 group-hover:shadow-xl">
          {/* Islamic pattern overlay on map */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                repeating-linear-gradient(45deg, 
                  transparent 0px, 
                  transparent 20px, 
                  rgba(212, 175, 55, 0.5) 20px, 
                  rgba(212, 175, 55, 0.5) 21px
                ),
                repeating-linear-gradient(-45deg, 
                  transparent 0px, 
                  transparent 20px, 
                  rgba(212, 175, 55, 0.5) 20px, 
                  rgba(212, 175, 55, 0.5) 21px
                )
              `,
              }}
            />
          </div>

          {/* Decorative corner markers */}
          <div className="absolute top-2 left-2 z-10 flex gap-1 opacity-50">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold/50" />
          </div>
          <div className="absolute bottom-2 right-2 z-10 flex gap-1 opacity-50">
            <span className="h-1.5 w-1.5 rounded-full bg-gold/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </div>

          <iframe
            src={googleMapUrl}
            width="100%"
            className="h-full min-h-[280px] border-0 transition-transform duration-300 group-hover:scale-[1.01]"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Learn Al Quran Online BD location"
          />

          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
        </div>

        {/* Location badge */}
        <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
          <span className="text-gold">✦</span>
          <span>{t("badge")}</span>
          <span className="text-gold">✦</span>
        </div>
      </div>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-cream py-12 sm:py-16">
      <IslamicPattern opacity={0.03} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Decorative top */}
          <div className="flex justify-center gap-2 mb-3">
            <span className="text-gold/30 text-xl">✦</span>
            <span className="text-gold/50 text-xl">✦</span>
            <span className="text-gold/30 text-xl">✦</span>
          </div>
          <p className="font-semibold uppercase tracking-wider text-secondary text-xs sm:text-sm">
            {t("eyebrow")}
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold text-primary-dark sm:text-3xl lg:text-4xl">
            {t("title")}
          </h2>
          <div className="mx-auto mt-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/40" />
            <span className="h-1.5 w-3 rounded-full bg-gold" />
            <span className="h-px w-8 bg-gold/40" />
          </div>
          <p className="mt-3 text-sm text-gray-600">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-8 group relative">
          {/* Decorative corners */}
          <div className="absolute -top-4 -left-4 h-12 w-12 border-t-2 border-l-2 border-gold/20 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute -bottom-4 -right-4 h-12 w-12 border-b-2 border-r-2 border-gold/20 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="overflow-hidden rounded-2xl border-2 border-gold/10 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:border-gold/30">
            {/* Islamic pattern overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `
                  repeating-linear-gradient(45deg, 
                    transparent 0px, 
                    transparent 25px, 
                    rgba(212, 175, 55, 0.5) 25px, 
                    rgba(212, 175, 55, 0.5) 26px
                  ),
                  repeating-linear-gradient(-45deg, 
                    transparent 0px, 
                    transparent 25px, 
                    rgba(212, 175, 55, 0.5) 25px, 
                    rgba(212, 175, 55, 0.5) 26px
                  )
                `,
                }}
              />
            </div>

            <iframe
              src={googleMapUrl}
              width="100%"
              height="400"
              className="border-0 transition-transform duration-300 group-hover:scale-[1.01]"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Learn Al Quran Online BD location"
            />

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Location details */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="text-gold">📍</span>
            <span>{address || t("address")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold">📞</span>
            <span>{phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold">✉️</span>
            <span>{email}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
