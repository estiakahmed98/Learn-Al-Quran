import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");
const mediaOrigin = new URL(process.env.API_URL || "http://127.0.0.1:8000/api/v1");

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
    // Uploaded media and its placeholder are served by the Laravel origin.
    // Keep this allowlist tied to API_URL instead of allowing arbitrary hosts.
    remotePatterns: [
      {
        protocol: mediaOrigin.protocol.replace(":", ""),
        hostname: mediaOrigin.hostname,
        port: mediaOrigin.port,
        pathname: "/storage/**"
      },
      {
        protocol: mediaOrigin.protocol.replace(":", ""),
        hostname: mediaOrigin.hostname,
        port: mediaOrigin.port,
        pathname: "/images/**"
      }
    ]
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
