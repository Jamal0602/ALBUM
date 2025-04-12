"use client"

import type { FileType } from "@/types/file"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getFileType } from "@/lib/file-types"
import Image from "next/image"

interface PreviewDialogProps {
  file: FileType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PreviewDialog({ file, open, onOpenChange }: PreviewDialogProps) {
  const fileType = getFileType(file)
  // Use the direct URL if available (from GitHub), otherwise construct a local path
  const fileUrl = file.url || `/${file.path}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Preview: {file.name}</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center items-center min-h-[300px] max-h-[70vh] overflow-auto p-4 bg-muted/50 rounded-md">
          {fileType === "image" ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={fileUrl || "/placeholder.svg"}
                alt={file.name}
                width={800}
                height={600}
                className="max-w-full max-h-[60vh] object-contain"
                unoptimized={file.url !== undefined} // Skip optimization for external URLs
              />
            </div>
          ) : fileType === "video" ? (
            <video controls className="max-w-full max-h-[60vh]">
              <source src={fileUrl} />
              Your browser does not support the video tag.
            </video>
          ) : fileType === "audio" ? (
            <audio controls className="w-full">
              <source src={fileUrl} />
              Your browser does not support the audio tag.
            </audio>
          ) : fileType === "pdf" ? (
            <iframe src={fileUrl} className="w-full h-[60vh]" title={file.name} />
          ) : fileType === "text" ? (
            <iframe src={fileUrl} className="w-full h-[60vh]" title={file.name} />
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Preview not available for this file type.</p>
              <Button variant="outline" className="mt-4" onClick={() => window.open(fileUrl, "_blank")}>
                Open in new tab
              </Button>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
