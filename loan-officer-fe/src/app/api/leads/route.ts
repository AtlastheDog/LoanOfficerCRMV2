import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"

// GET /api/leads
export const GET = withAuth(async (request) => {
  try {
    // In a real app, you would fetch data from your database
    // This is just a placeholder
    const leads = [
      {
        id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
        phone: "555-123-4567",
        loan_type: "Conventional",
        loan_purpose: "Purchase",
        fico_score: 750,
        property_value: 350000,
        loan_value: 280000,
        minimum_rate_needed: 3.5,
        maximum_points_needed: 1.5,
        created_at: new Date().toISOString(),
      },
      // Add more sample leads as needed
    ]

    return NextResponse.json(leads)
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
})

// POST /api/leads
export const POST = withAuth(async (request) => {
  try {
    const body = await request.json()

    // In a real app, you would save the lead to your database
    // This is just a placeholder
    const newLead = {
      id: Math.floor(Math.random() * 1000),
      ...body.lead,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(newLead, { status: 201 })
  } catch (error) {
    console.error("Error creating lead:", error)
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 })
  }
})
