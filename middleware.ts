import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { canAccessAnySection, sectionsForPath } from "@/lib/permissions";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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

export const config = {
  matcher: ["/admin", "/admin/:path*", "/student", "/student/:path*"]
};
