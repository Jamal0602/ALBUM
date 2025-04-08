"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { formatFileSize, formatDate } from "@/lib/utils"
import { FileIcon } from "./file-icon"
import Image from "next/image"
import { Folder } from "lucide-react"
import type { FileType } from "@/lib/types"
import { cn } from "@/lib/utils"

interface FileCardProps {
  file: FileType
  onFolderClick: (path: string) => void
  onFileClick: (file: FileType) => void
  isSelected: boolean
}

export function FileCard({ file, onFolderClick, onFileClick, isSelected }: FileCardProps) {
  const isImage = file.type.startsWith("image/")
  const isFolder = file.isDirectory

  const handleClick = () => {
    if (isFolder) {
      onFolderClick(file.path)
    } else {
      onFileClick(file)
    }
  }

  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-md transition-shadow cursor-pointer",
        isSelected && "ring-2 ring-primary",
      )}
      onClick={handleClick}
    >
      <div className="aspect-square relative bg-muted flex items-center justify-center">
        {isFolder ? (
          <Folder className="h-16 w-16 text-muted-foreground" />
        ) : isImage ? (
          <Image
            src={file.path || "/placeholder.svg"}
            alt={file.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <FileIcon type={file.type} className="h-16 w-16 text-muted-foreground" />
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium truncate" title={file.name}>
          {file.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {isFolder ? `${file.children?.length || 0} items` : formatFileSize(file.size)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">{formatDate(file.lastModified)}</CardFooter>
    </Card>
  )
}
