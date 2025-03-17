import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const token = await getToken({ req });

  // If not logged in and trying to access /dashboard, redirect to /login
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", url.origin));
  }

  // If logged in and trying to access /login, redirect to /dashboard
  if (token && url.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", url.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/", "/login"],
};
