export default function GoogleMapSection({
  mapUrl,
  embedded = false
}: {
  mapUrl: string;
  embedded?: boolean;
}) {
  const googleMapUrl =
    mapUrl && !mapUrl.includes("!1d1234")
      ? mapUrl
      : "https://www.google.com/maps?q=Dhaka%2C%20Bangladesh&z=12&output=embed";

  if (embedded) {
    return (
      <div>
        <h2 className="flex items-center gap-2 font-heading text-base font-bold uppercase tracking-wide text-primary-dark sm:text-lg">
          Our Location
        </h2>
        <div className="mt-5 overflow-hidden rounded-2xl border border-gold/20 shadow-sm">
          <iframe
            src={googleMapUrl}
            width="100%"
            height="280"
            className="border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Learn Al Quran Online BD location"
          />
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="text-center">
        <p className="font-semibold uppercase tracking-wide text-secondary">Find Us</p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-primary-dark lg:text-3xl">
          Our Location
        </h2>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-gold/20 shadow-sm">
        <iframe
          src={googleMapUrl}
          width="100%"
          height="400"
          className="border-0"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Learn Al Quran Online BD location"
        />
      </div>
    </section>
  );
}
