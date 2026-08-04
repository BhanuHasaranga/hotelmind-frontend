import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/auth/session";

// Next.js 16 renamed Middleware to Proxy — this file replaces what used to
// be middleware.ts. Optimistic check only (reads the cookie, doesn't verify
// the JWT signature) — real enforcement happens on the backend for every
// API call; this just keeps unauthenticated users off app pages.
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  const isPublicRoute = pathname === "/login" || pathname.startsWith("/api/auth");

  if (!hasSession && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
