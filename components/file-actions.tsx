"use client"

import type { FileType } from "@/types/file"
import { Download, Eye, Share2, Github, Edit, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ShareDialog } from "./share-dialog"
import { PreviewDialog } from "./preview-dialog"
import { getFileType } from "@/lib/file-types"
import { RenameDialog } from "./rename-dialog"
import { MoveDialog } from "./move-dialog"
import { DeleteDialog } from "./delete-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface FileActionsProps {
  file: FileType
}

export function FileActions({ file }: FileActionsProps) {
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showMoveDialog, setShowMoveDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const fileType = getFileType(file)

  const handleDownload = () => {
    // Format the URL to use file.cubiz.space domain
    let downloadUrl = ""

    if (file.url && file.url.includes("githubusercontent.com")) {
      // Extract the path from GitHub URL
      const pathMatch = file.url.match(/\/main\/(.+)$/)
      if (pathMatch && pathMatch[1]) {
        // Remove "public/" from the path if it exists
        downloadUrl = `https://file.cubiz.space/${pathMatch[1].replace(/^public\//, "")}`
      } else {
        downloadUrl = file.url
      }
    } else {
      // For local files, replace the domain and remove "public/" prefix
      downloadUrl = `https://file.cubiz.space/${file.path.replace(/^public\//, "")}`
    }

    window.open(downloadUrl, "_blank")
  }

  const handleDownloadWithClient = () => {
    if (typeof window !== "undefined" && window.downloadClient) {
      // Format the URL to use file.cubiz.space domain
      let downloadUrl = ""

      if (file.url && file.url.includes("githubusercontent.com")) {
        // Extract the path from GitHub URL
        const pathMatch = file.url.match(/\/main\/(.+)$/)
        if (pathMatch && pathMatch[1]) {
          // Remove "public/" from the path if it exists
          downloadUrl = `https://file.cubiz.space/${pathMatch[1].replace(/^public\//, "")}`
        } else {
          downloadUrl = file.url
        }
      } else {
        // For local files, replace the domain and remove "public/" prefix
        downloadUrl = `https://file.cubiz.space/${file.path.replace(/^public\//, "")}`
      }

      // @ts-ignore
      window.downloadClient.addDownload(downloadUrl, file.name)
    } else {
      // Fallback to regular download if client is not available
      handleDownload()
    }
  }

  const handlePreview = () => {
    setShowPreviewDialog(true)
  }

  const handleShare = () => {
    setShowShareDialog(true)
  }

  // Check if the file is from GitHub
  const isGitHubFile = file.url && file.url.includes("github.com")
  const isTextFile = fileType === "text"

  return (
    <>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={handleDownloadWithClient} title="Download">
          <Download className="h-4 w-4" />
          <span className="sr-only">Download</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handlePreview} title="Preview">
          {isTextFile ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="sr-only">Preview</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handleShare} title="Share">
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title="More options">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowRenameDialog(true)}>Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowMoveDialog(true)}>Move</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isGitHubFile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              window.open(
                file.url?.replace("raw.githubusercontent.com", "github.com").replace("/main/", "/blob/main/"),
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

      {/* Add the new dialogs */}
      <RenameDialog
        file={file}
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        onSuccess={() => {
          // Refresh the file list
          if (typeof window !== "undefined") {
            const event = new CustomEvent("file-operation-complete")
            window.dispatchEvent(event)
          }
        }}
      />

      <MoveDialog
        file={file}
        open={showMoveDialog}
        onOpenChange={setShowMoveDialog}
        onSuccess={() => {
          // Refresh the file list
          if (typeof window !== "undefined") {
            const event = new CustomEvent("file-operation-complete")
            window.dispatchEvent(event)
          }
        }}
      />

      <DeleteDialog
        file={file}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onSuccess={() => {
          // Refresh the file list
          if (typeof window !== "undefined") {
            const event = new CustomEvent("file-operation-complete")
            window.dispatchEvent(event)
          }
        }}
      />
    </>
  )
}
