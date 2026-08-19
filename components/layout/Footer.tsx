import Link from "next/link";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaRedditAlien,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";
import IslamicPattern from "@/components/shared/IslamicPattern";
import { parseSocialLinks, socialPlatformInfo } from "@/lib/social-platforms";
import { publicMediaUrl } from "@/lib/media-url";

const SOCIAL_ICONS = {
  facebook: FaFacebookF,
  youtube: FaYoutube,
  linkedin: FaLinkedinIn,
  tiktok: FaTiktok,
  instagram: FaInstagram,
  reddit: FaRedditAlien,
} as const;

interface FooterProps {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  socialLinks?: unknown;
  copyrightText?: string | null;
  siteName?: string;
  logo?: string;
}

export default function Footer({
  phone,
  whatsapp,
  email,
  address,
  socialLinks,
  copyrightText,
  siteName = "Learn Al Quran Online BD",
  logo = "/Learn_Al_Quran_Logo.png",
}: FooterProps) {
  const t = useTranslations("footer");
  const socials = parseSocialLinks(socialLinks)
    .filter((link) => link.url)
    .map((link) => {
      const info = socialPlatformInfo(link.platform);
      const Icon = SOCIAL_ICONS[link.platform as keyof typeof SOCIAL_ICONS];
      return { Icon, label: info.label, title: info.title, url: link.url };
    });

  const quickLinks = [
    { href: "/", label: t("home") },
    { href: "/courses", label: t("courses") },
    { href: "/books", label: t("books") },
    { href: "/blog", label: t("blog") },
    { href: "/about-us", label: t("aboutUs") },
    { href: "/contact-us", label: t("contactUs") },
  ];

  return (
    <footer className="relative overflow-hidden bg-primary-dark text-cream">
      <IslamicPattern tone="gold" opacity={0.06} />

      <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full border-[28px] border-white/[0.025]" />
      <div className="pointer-events-none absolute -bottom-28 right-10 h-72 w-72 rounded-full border-[32px] border-gold/[0.035]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-10 px-4 py-12 sm:gap-x-10 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-14">
        <div className="col-span-2 lg:col-span-4">
          <Link href="/" className="inline-flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={publicMediaUrl(logo, "/Learn_Al_Quran_Logo.png")}
              alt={`${siteName} logo`}
              className="h-14 w-14 shrink-0 rounded-full border border-gold/30 object-cover"
            />
            <span className="block font-heading text-lg font-bold uppercase tracking-wide text-white">
              {siteName}
            </span>
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-6 text-cream/70">
            {t("mission")}
          </p>

          {socials.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-light">
                {t("followUs")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {socials.map((social, index) => (
                  <a
                    key={`${social.title}-${social.url}-${index}`}
                    href={social.url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.title}
                    aria-label={social.title}
                    className="flex h-9 min-w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-2 text-[11px] font-bold text-white transition hover:border-gold hover:bg-gold hover:text-primary-dark"
                  >
                    {social.Icon ? (
                      <social.Icon aria-hidden="true" className="h-4 w-4" />
                    ) : (
                      social.label
                    )}
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
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-2 transition hover:translate-x-1 hover:text-gold-light"
                >
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
              <a
                href={`tel:${phone}`}
                className="break-all transition hover:text-gold-light"
              >
                {phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
              <a
                href={`mailto:${email}`}
                className="break-all transition hover:text-gold-light"
              >
                {email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-light" />
              <span className="leading-5">{address}</span>
            </li>
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-3">
          <div className="h-full rounded-2xl border border-gold/15 bg-white/[0.055] p-6 shadow-inner">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-light">
              {t("ctaEyebrow")}
            </p>
            <h2 className="mt-3 font-heading text-xl font-bold leading-snug text-white">
              {t("ctaTitle")}
            </h2>
            <p className="mt-3 text-sm leading-6 text-cream/65">
              {t("ctaText")}
            </p>
            <Link
              href="/free-trial-class"
              className="relative isolate mt-5 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-primary-dark transition hover:bg-gold-light"
            >
              <IslamicPattern tone="green" opacity={0.12} className="z-0" />
              <span className="relative z-10 inline-flex items-center gap-2">
                {t("bookFreeTrial")}
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-black/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-center text-xs text-cream/60 sm:flex-row sm:text-left lg:px-8">
          <p>
            {copyrightText ||
              t("copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/privacy-policy"
              className="transition hover:text-gold-light"
            >
              {t("privacyPolicy")}
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/terms-and-conditions"
              className="transition hover:text-gold-light"
            >
              {t("terms")}
            </Link>
            <span className="text-white/20">|</span>
            <Link
              href="/return-policy"
              className="transition hover:text-gold-light"
            >
              {t("returnPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
