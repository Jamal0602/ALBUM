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
import { renameItem } from "@/lib/file-management"
import { toast } from "@/components/ui/use-toast"
import type { FileType } from "@/types/file"

interface RenameDialogProps {
  file: FileType
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function RenameDialog({ file, open, onOpenChange, onSuccess }: RenameDialogProps) {
  const [newName, setNewName] = useState(file.name)
  const [isRenaming, setIsRenaming] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!newName.trim()) {
      setError("Name is required")
      return
    }

    // Check for invalid characters
    if (/[<>:"/\\|?*]/.test(newName)) {
      setError("Name contains invalid characters")
      return
    }

    if (newName === file.name) {
      onOpenChange(false)
      return
    }

    setIsRenaming(true)

    try {
      const result = await renameItem(file.path, newName)

      if (result.success) {
        toast({
          title: "Item renamed",
          description: `"${file.name}" has been renamed to "${newName}".`,
        })
        onOpenChange(false)
        onSuccess()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Error renaming item:", error)
    } finally {
      setIsRenaming(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename {file.type === "directory" ? "Folder" : "File"}</DialogTitle>
            <DialogDescription>Enter a new name for "{file.name}".</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="newName">New Name</Label>
              <Input id="newName" value={newName} onChange={(e) => setNewName(e.target.value)} autoFocus />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isRenaming}>
              {isRenaming ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
