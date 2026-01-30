import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken = req.cookies.get("accessToken")?.value;
  const tradeToken = req.cookies.get("tradeToken")?.value;
  const accountId = req.cookies.get("accountId")?.value;

  // ===== TRADE ROUTES =====
  if (pathname.startsWith("/dashboard/trade")) {
    // broker can access
    if (accessToken) {
      return NextResponse.next();
    }

    // trade user can access ONLY if accountId exists
    if (tradeToken && accountId) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/trade-login", req.url));
  }

  // ===== BROKER DASHBOARD =====
  if (pathname.startsWith("/dashboard")) {
    if (!accessToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // ===== BLOCK LOGIN IF ALREADY LOGGED IN =====
  if (pathname === "/login" && accessToken) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (pathname === "/trade-login" && tradeToken && accountId) {
    return NextResponse.redirect(
      new URL(`/dashboard/trade/${accountId}`, req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/trade-login",
  ],
};
