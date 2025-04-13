import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function PATCH(request: Request) {
  try {
    // Only allow in development mode for security
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "File operations are only allowed in development mode" }, { status: 403 })
    }

    const { path: itemPath, newName } = await request.json()

    // Validate inputs
    if (!itemPath || !newName) {
      return NextResponse.json({ error: "Path and new name are required" }, { status: 400 })
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

    // Get the directory and create the new path
    const directory = path.dirname(fullPath)
    const newFullPath = path.join(directory, newName)

    // Check if the new path already exists
    if (fs.existsSync(newFullPath)) {
      return NextResponse.json({ error: "An item with this name already exists" }, { status: 409 })
    }

    // Rename the item
    fs.renameSync(fullPath, newFullPath)

    // Create the new relative path
    const newRelativePath = path.join(path.dirname(itemPath), newName).replace(/\\/g, "/")

    return NextResponse.json({ success: true, newPath: newRelativePath })
  } catch (error) {
    console.error("Error renaming item:", error)
    return NextResponse.json({ error: "Failed to rename item" }, { status: 500 })
  }
}
