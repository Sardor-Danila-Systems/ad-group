import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Early gate for /admin: requests without a session cookie get a real redirect to the login form.
 * This is only a fast path. The cookie signature is verified in the admin layout and in every action.
 */
export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();
  if (!request.cookies.get("admin_session")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
