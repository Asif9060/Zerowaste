import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session?.user;
  const role = session?.user?.role;

  // Protect /dashboard/* — must be logged in, non-admin
  if (nextUrl.pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
  }

  // Protect /admin/* — must be logged in as admin
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", nextUrl));
    }
    if (role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
