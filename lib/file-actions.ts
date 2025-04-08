"use server"

import fs from "fs"
import path from "path"
import { promisify } from "util"

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

type FileInfo = {
  name: string
  path: string
  size: number
  type: string
  lastModified: string
}

export async function getPublicFiles(): Promise<FileInfo[]> {
  const publicDir = path.join(process.cwd(), "public")

  try {
    return await scanDirectory(publicDir)
  } catch (error) {
    console.error("Error scanning public directory:", error)
    return []
  }
}

async function scanDirectory(dir: string, basePath = ""): Promise<FileInfo[]> {
  const files: FileInfo[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.join(basePath, entry.name)
    const urlPath = "/" + relativePath.replace(/\\/g, "/")

    if (entry.isDirectory()) {
      const subDirFiles = await scanDirectory(fullPath, relativePath)
      files.push(...subDirFiles)
    } else {
      const fileStat = await stat(fullPath)
      const fileType = getFileType(entry.name)

      files.push({
        name: entry.name,
        path: urlPath,
        size: fileStat.size,
        type: fileType,
        lastModified: fileStat.mtime.toISOString(),
      })
    }
  }

  return files
}

function getFileType(filename: string): string {
  const extension = path.extname(filename).toLowerCase()

  const mimeTypes: Record<string, string> = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".md": "text/markdown",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".zip": "application/zip",
    ".ttf": "font/ttf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".xml": "application/xml",
    ".csv": "text/csv",
  }

  return mimeTypes[extension] || "application/octet-stream"
}
