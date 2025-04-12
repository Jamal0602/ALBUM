import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { FileType } from "@/types/file"
import { fetchGitHubDirectory, convertGitHubFilesToFileType } from "@/lib/github-service"

// Helper function to find files in the manifest based on path
function findFilesInManifest(manifest: FileType[], targetPath: string): FileType[] {
  // If we're looking for the root public folder
  if (targetPath === "public") {
    return manifest
  }

  // Remove 'public/' from the beginning of the path
  const normalizedPath = targetPath.startsWith("public/") ? targetPath.substring(7) : targetPath

  if (!normalizedPath) {
    return manifest
  }

  // Split the path into segments
  const segments = normalizedPath.split("/")

  // Navigate through the manifest tree
  let currentLevel = manifest
  for (const segment of segments) {
    // Find the directory in the current level
    const directory = currentLevel.find((item) => item.type === "directory" && item.name === segment)

    if (!directory || !directory.children) {
      return []
    }

    currentLevel = directory.children
  }

  return currentLevel
}

export async function GET(request: NextRequest) {
  try {
    // Get the path from the query parameters
    const searchParams = request.nextUrl.searchParams
    let dirPath = searchParams.get("path") || "public"

    // Ensure the path is within the public directory for security
    if (!dirPath.startsWith("public")) {
      dirPath = "public"
    }

    // Check if we should use GitHub
    const useGitHub = searchParams.get("source") === "github" || process.env.USE_GITHUB_FILES === "true"

    // If using GitHub, fetch from the GitHub API
    if (useGitHub) {
      try {
        // Convert the path from "public/folder" to just "public" or "public/folder"
        const githubPath = dirPath === "public" ? "public" : dirPath

        // Fetch the directory contents from GitHub
        const files = await fetchGitHubDirectory(githubPath)

        // Convert GitHub files to our application's format
        const fileList = convertGitHubFilesToFileType(files, dirPath)

        return NextResponse.json(fileList)
      } catch (error) {
        console.error("Error fetching from GitHub:", error)
        return NextResponse.json({ error: "Failed to fetch files from GitHub" }, { status: 500 })
      }
    }

    // In development, we can use the file system directly
    if (process.env.NODE_ENV === "development") {
      // Get the absolute path to the directory
      const absolutePath = path.join(process.cwd(), dirPath)

      // Check if the directory exists
      if (!fs.existsSync(absolutePath)) {
        return NextResponse.json({ error: "Directory not found" }, { status: 404 })
      }

      // Read the directory
      const files = fs.readdirSync(absolutePath)

      // Get file information
      const fileList: FileType[] = files.map((fileName) => {
        const filePath = path.join(absolutePath, fileName)
        const relativePath = path.join(dirPath, fileName).replace(/\\/g, "/")
        const stats = fs.statSync(filePath)
        const isDirectory = stats.isDirectory()

        const fileInfo: FileType = {
          name: fileName,
          path: relativePath,
          type: isDirectory ? "directory" : "file",
          lastModified: stats.mtime.toISOString(),
        }

        if (!isDirectory) {
          fileInfo.size = stats.size
          fileInfo.extension = path.extname(fileName).slice(1)
        }

        return fileInfo
      })

      // Sort directories first, then files alphabetically
      fileList.sort((a, b) => {
        if (a.type === "directory" && b.type !== "directory") return -1
        if (a.type !== "directory" && b.type === "directory") return 1
        return a.name.localeCompare(b.name)
      })

      return NextResponse.json(fileList)
    }
    // In production, use the pre-generated manifest
    else {
      try {
        // Fetch the manifest file
        const manifestUrl = new URL("/file-manifest.json", request.nextUrl.origin).toString()
        const manifestResponse = await fetch(manifestUrl)

        if (!manifestResponse.ok) {
          throw new Error(`Failed to fetch manifest: ${manifestResponse.status}`)
        }

        const manifest = await manifestResponse.json()

        // Find the files for the requested path
        const files = findFilesInManifest(manifest, dirPath)

        return NextResponse.json(files)
      } catch (error) {
        console.error("Error reading manifest:", error)
        return NextResponse.json({ error: "Failed to read file manifest" }, { status: 500 })
      }
    }
  } catch (error) {
    console.error("Error reading directory:", error)
    return NextResponse.json({ error: "Failed to read directory" }, { status: 500 })
  }
}
