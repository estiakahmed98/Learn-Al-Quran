import type { Metadata } from "next";
import GoogleMapSection from "@/components/home/GoogleMapSection";
import { getSiteSettings } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Learn Al Quran Online BD. Call, WhatsApp, or email us to learn more about our online Quran courses or book a free trial class.",
  alternates: { canonical: "/contact-us" }
};

export const revalidate = 3600;

export default async function ContactUsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 py-16 text-center lg:px-8">
        <p className="font-semibold uppercase tracking-wide text-gold">Contact Us</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-primary-dark">
          We'd Love To Hear From You
        </h1>
        <p className="mt-4 text-gray-600">
          Have questions about our courses, schedule, or fees? Reach out anytime — our team
          typically responds within a few hours.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <a
            href={`tel:${settings.phone}`}
            className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm hover:shadow-lg"
          >
            <p className="text-3xl">📞</p>
            <p className="mt-2 font-semibold text-primary-dark">Call Us</p>
            <p className="mt-1 text-sm text-gray-600">{settings.phone}</p>
          </a>
          <a
            href={`https://wa.me/${settings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm hover:shadow-lg"
          >
            <p className="text-3xl">💬</p>
            <p className="mt-2 font-semibold text-primary-dark">WhatsApp</p>
            <p className="mt-1 text-sm text-gray-600">{settings.whatsapp}</p>
          </a>
          <a
            href={`mailto:${settings.email}`}
            className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm hover:shadow-lg"
          >
            <p className="text-3xl">✉️</p>
            <p className="mt-2 font-semibold text-primary-dark">Email</p>
            <p className="mt-1 text-sm text-gray-600">{settings.email}</p>
          </a>
        </div>
      </div>

      <GoogleMapSection mapUrl={settings.googleMapUrl || ""} />
    </div>
  );
}
