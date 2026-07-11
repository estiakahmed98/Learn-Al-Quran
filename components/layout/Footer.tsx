import Link from "next/link";

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
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">
              🕌
            </span>
            <span className="leading-tight">
              <span className="block font-heading text-base font-bold uppercase tracking-wide text-white">
                Learn Al Quran
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-gold-light">
                Online BD
              </span>
            </span>
          </div>
          <p className="mt-4 text-sm text-cream/80">
            Our mission is to spread the light of Quran education around the world with
            quality and sincerity.
          </p>

          {socials.length > 0 && (
            <div className="mt-5">
              <h4 className="text-sm font-semibold text-white">Follow Us</h4>
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
          <h4 className="font-heading font-semibold text-white">Contact Information</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/80">
            <li>
              📞 <a href={`tel:${phone}`} className="hover:text-gold-light">{phone}</a>
            </li>
            <li>
              💬{" "}
              <a href={`https://wa.me/${whatsapp}`} className="hover:text-gold-light">
                WhatsApp: {whatsapp}
              </a>
            </li>
            <li>
              ✉️ <a href={`mailto:${email}`} className="hover:text-gold-light">{email}</a>
            </li>
            <li>📍 {address}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-cream/80">
            <li><Link href="/" className="hover:text-gold-light">Home</Link></li>
            <li><Link href="/courses" className="hover:text-gold-light">Courses</Link></li>
            <li><Link href="/#courses" className="hover:text-gold-light">Master Classes</Link></li>
            <li><Link href="/books" className="hover:text-gold-light">Books</Link></li>
            <li><Link href="/blog" className="hover:text-gold-light">Blog</Link></li>
            <li><Link href="/about-us" className="hover:text-gold-light">About Us</Link></li>
            <li><Link href="/contact-us" className="hover:text-gold-light">Contact Us</Link></li>
            <li><Link href="/free-trial-class" className="hover:text-gold-light">Free Trial Class</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold text-white">Google Map</h4>
          {googleMapUrl && (
            <div className="mt-4 overflow-hidden rounded-xl">
              <iframe
                src={googleMapUrl}
                width="100%"
                height="150"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Madrasa location on Google Map"
              />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-cream/70 sm:flex-row lg:px-8">
          <p>
            {copyrightText ||
              `© ${new Date().getFullYear()} Learn Al Quran Online BD. All rights reserved.`}
          </p>
          <p className="flex gap-3">
            <Link href="/privacy-policy" className="hover:text-gold-light">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/terms-and-conditions" className="hover:text-gold-light">
              Terms &amp; Conditions
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
