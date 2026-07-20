import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
