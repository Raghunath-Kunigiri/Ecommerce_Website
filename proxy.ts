import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const devSecret = "dev-secret-change-me";
const authSecret =
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV === "development" ? devSecret : undefined);

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const token = await getToken({
    req,
    secret: authSecret,
  });

  if (!token) {
    const url = new URL("/login", nextUrl);
    url.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

