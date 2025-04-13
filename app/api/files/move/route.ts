import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function PATCH(request: Request) {
  try {
    // Only allow in development mode for security
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "File operations are only allowed in development mode" }, { status: 403 })
    }

    const { sourcePath, destinationPath } = await request.json()

    // Validate inputs
    if (!sourcePath || !destinationPath) {
      return NextResponse.json({ error: "Source and destination paths are required" }, { status: 400 })
    }

    // Ensure the paths are within the public directory for security
    if (!sourcePath.startsWith("public") || !destinationPath.startsWith("public")) {
      return NextResponse.json({ error: "Paths must be within the public directory" }, { status: 400 })
    }

    // Create the full paths
    const fullSourcePath = path.join(process.cwd(), sourcePath)
    const fullDestinationPath = path.join(process.cwd(), destinationPath)

    // Check if the source exists
    if (!fs.existsSync(fullSourcePath)) {
      return NextResponse.json({ error: "Source item does not exist" }, { status: 404 })
    }

    // Check if the destination directory exists
    if (!fs.existsSync(fullDestinationPath)) {
      return NextResponse.json({ error: "Destination directory does not exist" }, { status: 404 })
    }

    // Get the item name from the source path
    const itemName = path.basename(fullSourcePath)

    // Create the new full path
    const newFullPath = path.join(fullDestinationPath, itemName)

    // Check if an item with the same name already exists at the destination
    if (fs.existsSync(newFullPath)) {
      return NextResponse.json({ error: "An item with this name already exists at the destination" }, { status: 409 })
    }

    // Move the item
    fs.renameSync(fullSourcePath, newFullPath)

    // Create the new relative path
    const newRelativePath = path.join(destinationPath, itemName).replace(/\\/g, "/")

    return NextResponse.json({ success: true, newPath: newRelativePath })
  } catch (error) {
    console.error("Error moving item:", error)
    return NextResponse.json({ error: "Failed to move item" }, { status: 500 })
  }
}
