import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const protectedPaths = ["/dashboard", "/interview", "/jobs", "/resume", "/skills"];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  // If path is protected and no token is present, redirect to login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If user is logged in and tries to access login/register, redirect to dashboard
  if (pathname.startsWith("/auth") && token) {
    if (pathname === "/auth/login" || pathname === "/auth/register" || pathname === "/auth") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/interview/:path*",
    "/jobs/:path*",
    "/resume/:path*",
    "/skills/:path*",
    "/auth/:path*",
  ],
};
