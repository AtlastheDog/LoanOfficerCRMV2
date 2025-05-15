import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"

// GET /api/results
export const GET = withAuth(async (request) => {
  try {
    // In a real app, you would fetch OCR results from your database
    // This is just a placeholder
    const results = {
      ocr_results: [
        { rate: 3.25, points: 1.0 },
        { rate: 3.375, points: 0.75 },
        { rate: 3.5, points: 0.5 },
        { rate: 3.625, points: 0.25 },
        { rate: 3.75, points: 0.0 },
      ],
      scenario_data: {
        ficoScoreGroup: "High",
        loanTypeGroup: "Conventional",
        propertyValueGroup: "Medium",
        loanValueGroup: "Medium",
        loanPurposeGroup: "Purchase",
        state: "CA",
        occupancy: "Primary",
      },
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching OCR results:", error)
    return NextResponse.json({ error: "Failed to fetch OCR results" }, { status: 500 })
  }
})
