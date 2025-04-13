import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { writeFile } from "fs/promises"

export async function POST(request: Request) {
  try {
    // Only allow in development mode for security
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json({ error: "File operations are only allowed in development mode" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const uploadPath = formData.get("path") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Ensure the path is within the public directory for security
    if (!uploadPath.startsWith("public")) {
      return NextResponse.json({ error: "Path must be within the public directory" }, { status: 400 })
    }

    // Create the full path
    const fullPath = path.join(process.cwd(), uploadPath, file.name)

    // Check if the file already exists
    if (fs.existsSync(fullPath)) {
      return NextResponse.json({ error: "File already exists" }, { status: 409 })
    }

    // Convert the file to a Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Write the file to disk
    await writeFile(fullPath, buffer)

    // Get file stats
    const stats = fs.statSync(fullPath)

    // Create file object
    const fileObject = {
      name: file.name,
      path: `${uploadPath}/${file.name}`,
      type: "file",
      size: stats.size,
      extension: path.extname(file.name).slice(1),
      lastModified: stats.mtime.toISOString(),
    }

    return NextResponse.json({ success: true, file: fileObject })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
