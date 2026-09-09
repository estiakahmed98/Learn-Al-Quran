import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);
const canonicalUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.learnalquranonlinebd.com"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Consolidate only the exact www/non-www counterpart. Preview and local
  // deployment hostnames are deliberately left alone.
  const canonicalHost = canonicalUrl.hostname;
  const alternateHost = canonicalHost.startsWith("www.")
    ? canonicalHost.slice(4)
    : `www.${canonicalHost}`;
  const requestHost = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "")
    .split(":")[0]
    .toLowerCase();
  if (requestHost === alternateHost) {
    const destination = request.nextUrl.clone();
    destination.protocol = canonicalUrl.protocol;
    destination.hostname = canonicalHost;
    destination.port = canonicalUrl.port;
    return NextResponse.redirect(destination, 308);
  }

  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/teacher") || pathname.startsWith("/student")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (pathname.startsWith("/admin")) {
      const role = (token as any)?.role;
      if (!token || role !== "ADMIN") {
        if (role === "TEACHER") {
          return NextResponse.redirect(new URL("/teacher", request.url));
        }
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    if (pathname.startsWith("/teacher")) {
      const role = (token as any)?.role;
      if (!token || (role !== "TEACHER" && role !== "ADMIN")) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    if (pathname.startsWith("/student")) {
      if (!token) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  }

  const hasLocalePrefix = routing.locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (!hasLocalePrefix) {
    const destination = request.nextUrl.clone();
    destination.pathname = `/${routing.defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(destination, 308);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/teacher",
    "/teacher/:path*",
    "/student",
    "/student/:path*",
    "/auth",
    "/auth/:path*",
    "/((?!api|_next|_vercel|auth|.*\\..*).*)"
  ]
};
