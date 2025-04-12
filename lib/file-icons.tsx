import type { FileType } from "@/types/file"
import {
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileIcon as FilePdf,
  FileArchive,
  FileSpreadsheet,
  FileSlidersIcon as FileSlides,
  Folder,
} from "lucide-react"

export function getFileIcon(file: FileType) {
  if (file.type === "directory") {
    return Folder
  }

  if (!file.extension) {
    return File
  }

  const extension = file.extension.toLowerCase()

  // Image files
  if (["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "ico"].includes(extension)) {
    return FileImage
  }

  // Video files
  if (["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv"].includes(extension)) {
    return FileVideo
  }

  // Audio files
  if (["mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(extension)) {
    return FileAudio
  }

  // Document files
  if (["doc", "docx", "txt", "rtf", "md", "markdown"].includes(extension)) {
    return FileText
  }

  // PDF files
  if (extension === "pdf") {
    return FilePdf
  }

  // Code files
  if (
    [
      "html",
      "css",
      "js",
      "jsx",
      "ts",
      "tsx",
      "json",
      "xml",
      "yaml",
      "yml",
      "php",
      "py",
      "rb",
      "java",
      "c",
      "cpp",
      "cs",
      "go",
    ].includes(extension)
  ) {
    return FileCode
  }

  // Archive files
  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension)) {
    return FileArchive
  }

  // Spreadsheet files
  if (["xls", "xlsx", "csv"].includes(extension)) {
    return FileSpreadsheet
  }

  // Presentation files
  if (["ppt", "pptx"].includes(extension)) {
    return FileSlides
  }

  // Default file icon
  return File
}
