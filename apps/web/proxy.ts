import { NextRequest, NextResponse } from "next/server"
import { getSessionAction } from "./api/auth/auth-server-action"

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const session = await getSessionAction()

  if (!session?.user) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (
    pathname.startsWith("/vendor") &&
    !["SELLER", "ADMIN"].includes(session.user.role)
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // admin
  if (pathname.startsWith("/admin") && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/vendor/:path*", "/admin/:path*"],
}
