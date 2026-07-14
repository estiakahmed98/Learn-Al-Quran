import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
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
  copyrightText
}: FooterProps) {
  const t = useTranslations("footer");
  const socials = [
    { label: "Fb", title: "Facebook", url: facebookUrl },
    { label: "YT", title: "YouTube", url: youtubeUrl },
    { label: "Ig", title: "Instagram", url: instagramUrl },
    { label: "in", title: "LinkedIn", url: linkedinUrl },
    { label: "WA", title: "WhatsApp", url: whatsapp ? `https://wa.me/${whatsapp}` : null }
  ].filter((social) => social.url);

  const quickLinks = [
    { href: "/", label: t("home") },
    { href: "/courses", label: t("courses") },
    { href: "/books", label: t("books") },
    { href: "/blog", label: t("blog") },
    { href: "/about-us", label: t("aboutUs") },
    { href: "/contact-us", label: t("contactUs") }
  ];

  return (
    <footer className="relative overflow-hidden bg-primary-dark text-cream">
      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full border-[28px] border-white/[0.025]" />
      <div className="pointer-events-none absolute -bottom-28 right-10 h-72 w-72 rounded-full border-[32px] border-gold/[0.035]" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-14">
        <div className="sm:col-span-2 lg:col-span-4">
          <Link href="/" className="inline-flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/Learn_Al_Quran_Logo.png"
              alt="Learn Al Quran Online BD logo"
              className="h-14 w-14 shrink-0 rounded-full border border-gold/30 object-cover"
            />
            <span className="leading-tight">
              <span className="block font-heading text-lg font-bold uppercase tracking-wide text-white">
                Learn Al Quran
              </span>
              <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-gold-light">
                Online BD
              </span>
            </span>
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-6 text-cream/70">{t("mission")}</p>

          {socials.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
                {t("followUs")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {socials.map((social) => (
                  <a
                    key={social.title}
                    href={social.url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.title}
                    aria-label={social.title}
                    className="flex h-9 min-w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-2 text-[11px] font-bold text-white transition hover:border-gold hover:bg-gold hover:text-primary-dark"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            {t("quickLinks")}
          </h2>
          <div className="mt-3 h-0.5 w-10 rounded-full bg-gold/70" />
          <ul className="mt-5 space-y-3 text-sm text-cream/70">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="inline-flex items-center gap-2 transition hover:translate-x-1 hover:text-gold-light">
                  <span className="h-1 w-1 rounded-full bg-gold/70" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            {t("contactInfo")}
          </h2>
          <div className="mt-3 h-0.5 w-10 rounded-full bg-gold/70" />
          <ul className="mt-5 space-y-4 text-sm text-cream/70">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
              <a href={`tel:${phone}`} className="break-all transition hover:text-gold-light">{phone}</a>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
              <a href={`https://wa.me/${whatsapp}`} className="break-all transition hover:text-gold-light">
                {t("whatsapp")}: {whatsapp}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
              <a href={`mailto:${email}`} className="break-all transition hover:text-gold-light">{email}</a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
              <span className="leading-5">{address}</span>
            </li>
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-3">
          <div className="h-full rounded-2xl border border-gold/15 bg-white/[0.055] p-6 shadow-inner">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-light">
              {t("ctaEyebrow")}
            </p>
            <h2 className="mt-3 font-heading text-xl font-bold leading-snug text-white">
              {t("ctaTitle")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-cream/65">{t("ctaText")}</p>
            <Link
              href="/free-trial-class"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-primary-dark transition hover:bg-gold-light"
            >
              {t("bookFreeTrial")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-center text-xs text-cream/60 sm:flex-row sm:text-left lg:px-8">
          <p>{copyrightText || t("copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-3">
            <Link href="/privacy-policy" className="transition hover:text-gold-light">{t("privacyPolicy")}</Link>
            <span className="text-white/20">|</span>
            <Link href="/terms-and-conditions" className="transition hover:text-gold-light">{t("terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
