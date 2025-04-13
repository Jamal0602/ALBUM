"use client"

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
import { deleteItem } from "@/lib/file-management"
import { toast } from "@/components/ui/use-toast"
import type { FileType } from "@/types/file"
import { AlertTriangle } from "lucide-react"

interface DeleteDialogProps {
  file: FileType
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteDialog({ file, open, onOpenChange, onSuccess }: DeleteDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setError(null)
    setIsDeleting(true)

    try {
      const result = await deleteItem(file.path)

      if (result.success) {
        toast({
          title: "Item deleted",
          description: `"${file.name}" has been deleted.`,
        })
        onOpenChange(false)
        onSuccess()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Error deleting item:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Delete {file.type === "directory" ? "Folder" : "File"}
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{file.name}"?
            {file.type === "directory" && " This will delete all files and folders inside it."}
          </DialogDescription>
        </DialogHeader>
        {error && <div className="bg-destructive/10 p-3 rounded-md text-sm text-destructive">{error}</div>}
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
