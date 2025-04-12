import type { FileType } from "@/types/file"

export function getFileType(file: FileType): "image" | "video" | "audio" | "pdf" | "text" | "other" {
  if (!file.extension) {
    return "other"
  }

  const extension = file.extension.toLowerCase()

  // Image files
  if (["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "ico"].includes(extension)) {
    return "image"
  }

  // Video files
  if (["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv"].includes(extension)) {
    return "video"
  }

  // Audio files
  if (["mp3", "wav", "ogg", "flac", "aac", "m4a"].includes(extension)) {
    return "audio"
  }

  // PDF files
  if (extension === "pdf") {
    return "pdf"
  }

  // Text files
  if (["txt", "md", "html", "css", "js", "jsx", "ts", "tsx", "json", "xml", "yaml", "yml"].includes(extension)) {
    return "text"
  }

  // Default
  return "other"
}
