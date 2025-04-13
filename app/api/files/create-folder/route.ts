import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    // Only allow in development mode for security
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "File operations are only allowed in development mode" }, { status: 403 })
    }

    const { path: folderPath, folderName } = await request.json()

    // Validate inputs
    if (!folderPath || !folderName) {
      return NextResponse.json({ error: "Path and folder name are required" }, { status: 400 })
    }

    // Ensure the path is within the public directory for security
    if (!folderPath.startsWith("public")) {
      return NextResponse.json({ error: "Path must be within the public directory" }, { status: 400 })
    }

    // Create the full path
    const fullPath = path.join(process.cwd(), folderPath, folderName)

    // Check if the folder already exists
    if (fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "Folder already exists" }, { status: 409 })
    }

    // Create the folder
    fs.mkdirSync(fullPath, { recursive: true })

    return NextResponse.json({ success: true, path: `${folderPath}/${folderName}` })
  } catch (error) {
    console.error("Error creating folder:", error)
    return NextResponse.json({ error: "Failed to create folder" }, { status: 500 })
  }
}
