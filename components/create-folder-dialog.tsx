"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createFolder } from "@/lib/file-management"
import { toast } from "@/components/ui/use-toast"

interface CreateFolderDialogProps {
  currentPath: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateFolderDialog({ currentPath, open, onOpenChange, onSuccess }: CreateFolderDialogProps) {
  const [folderName, setFolderName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!folderName.trim()) {
      setError("Folder name is required")
      return
    }

    // Check for invalid characters
    if (/[<>:"/\\|?*]/.test(folderName)) {
      setError("Folder name contains invalid characters")
      return
    }

    setIsCreating(true)

    try {
      const path = currentPath.join("/")
      const result = await createFolder(path, folderName)

      if (result.success) {
        toast({
          title: "Folder created",
          description: `Folder "${folderName}" has been created successfully.`,
        })
        setFolderName("")
        onOpenChange(false)
        onSuccess()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Error creating folder:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>Enter a name for the new folder.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                placeholder="New Folder"
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <div className="text-sm text-muted-foreground">Location: {currentPath.join("/")}</div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
