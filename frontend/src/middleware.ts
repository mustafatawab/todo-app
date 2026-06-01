import { NextResponse, NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/reset-password",
  "/forgot-password",
];

const AUTH_ROUTES = [
  "/login",
  "/register"
]


const DEFAULT_REDIRECT = "/";

export function middleware(request: NextRequest, response: NextResponse) {
  console.log("Middleware running on path:", request.nextUrl.pathname);
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");

  const isAuthenticated = !!accessToken || !!refreshToken;

  const isAuthRoute = AUTH_ROUTES.includes(pathname)

  if (isAuthenticated && isAuthRoute) {
     return NextResponse.redirect(new URL(DEFAULT_REDIRECT, request.url));
  }

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  if (!isAuthenticated && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
  
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
