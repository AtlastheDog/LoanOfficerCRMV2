import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"

// POST /api/leads/[id]/feedbacks
export const POST = withAuth(async (request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id
    const body = await request.json()

    // In a real app, you would save the feedback to your database
    // This is just a placeholder

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error submitting feedback for lead ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 })
  }
})
