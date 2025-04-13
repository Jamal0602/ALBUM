import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function POST(request: Request) {
  try {
    // Only allow in development mode for security
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "File operations are only allowed in development mode" }, { status: 403 })
    }

    const { path: filePath, fileName, content = "" } = await request.json()

    // Validate inputs
    if (!filePath || !fileName) {
      return NextResponse.json({ error: "Path and file name are required" }, { status: 400 })
    }

    // Ensure the path is within the public directory for security
    if (!filePath.startsWith("public")) {
      return NextResponse.json({ error: "Path must be within the public directory" }, { status: 400 })
    }

    // Create the full path
    const fullPath = path.join(process.cwd(), filePath, fileName)

    // Check if the file already exists
    if (fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "File already exists" }, { status: 409 })
    }

    // Create the file
    fs.writeFileSync(fullPath, content)

    return NextResponse.json({ success: true, path: `${filePath}/${fileName}` })
  } catch (error) {
    console.error("Error creating file:", error)
    return NextResponse.json({ error: "Failed to create file" }, { status: 500 })
  }
}
