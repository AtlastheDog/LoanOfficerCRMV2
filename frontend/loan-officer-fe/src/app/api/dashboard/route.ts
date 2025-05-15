import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"

// GET /api/dashboard
export const GET = withAuth(async (request) => {
  try {
    // In a real app, you would fetch this data from your database
    // This is just a placeholder
    const dashboardStats = {
      totalLeads: 24,
      leadsWithScenarios: 18,
      totalRateSheets: 5,
      matchedLeads: 12,
    }

    return NextResponse.json(dashboardStats)
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
})
