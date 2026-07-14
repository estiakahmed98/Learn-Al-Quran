import type { Metadata } from "next";
import GoogleMapSection from "@/components/home/GoogleMapSection";
import { getSiteSettings } from "@/lib/site-config";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Learn Al Quran Online BD. Call, WhatsApp, or email us to learn more about our online Quran courses or book a free trial class.",
  alternates: { canonical: "/contact-us" },
};

export const revalidate = 3600;

export default async function ContactUsPage() {
  const t = await getTranslations("sitePages.contact");
  const settings = await getSiteSettings();

  return (
    <div className="relative overflow-hidden">
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
      <div className="pointer-events-none absolute -left-20 top-1/3 hidden h-[20rem] w-[20rem] -translate-y-1/2 rounded-full border-[20px] border-primary-dark/5 lg:block" />
      <div className="pointer-events-none absolute -right-12 bottom-1/4 h-32 w-32 rounded-full border-[12px] border-gold/5 lg:hidden" />
      <div className="pointer-events-none absolute -left-8 top-20 h-24 w-24 rounded-full border-[10px] border-gold/5 lg:hidden" />

      <div className="relative mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Decorative top element */}
        <div className="flex justify-center gap-2 mb-4">
          <span className="text-gold/30 text-xl">✦</span>
          <span className="text-gold/30 text-xl">✦</span>
          <span className="text-gold/50 text-xl">✦</span>
          <span className="text-gold/30 text-xl">✦</span>
          <span className="text-gold/30 text-xl">✦</span>
        </div>

        <p className="font-semibold uppercase tracking-wider text-secondary text-xs sm:text-sm">
          {t("eyebrow")}
        </p>

        <h1 className="mt-2 font-heading text-2xl font-bold text-primary-dark sm:text-3xl lg:text-4xl">
          {t("title")}
        </h1>

        <div className="mx-auto mt-3 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-gold/40" />
          <span className="h-1.5 w-3 rounded-full bg-gold" />
          <span className="h-px w-8 bg-gold/40" />
        </div>

        <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
          {t("subtitle")}
        </p>

        {/* Contact Cards */}
        <div className="mt-10 grid gap-4 sm:gap-6 sm:grid-cols-3">
          {/* Call Card */}
          <a
            href={`tel:${settings.phone}`}
            className="group relative overflow-hidden rounded-2xl border border-gold/10 bg-white/90 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-gold/30"
          >
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300"
              style={{
                backgroundImage: `
                radial-gradient(circle at 30% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)
              `,
              }}
            />

            {/* Decorative corners */}
            <div className="absolute -top-1 -right-1 h-8 w-8 border-t-2 border-r-2 border-gold/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-2 border-l-2 border-gold/20 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gold/10 animate-pulse" />
                  <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-primary/10 to-gold/10 flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    📞
                  </div>
                </div>
              </div>
              <p className="mt-3 font-heading font-bold text-primary-dark group-hover:text-primary transition-colors duration-300">
                {t("call")}
              </p>
              <div className="mx-auto mt-1.5 h-0.5 w-8 rounded-full bg-gold/40 group-hover:w-12 transition-all duration-300" />
              <p className="mt-2 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {settings.phone}
              </p>
              <p className="mt-1 text-xs text-gray-400">{t("available")}</p>
            </div>
          </a>

          {/* WhatsApp Card */}
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-gold/10 bg-white/90 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-gold/30"
          >
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300"
              style={{
                backgroundImage: `
                radial-gradient(circle at 30% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)
              `,
              }}
            />

            {/* Decorative corners */}
            <div className="absolute -top-1 -right-1 h-8 w-8 border-t-2 border-r-2 border-gold/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-2 border-l-2 border-gold/20 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-green-500/10 animate-pulse" />
                  <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-green-500/10 to-gold/10 flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    💬
                  </div>
                </div>
              </div>
              <p className="mt-3 font-heading font-bold text-primary-dark group-hover:text-primary transition-colors duration-300">
                {t("whatsapp")}
              </p>
              <div className="mx-auto mt-1.5 h-0.5 w-8 rounded-full bg-gold/40 group-hover:w-12 transition-all duration-300" />
              <p className="mt-2 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {settings.whatsapp}
              </p>
              <p className="mt-1 text-xs text-gray-400">{t("quickResponse")}</p>
            </div>
          </a>

          {/* Email Card */}
          <a
            href={`mailto:${settings.email}`}
            className="group relative overflow-hidden rounded-2xl border border-gold/10 bg-white/90 backdrop-blur-sm p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-gold/30"
          >
            {/* Background pattern */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-300"
              style={{
                backgroundImage: `
                radial-gradient(circle at 30% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 70% 70%, rgba(212, 175, 55, 0.1) 0%, transparent 50%)
              `,
              }}
            />

            {/* Decorative corners */}
            <div className="absolute -top-1 -right-1 h-8 w-8 border-t-2 border-r-2 border-gold/20 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-2 border-l-2 border-gold/20 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse" />
                  <div className="relative h-16 w-16 rounded-full bg-gradient-to-br from-blue-500/10 to-gold/10 flex items-center justify-center text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    ✉️
                  </div>
                </div>
              </div>
              <p className="mt-3 font-heading font-bold text-primary-dark group-hover:text-primary transition-colors duration-300">
                {t("email")}
              </p>
              <div className="mx-auto mt-1.5 h-0.5 w-8 rounded-full bg-gold/40 group-hover:w-12 transition-all duration-300" />
              <p className="mt-2 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                {settings.email}
              </p>
              <p className="mt-1 text-xs text-gray-400">{t("emailResponse")}</p>
            </div>
          </a>
        </div>

        {/* Bottom decorative element */}
        <div className="mt-12 flex justify-center gap-2 opacity-30">
          <span className="h-px w-12 bg-gold/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="h-px w-12 bg-gold/30" />
        </div>
      </div>

      {/* Google Map Section */}
      <div className="relative">
        {/* Decorative divider */}
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        </div>

        <GoogleMapSection
          mapUrl={settings.googleMapUrl || ""}
          address={settings.address || ""}
          phone={settings.phone || ""}
          email={settings.email || ""}
        />
      </div>
    </div>
  );
}
