"use client"

import type { FileType } from "@/types/file"
import { getFileIcon } from "@/lib/file-icons"
import { formatFileSize } from "@/lib/format-file-size"
import { FileActions } from "./file-actions"
import { TableCell, TableRow } from "@/components/ui/table"
import { formatDate } from "@/lib/format-date"

interface FileRowProps {
  file: FileType
  onFolderClick: (folderName: string) => void
}

export function FileRow({ file, onFolderClick }: FileRowProps) {
  const FileIcon = getFileIcon(file)

  const handleClick = () => {
    if (file.type === "directory") {
      onFolderClick(file.name)
    }
  }

  return (
    <TableRow>
      <TableCell>
        <div
          className={`flex items-center gap-2 ${file.type === "directory" ? "cursor-pointer" : ""}`}
          onClick={handleClick}
        >
          <FileIcon className="h-5 w-5 text-muted-foreground" />
          <span className="truncate">{file.name}</span>
        </div>
      </TableCell>
      <TableCell>
        {file.type === "file" && file.size ? formatFileSize(file.size) : file.type === "directory" ? "—" : "Unknown"}
      </TableCell>
      <TableCell>{file.lastModified ? formatDate(file.lastModified) : "—"}</TableCell>
      <TableCell className="text-right">{file.type === "file" ? <FileActions file={file} /> : "—"}</TableCell>
    </TableRow>
  )
}
