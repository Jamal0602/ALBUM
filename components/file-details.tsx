"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { FileType } from "@/lib/types"
import { formatFileSize, formatDate } from "@/lib/utils"
import { FileIcon } from "./file-icon"
import { X, Download, ExternalLink } from "lucide-react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface FileDetailsProps {
  file: FileType
  onClose: () => void
}

export function FileDetails({ file, onClose }: FileDetailsProps) {
  const isImage = file.type.startsWith("image/")
  const isText = file.type.startsWith("text/") || file.type.includes("json") || file.type.includes("javascript")
  const isVideo = file.type.startsWith("video/")
  const isAudio = file.type.startsWith("audio/")

  return (
    <Card className="sticky top-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">File Details</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Preview */}
        <div className="aspect-square relative bg-muted rounded-md flex items-center justify-center overflow-hidden">
          {isImage ? (
            <Image
              src={file.path || "/placeholder.svg"}
              alt={file.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : isVideo ? (
            <video src={file.path} controls className="max-h-full max-w-full" />
          ) : isAudio ? (
            <audio src={file.path} controls className="w-full" />
          ) : (
            <FileIcon type={file.type} className="h-24 w-24 text-muted-foreground" />
          )}
        </div>

        <div>
          <h3 className="font-medium text-lg break-all">{file.name}</h3>
          <p className="text-sm text-muted-foreground">{file.path}</p>
        </div>

        <Separator />

        {/* File metadata */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Type</span>
            <Badge variant="outline">{file.type}</Badge>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Size</span>
            <span className="text-sm font-medium">{formatFileSize(file.size)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Modified</span>
            <span className="text-sm">{formatDate(file.lastModified, true)}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 pt-0">
        <Button className="w-full" onClick={() => window.open(file.path, "_blank")}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Open
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            const a = document.createElement("a")
            a.href = file.path
            a.download = file.name
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          }}
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </CardFooter>
    </Card>
  )
}
