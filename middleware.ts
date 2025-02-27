import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  if (!token && url.pathname.startsWith("/dashboard")) {
    NextResponse.redirect(new URL("/dashboard/login", url.origin).href);
    return NextResponse.next();
  }
  if (token && url.pathname.startsWith("/dashboard/login")) {
    return NextResponse.redirect(new URL("/dashboard", url.origin).href);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
