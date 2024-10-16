import { NextResponse } from "next/server";

export function middleware(request) {
  const sessionToken = request.cookies.get("gitknit-session");

  // Protect routes that require authentication
  if (request.nextUrl.pathname.startsWith("/account")) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/signup", request.url));
    }
  }

  // Prevent authenticated users from accessing auth pages
  if (["/login", "/signup"].includes(request.nextUrl.pathname)) {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/login", "/signup"],
};
