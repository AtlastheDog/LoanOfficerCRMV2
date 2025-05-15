import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/signup")

  // If trying to access auth page while logged in, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If trying to access protected page without being logged in, redirect to login
  if (!isAuthPage && !token && !request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

// Add your protected routes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
