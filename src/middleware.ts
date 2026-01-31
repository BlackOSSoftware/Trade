import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const tradeToken = req.cookies.get("tradeToken")?.value;

  // TRADE LOGIN PAGE
  if (pathname === "/trade-login") {
    if (tradeToken) {
      return NextResponse.redirect(new URL("/trade", req.url));
    }
    return NextResponse.next();
  }

  // TRADE PANEL
  if (pathname.startsWith("/trade")) {
    if (!tradeToken) {
      return NextResponse.redirect(new URL("/trade-login", req.url));
    }
    return NextResponse.next();
  }

  // BROKER DASHBOARD
  if (pathname.startsWith("/dashboard")) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // LOGIN BLOCK
  if (pathname === "/login" && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/trade/:path*",
    "/login",
    "/trade-login",
  ],
};
