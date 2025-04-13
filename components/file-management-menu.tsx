"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FolderPlus, FilePlus, Upload, MoreVertical } from "lucide-react"
import { CreateFolderDialog } from "./create-folder-dialog"
import { CreateFileDialog } from "./create-file-dialog"
import { UploadFileDialog } from "./upload-file-dialog"

interface FileManagementMenuProps {
  currentPath: string[]
  onSuccess: () => void
  disabled?: boolean
}

export function FileManagementMenu({ currentPath, onSuccess, disabled = false }: FileManagementMenuProps) {
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false)
  const [showCreateFileDialog, setShowCreateFileDialog] = useState(false)
  const [showUploadFileDialog, setShowUploadFileDialog] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={disabled}>
            <FolderPlus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">New</span>
            <MoreVertical className="h-4 w-4 ml-1 sm:hidden" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowCreateFolderDialog(true)}>
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowCreateFileDialog(true)}>
            <FilePlus className="h-4 w-4 mr-2" />
            New File
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowUploadFileDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateFolderDialog
        currentPath={currentPath}
        open={showCreateFolderDialog}
        onOpenChange={setShowCreateFolderDialog}
        onSuccess={onSuccess}
      />

      <CreateFileDialog
        currentPath={currentPath}
        open={showCreateFileDialog}
        onOpenChange={setShowCreateFileDialog}
        onSuccess={onSuccess}
      />

      <UploadFileDialog
        currentPath={currentPath}
        open={showUploadFileDialog}
        onOpenChange={setShowUploadFileDialog}
        onSuccess={onSuccess}
      />
    </>
  )
}
