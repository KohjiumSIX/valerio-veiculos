import { NextResponse, type NextRequest } from "next/server";

const ADMIN_LOGIN_PATH = "/admin/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname === ADMIN_LOGIN_PATH;

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  if (isLoginRoute) {
    return NextResponse.next();
  }

  const hasSbAccessToken = request.cookies
    .getAll()
    .some((cookie) => cookie.name.includes("sb-") && cookie.name.endsWith("-auth-token"));

  if (!hasSbAccessToken) {
    const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};