"use client"

import type { FileType } from "@/types/file"
import { Download, Eye, Share2, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ShareDialog } from "./share-dialog"
import { PreviewDialog } from "./preview-dialog"

interface FileActionsProps {
  file: FileType
}

export function FileActions({ file }: FileActionsProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)

  const handleDownload = () => {
    // If we have a direct URL (from GitHub), use it
    if (file.url) {
      window.open(file.url, "_blank")
      return
    }

    // Otherwise create a link to download the file
    const link = document.createElement("a")
    link.href = `/${file.path}`
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePreview = () => {
    setShowPreviewDialog(true)
  }

  const handleShare = () => {
    setShowShareDialog(true)
  }

  // Check if the file is from GitHub
  const isGitHubFile = file.url && file.url.includes("github.com")

  return (
    <>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={handleDownload} title="Download">
          <Download className="h-4 w-4" />
          <span className="sr-only">Download</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handlePreview} title="Preview">
          <Eye className="h-4 w-4" />
          <span className="sr-only">Preview</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleShare} title="Share">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
        {isGitHubFile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              window.open(
                file.url?.replace("file.cubiz.space"),
                "_blank",
              )
            }
            title="View on GitHub"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">View on GitHub</span>
          </Button>
        )}
      </div>

      <ShareDialog file={file} open={showShareDialog} onOpenChange={setShowShareDialog} />

      <PreviewDialog file={file} open={showPreviewDialog} onOpenChange={setShowPreviewDialog} />
    </>
  )
}
