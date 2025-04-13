import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function DELETE(request: Request) {
  try {
    // Only allow in development mode for security
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "File operations are only allowed in development mode" }, { status: 403 })
    }

    const { path: itemPath } = await request.json()

    // Validate inputs
    if (!itemPath) {
      return NextResponse.json({ error: "Path is required" }, { status: 400 })
    }

    // Ensure the path is within the public directory for security
    if (!itemPath.startsWith("public")) {
      return NextResponse.json({ error: "Path must be within the public directory" }, { status: 400 })
    }

    // Create the full path
    const fullPath = path.join(process.cwd(), itemPath)

    // Check if the item exists
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "Item does not exist" }, { status: 404 })
    }

    // Check if it's a directory or file
    const stats = fs.statSync(fullPath)
    if (stats.isDirectory()) {
      // Remove directory recursively
      fs.rmSync(fullPath, { recursive: true, force: true })
    } else {
      // Remove file
      fs.unlinkSync(fullPath)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting item:", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}
