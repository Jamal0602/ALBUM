import {
  FileText,
  ImageIcon,
  FileCode,
  FileJson,
  FileSpreadsheet,
  FileArchive,
  FileAudio,
  FileVideo,
  FileIcon as FileDefault,
  FileCog,
  FileTypeIcon,
  FileX,
  FileCheck,
  type LucideIcon,
} from "lucide-react"

export function FileIcon({ type, className }: { type: string; className?: string }) {
  const Icon = getIconForFileType(type)
  return <Icon className={className} />
}

export function getIconForFileType(type: string): LucideIcon {
  // Image files
  if (type.startsWith("image/")) {
    return ImageIcon
  }

  // Code and markup files
  else if (
    type.startsWith("text/html") ||
    type.includes("xml") ||
    type.includes("javascript") ||
    type.includes("typescript") ||
    type.includes("css")
  ) {
    return FileCode
  }

  // Text files
  else if (type.startsWith("text/") || type.includes("document")) {
    return FileText
  }

  // JSON files
  else if (type.includes("json")) {
    return FileJson
  }

  // Spreadsheet files
  else if (type.includes("spreadsheet") || type.includes("excel") || type.includes("csv")) {
    return FileSpreadsheet
  }

  // Archive files
  else if (
    type.includes("zip") ||
    type.includes("compressed") ||
    type.includes("archive") ||
    type.includes("tar") ||
    type.includes("gzip")
  ) {
    return FileArchive
  }

  // Audio files
  else if (type.startsWith("audio/")) {
    return FileAudio
  }

  // Video files
  else if (type.startsWith("video/")) {
    return FileVideo
  }

  // Configuration files
  else if (
    type.includes("config") ||
    type.includes("yaml") ||
    type.includes("yml") ||
    type.includes("toml") ||
    type.includes("ini")
  ) {
    return FileCog
  }

  // Font files
  else if (type.includes("font") || type.includes("woff") || type.includes("ttf") || type.includes("otf")) {
    return FileTypeIcon
  }

  // Executable files
  else if (
    type.includes("executable") ||
    type.includes("application/x-msdownload") ||
    type.includes("application/x-executable")
  ) {
    return FileCheck
  }

  // Unknown binary files
  else if (type.includes("octet-stream")) {
    return FileX
  }

  // Default file icon
  else {
    return FileDefault
  }
}
