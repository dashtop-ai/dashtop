import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "fallback-secret-change-me"
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("dashtop-session")?.value;
  let isLoggedIn = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isLoggedIn = true;
    } catch {
      // Invalid/expired token
    }
  }

  const isAuthPage = req.nextUrl.pathname.startsWith("/login");
  const isProtectedRoute =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/settings");

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|images|icons).*)"],
};
