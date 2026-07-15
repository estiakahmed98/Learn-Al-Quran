import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { canAccessAnySection, sectionsForPath } from "@/lib/permissions";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/student")) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (pathname.startsWith("/admin")) {
      const role = (token as any)?.role;
      if (!token || (role !== "ADMIN" && role !== "TEACHER")) {
        const loginUrl = new URL("/auth/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (role === "TEACHER") {
        const sections = sectionsForPath(pathname);
        const permissions = (token as any).permissions || [];
        if (sections && !canAccessAnySection(role, permissions, sections)) {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
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

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/student",
    "/student/:path*",
    "/auth",
    "/auth/:path*",
    "/((?!api|_next|_vercel|auth|.*\\..*).*)"
  ]
};
