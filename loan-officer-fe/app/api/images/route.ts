import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"

// POST /api/images
export const POST = withAuth(async (request) => {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    // In a real app, you would process the image and save it to your storage
    // This is just a placeholder

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error uploading image:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
})
