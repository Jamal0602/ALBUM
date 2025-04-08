"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { FileType } from "@/lib/types"
import { formatFileSize, formatDate } from "@/lib/utils"
import { FileIcon } from "./file-icon"
import { Folder } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileListProps {
  files: FileType[]
  onFolderClick: (path: string) => void
  onFileClick: (file: FileType) => void
  selectedFilePath?: string
}

export function FileList({ files, onFolderClick, onFileClick, selectedFilePath }: FileListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[40px]"></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Modified</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow
            key={file.path}
            className={cn("cursor-pointer hover:bg-muted/50", selectedFilePath === file.path && "bg-muted")}
            onClick={() => (file.isDirectory ? onFolderClick(file.path) : onFileClick(file))}
          >
            <TableCell>
              {file.isDirectory ? (
                <Folder className="h-5 w-5 text-muted-foreground" />
              ) : (
                <FileIcon type={file.type} className="h-5 w-5" />
              )}
            </TableCell>
            <TableCell className="font-medium">{file.name}</TableCell>
            <TableCell>{file.isDirectory ? "Folder" : file.type.split("/")[1] || file.type}</TableCell>
            <TableCell>
              {file.isDirectory ? `${file.children?.length || 0} items` : formatFileSize(file.size)}
            </TableCell>
            <TableCell>{formatDate(file.lastModified)}</TableCell>
          </TableRow>
        ))}

        {files.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              No files found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
