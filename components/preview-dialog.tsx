"use client"

import { useState, useEffect } from "react"
import type { FileType } from "@/types/file"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getFileType } from "@/lib/file-types"
import { ImageViewer } from "./image-viewer"
import { VideoPlayer } from "./video-player"
import { AudioPlayer } from "./audio-player"
import { PDFViewer } from "./pdf-viewer"
import { TextEditor } from "./text-editor"
import { X } from "lucide-react"

interface PreviewDialogProps {
  file: FileType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PreviewDialog({ file, open, onOpenChange }: PreviewDialogProps) {
  const fileType = getFileType(file)
  // Use the direct URL if available (from GitHub), otherwise construct a local path
  const fileUrl = file.url || `/${file.path}`
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [textContent, setTextContent] = useState("")
  const [albumArt, setAlbumArt] = useState<string | undefined>(undefined)
  const [lyrics, setLyrics] = useState<string | undefined>(undefined)

  // Format the file URL to use file.cubiz.space domain
  const formatFileUrl = (url: string): string => {
    if (url.includes("githubusercontent.com")) {
      // Extract the path from GitHub URL
      const pathMatch = url.match(/\/main\/(.+)$/)
      if (pathMatch && pathMatch[1]) {
        return `https://file.cubiz.space/${pathMatch[1]}`
      }
    }

    // For local files, replace the domain
    if (typeof window !== "undefined") {
      return url.replace(window.location.origin, "https://file.cubiz.space")
    }

    return url
  }

  // Fetch text content for text files
  useEffect(() => {
    if (open && fileType === "text") {
      fetch(fileUrl)
        .then((response) => response.text())
        .then((content) => {
          setTextContent(content)
        })
        .catch((error) => {
          console.error("Error fetching text content:", error)
          setTextContent("Error loading file content.")
        })
    }
  }, [open, fileUrl, fileType])

  // Simulate fetching album art and lyrics for audio files
  useEffect(() => {
    if (open && fileType === "audio") {
      // In a real app, you would extract this from the audio metadata
      // For now, we'll simulate it with a placeholder
      setAlbumArt("/placeholder.svg?height=300&width=300")

      // Check if lyrics file exists with the same name but .lrc extension
      const lyricsUrl = fileUrl.replace(/\.[^.]+$/, ".lrc")

      fetch(lyricsUrl)
        .then((response) => {
          if (response.ok) {
            return response.text()
          }
          throw new Error("Lyrics not found")
        })
        .then((content) => {
          setLyrics(content)
        })
        .catch(() => {
          setLyrics(undefined)
        })
    }
  }, [open, fileUrl, fileType])

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const handleDownload = () => {
    const downloadUrl = formatFileUrl(fileUrl)
    window.open(downloadUrl, "_blank")
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          setIsFullscreen(false)
        }
        onOpenChange(newOpen)
      }}
    >
      <DialogContent className={`${isFullscreen ? "w-screen h-screen max-w-none rounded-none p-6" : "sm:max-w-3xl"}`}>
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="truncate max-w-[80%]">{file.name}</DialogTitle>
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="absolute right-4 top-4">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className={`mt-4 ${isFullscreen ? "h-[calc(100%-4rem)]" : ""}`}>
          {fileType === "image" && (
            <ImageViewer
              src={fileUrl || "/placeholder.svg"}
              alt={file.name}
              onToggleFullscreen={toggleFullscreen}
              isFullscreen={isFullscreen}
              onDownload={handleDownload}
            />
          )}

          {fileType === "video" && (
            <VideoPlayer
              src={fileUrl}
              title={file.name}
              onToggleFullscreen={toggleFullscreen}
              isFullscreen={isFullscreen}
            />
          )}

          {fileType === "audio" && (
            <AudioPlayer
              src={fileUrl}
              title={file.name}
              albumArt={albumArt}
              lyrics={lyrics}
              onToggleFullscreen={toggleFullscreen}
              isFullscreen={isFullscreen}
            />
          )}

          {fileType === "pdf" && (
            <PDFViewer src={fileUrl} onToggleFullscreen={toggleFullscreen} isFullscreen={isFullscreen} />
          )}

          {fileType === "text" && (
            <TextEditor
              content={textContent}
              fileUrl={file.path} // Use the actual file path for saving
              onClose={() => onOpenChange(false)}
              readOnly={file.url !== undefined} // Only allow editing for local files
            />
          )}

          {fileType === "other" && (
            <div className="text-center text-muted-foreground p-8">
              <p className="mb-4">Preview not available for this file type.</p>
              <Button variant="outline" onClick={handleDownload}>
                Download File
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
