import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function checkAuth() {
  const cookieStore = cookies()
  const token = cookieStore.get("token")

  return !!token
}

export function withAuth(handler: (request: NextRequest) => Promise<NextResponse> | NextResponse) {
  return async (request: NextRequest) => {
    const isAuthenticated = await checkAuth()

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return handler(request)
  }
}
