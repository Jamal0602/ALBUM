import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function PUT(request: Request) {
  try {
    // Only allow in development mode for security
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "File operations are only allowed in development mode" }, { status: 403 })
    }

    const { path: filePath, content } = await request.json()

    // Validate inputs
    if (!filePath) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 })
    }

    if (content === undefined) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Ensure the path is within the public directory for security
    if (!filePath.startsWith("public")) {
      return NextResponse.json({ error: "Path must be within the public directory" }, { status: 400 })
    }

    // Create the full path
    const fullPath = path.join(process.cwd(), filePath)

    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "File does not exist" }, { status: 404 })
    }

    // Check if it's a file
    const stats = fs.statSync(fullPath)
    if (!stats.isFile()) {
      return NextResponse.json({ error: "Path is not a file" }, { status: 400 })
    }

    // Write the content to the file
    fs.writeFileSync(fullPath, content)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving file:", error)
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 })
  }
}
