import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"

// GET /api/leads/[id]
export const GET = withAuth(async (request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id

    // In a real app, you would fetch the lead from your database
    // This is just a placeholder
    const lead = {
      id: Number.parseInt(id),
      first_name: "John",
      last_name: "Doe",
      email: "john@example.com",
      phone: "555-123-4567",
      loan_type: "Conventional",
      loan_purpose: "Purchase",
      property_type: "SFR",
      property_value: 350000,
      loan_value: 280000,
      fico_score: 750,
      state: "CA",
      occupancy: "Primary",
      minimum_rate_needed: 3.5,
      maximum_points_needed: 1.5,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const scenarios = [
      {
        id: 1,
        actual_interest_rate: 3.25,
        points: 1.0,
        fico_score_group: "High",
        loan_type_group: "Conventional",
        property_value_group: "Medium",
        loan_value_group: "Medium",
        loan_purpose_group: "Purchase",
        state: "CA",
        occupancy: "Primary",
        created_at: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ lead, scenarios })
  } catch (error) {
    console.error(`Error fetching lead ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 })
  }
})

// PUT /api/leads/[id]
export const PUT = withAuth(async (request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id
    const body = await request.json()

    // In a real app, you would update the lead in your database
    // This is just a placeholder
    const updatedLead = {
      id: Number.parseInt(id),
      ...body.lead,
      updated_at: new Date().toISOString(),
    }

    return NextResponse.json(updatedLead)
  } catch (error) {
    console.error(`Error updating lead ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 })
  }
})

// DELETE /api/leads/[id]
export const DELETE = withAuth(async (request, { params }: { params: { id: string } }) => {
  try {
    const id = params.id

    // In a real app, you would delete the lead from your database
    // This is just a placeholder

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`Error deleting lead ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 })
  }
})
