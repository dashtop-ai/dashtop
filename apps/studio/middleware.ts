import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");
  const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");

  // Allow auth API routes
  if (isApiAuth) return;

  // Redirect to login if not authenticated
  if (!isLoggedIn && !isAuthPage) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }

  // Redirect away from auth pages if already logged in
  if (isAuthPage && isLoggedIn) {
    return Response.redirect(new URL("/", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|images|icons).*)"],
};
