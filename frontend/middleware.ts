import { NextResponse, NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/reset-password",
  "/register",
  "/forgot-password",
];

export function middleware(request: NextRequest, response: NextResponse) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");

  const isLoggedIn = !!accessToken || !!refreshToken;

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL("/", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && pathname === "/") {
    const dashboardUrl = new URL("/", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (logo.png, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
