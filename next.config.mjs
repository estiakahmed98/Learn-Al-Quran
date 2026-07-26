import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  distDir: "out",
  experimental: {
    // Image/file uploads go through Server Actions as multipart FormData;
    // the backend already caps files at 5MB (see UploadImageRequest), so
    // raise Next's default 1MB Server Action body limit to match.
    serverActions: {
      bodySizeLimit: "6mb"
    }
  },
  images: {
    // All images are either served from /public (local uploads, static
    // assets) or referenced via same-origin paths — nothing in the app
    // currently needs to load remote images through next/image, so no
    // remotePatterns are allowed. Add a specific host here (not a wildcard)
    // if a future feature needs to render images from an external URL.
    remotePatterns: []
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"
          }
        ]
      },
      {
        // Sensitive routes: keep out of search-engine indexes even if a
        // client mistakenly links to them, on top of robots.txt disallow.
        source: "/(admin|api|auth)/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }]
      }
    ];
  }
};

export default withNextIntl(nextConfig);
