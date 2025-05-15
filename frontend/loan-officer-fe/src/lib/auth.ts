import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

type RouteHandler = (request: NextRequest, context: any) => Promise<NextResponse> | NextResponse

export function withAuth(handler: RouteHandler) {
  return async (request: NextRequest, context: any) => {
    const cookieStore = cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you would verify the token here
    // For example, by checking it against your database or validating a JWT

    return handler(request, context)
  }
}
