"use client"

import type { FileType } from "@/types/file"
import { getFileIcon } from "@/lib/file-icons"
import { formatFileSize } from "@/lib/format-file-size"
import { FileActions } from "./file-actions"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface FileCardProps {
  file: FileType
  onFolderClick: (folderName: string) => void
}

export function FileCard({ file, onFolderClick }: FileCardProps) {
  const FileIcon = getFileIcon(file)

  const handleClick = () => {
    if (file.type === "directory") {
      onFolderClick(file.name)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div
          className={`flex flex-col items-center justify-center gap-2 ${file.type === "directory" ? "cursor-pointer" : ""}`}
          onClick={handleClick}
        >
          <div className="h-16 w-16 flex items-center justify-center text-muted-foreground">
            <FileIcon size={48} />
          </div>
          <div className="w-full text-center">
            <p className="text-sm font-medium truncate" title={file.name}>
              {file.name}
            </p>
            {file.type === "file" && file.size && (
              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
            )}
          </div>
        </div>
      </CardContent>
      {file.type === "file" && (
        <CardFooter className="p-2 bg-muted/50 flex justify-center">
          <FileActions file={file} />
        </CardFooter>
      )}
    </Card>
  )
}
