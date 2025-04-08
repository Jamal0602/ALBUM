"use server"

import fs from "fs"
import path from "path"
import { promisify } from "util"
import type { FileType } from "./types"
import JSZip from "jszip"

const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const readFile = promisify(fs.readFile)

export async function getAllPublicFiles(): Promise<FileType[]> {
  const publicDir = path.join(process.cwd(), "public")

  try {
    return await scanDirectory(publicDir)
  } catch (error) {
    console.error("Error scanning public directory:", error)
    return []
  }
}

async function scanDirectory(dir: string, basePath = ""): Promise<FileType[]> {
  const files: FileType[] = []

  try {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      const relativePath = path.join(basePath, entry.name)
      const urlPath = "/" + relativePath.replace(/\\/g, "/")
      const dirPath = basePath || "/"

      if (entry.isDirectory()) {
        const children = await scanDirectory(fullPath, relativePath)

        files.push({
          name: entry.name,
          path: urlPath,
          dirPath,
          size: 0, // Directories don't have a size
          type: "directory",
          lastModified: new Date().toISOString(), // We'll update this later
          isDirectory: true,
          children,
        })

        // Add all children to the main files array too
        files.push(...children)
      } else {
        const fileStat = await stat(fullPath)
        const fileType = await getFileType(entry.name)

        files.push({
          name: entry.name,
          path: urlPath,
          dirPath,
          size: fileStat.size,
          type: fileType,
          lastModified: fileStat.mtime.toISOString(),
          isDirectory: false,
        })
      }
    }

    return files
  } catch (error) {
    console.error(`Error scanning directory ${dir}:`, error)
    return []
  }
}

export async function getFileType(filename: string): Promise<string> {
  const extension = path.extname(filename).toLowerCase()

  const mimeTypes: Record<string, string> = {
    // Images
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".bmp": "image/bmp",

    // Documents
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".ppt": "application/vnd.ms-powerpoint",
    ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",

    // Text
    ".txt": "text/plain",
    ".md": "text/markdown",
    ".csv": "text/csv",
    ".html": "text/html",
    ".htm": "text/html",
    ".xml": "application/xml",
    ".rtf": "application/rtf",

    // Code
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".jsx": "application/javascript",
    ".ts": "application/typescript",
    ".tsx": "application/typescript",
    ".json": "application/json",
    ".css": "text/css",
    ".scss": "text/scss",
    ".less": "text/less",
    ".py": "text/x-python",
    ".java": "text/x-java",
    ".c": "text/x-c",
    ".cpp": "text/x-c++",
    ".php": "application/x-php",
    ".rb": "application/x-ruby",
    ".go": "text/x-go",
    ".rs": "text/x-rust",

    // Config
    ".yml": "application/x-yaml",
    ".yaml": "application/x-yaml",
    ".toml": "application/toml",
    ".ini": "text/plain",
    ".env": "text/plain",

    // Archives
    ".zip": "application/zip",
    ".rar": "application/x-rar-compressed",
    ".7z": "application/x-7z-compressed",
    ".tar": "application/x-tar",
    ".gz": "application/gzip",

    // Audio
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".ogg": "audio/ogg",
    ".flac": "audio/flac",
    ".aac": "audio/aac",
    ".m4a": "audio/mp4",

    // Video
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".ogv": "video/ogg",
    ".avi": "video/x-msvideo",
    ".mov": "video/quicktime",
    ".wmv": "video/x-ms-wmv",
    ".mkv": "video/x-matroska",

    // Fonts
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".eot": "application/vnd.ms-fontobject",

    // Other
    ".exe": "application/x-msdownload",
    ".dll": "application/x-msdownload",
    ".so": "application/octet-stream",
    ".bin": "application/octet-stream",
    ".dat": "application/octet-stream",
  }

  return mimeTypes[extension] || "application/octet-stream"
}

export async function downloadAllFiles(files: FileType[]): Promise<Blob> {
  // Only include actual files, not directories
  const filesToDownload = files.filter((file) => !file.isDirectory)

  if (filesToDownload.length === 0) {
    throw new Error("No files to download")
  }

  try {
    // This part will run on the server
    const zip = new JSZip()

    // Add each file to the zip
    for (const file of filesToDownload) {
      try {
        // Read the file from the server's file system
        const filePath = path.join(process.cwd(), "public", file.path.replace(/^\//, ""))
        const fileContent = await readFile(filePath)

        // Add to zip, preserving directory structure
        const zipPath = file.path.startsWith("/") ? file.path.substring(1) : file.path
        zip.file(zipPath, fileContent)
      } catch (error) {
        console.error(`Error adding file ${file.path} to zip:`, error)
      }
    }

    // Generate the zip file
    const content = await zip.generateAsync({ type: "nodebuffer" })

    // Return as blob-like object
    return new Blob([content], { type: "application/zip" })
  } catch (error) {
    console.error("Error creating zip file:", error)
    throw error
  }
}
