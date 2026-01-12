import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    const isAuthPage =
      pathname.startsWith("/login") ||
      pathname.startsWith("/signup");

    //Not Allow- Logged-in user visiting login/signup
    if (token && isAuthPage) {
      return NextResponse.redirect(new URL("/feed", req.url));
    }

    //Not Allow - Unverified users
    if (
      token &&
      !token.emailVerified &&
      !pathname.startsWith("/verification-pending") &&
      !pathname.startsWith("/verify-email") &&
      !isAuthPage
    ) {
      return NextResponse.redirect(new URL("/verification-pending", req.url));
    }

    //Allow Only Admin to access /admin routes
    if (pathname.startsWith("/admin")) {
      if (token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/feed", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        const isAuthPage =
          pathname.startsWith("/login") ||
          pathname.startsWith("/signup");

        // Allow everyone to access auth pages
        if (isAuthPage) return true;

        // Protect matched routes
        return !!token;
      },
    },
  }
);
export const config = {
    matcher: [
        "/login/:path*",
        "/signup/:path*",

        "/block",
        "/chats/:path*",
        "/feed",
        "/guidelines",
        "/listing/:path*",
        "/profile/:path*",
        "/saved-listings/:path*",
        
        "/admin/:path*",

        "/verification-pending/:path*",
        "/verify-email/:path*",
    ]
};
