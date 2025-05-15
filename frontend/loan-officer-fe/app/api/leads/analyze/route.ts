import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"

// GET /api/leads/analyze
export const GET = withAuth(async (request) => {
  try {
    // In a real app, you would fetch matched leads from your database
    // This is just a placeholder
    const matchedLeads = [
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        fico_score: 750,
        loan_purpose: "Purchase",
        minimum_rate_needed: 3.5,
        maximum_points_needed: 1.5,
        feedback: {
          satisfied_rate: true,
          satisfied_points: null,
        },
      },
      {
        id: 2,
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@example.com",
        fico_score: 720,
        loan_purpose: "No cash-out refinance",
        minimum_rate_needed: 3.75,
        maximum_points_needed: 1.0,
        feedback: null,
      },
    ]

    return NextResponse.json(matchedLeads)
  } catch (error) {
    console.error("Error fetching matched leads:", error)
    return NextResponse.json({ error: "Failed to fetch matched leads" }, { status: 500 })
  }
})
