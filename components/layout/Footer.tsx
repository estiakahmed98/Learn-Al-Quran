import Link from "next/link";
import { useTranslations } from "next-intl";

interface FooterProps {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  facebookUrl?: string | null;
  youtubeUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  googleMapUrl?: string | null;
  copyrightText?: string | null;
}

export default function Footer({
  phone,
  whatsapp,
  email,
  address,
  facebookUrl,
  youtubeUrl,
  instagramUrl,
  linkedinUrl,
  googleMapUrl,
  copyrightText
}: FooterProps) {
  const t = useTranslations("footer");
  const footerGoogleMapUrl =
    googleMapUrl && !googleMapUrl.includes("!1d1234")
      ? googleMapUrl
      : `https://www.google.com/maps?q=${encodeURIComponent(address || "Dhaka, Bangladesh")}&z=12&output=embed`;
  const socials = [
    { label: "f", title: "Facebook", url: facebookUrl },
    { label: "▶", title: "YouTube", url: youtubeUrl },
    { label: "◎", title: "Instagram", url: instagramUrl },
    { label: "in", title: "LinkedIn", url: linkedinUrl },
    { label: "✆", title: "WhatsApp", url: whatsapp ? `https://wa.me/${whatsapp}` : null }
  ].filter((s) => s.url);

  return (
    <footer className="bg-primary-dark text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Learn_Al_Quran_Logo.png"
              alt="Learn Al Quran Online BD logo"
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
            <span className="leading-tight">
              <span className="block font-heading text-base font-bold uppercase tracking-wide text-white">
                Learn Al Quran
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light">
                Online BD
              </span>
            </span>
          </div>
          <p className="mt-4 text-sm text-cream/80">{t("mission")}</p>

          {socials.length > 0 && (
            <div className="mt-5">
              <h4 className="text-sm font-semibold text-white">{t("followUs")}</h4>
              <div className="mt-3 flex gap-2">
                {socials.map((s) => (
                  <a
                    key={s.title}
                    href={s.url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.title}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white transition hover:bg-gold hover:text-primary-dark"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-heading font-semibold text-white">{t("contactInfo")}</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/80">
            <li>
              📞 <a href={`tel:${phone}`} className="hover:text-gold-light">{phone}</a>
            </li>
            <li>
              💬{" "}
              <a href={`https://wa.me/${whatsapp}`} className="hover:text-gold-light">
                {t("whatsapp")}: {whatsapp}
              </a>
            </li>
            <li>
              ✉️ <a href={`mailto:${email}`} className="hover:text-gold-light">{email}</a>
            </li>
            <li>📍 {address}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-white">{t("quickLinks")}</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/80">
            <li><Link href="/" className="hover:text-gold-light">{t("home")}</Link></li>
            <li><Link href="/courses" className="hover:text-gold-light">{t("courses")}</Link></li>
            <li><Link href="/#courses" className="hover:text-gold-light">{t("masterClasses")}</Link></li>
            <li><Link href="/books" className="hover:text-gold-light">{t("books")}</Link></li>
            <li><Link href="/blog" className="hover:text-gold-light">{t("blog")}</Link></li>
            <li><Link href="/about-us" className="hover:text-gold-light">{t("aboutUs")}</Link></li>
            <li><Link href="/contact-us" className="hover:text-gold-light">{t("contactUs")}</Link></li>
            <li><Link href="/free-trial-class" className="hover:text-gold-light">{t("freeTrialClass")}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-white">{t("googleMap")}</h4>
          <div className="mt-4 overflow-hidden rounded-xl">
            <iframe
              src={footerGoogleMapUrl}
              width="100%"
              height="150"
              className="border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Madrasa location on Google Map"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-cream/70 sm:flex-row lg:px-8">
          <p>{copyrightText || t("copyright", { year: new Date().getFullYear() })}</p>
          <p className="flex gap-3">
            <Link href="/privacy-policy" className="hover:text-gold-light">
              {t("privacyPolicy")}
            </Link>
            <span>|</span>
            <Link href="/terms-and-conditions" className="hover:text-gold-light">
              {t("terms")}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
