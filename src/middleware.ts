import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicPaths = ["/", "/login", "/register"];

const protectedPaths = [
  "/dashboard",
  "/crops",
  "/diagnosis",
  "/treatments",
  "/history",
  "/library",
  "/notifications",
  "/profile",
  "/settings",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  const isProtectedPath = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  const token = request.cookies.get("auth_token")?.value;

  if (!token && isProtectedPath) {
    const loginUrl = new URL("/", request.url);

    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    token &&
    (pathname === "/" || pathname === "/login" || pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/crops", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
