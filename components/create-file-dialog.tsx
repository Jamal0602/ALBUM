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
import { createFile } from "@/lib/file-management"
import { toast } from "@/components/ui/use-toast"

interface CreateFileDialogProps {
  currentPath: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateFileDialog({ currentPath, open, onOpenChange, onSuccess }: CreateFileDialogProps) {
  const [fileName, setFileName] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!fileName.trim()) {
      setError("File name is required")
      return
    }

    // Check for invalid characters
    if (/[<>:"/\\|?*]/.test(fileName)) {
      setError("File name contains invalid characters")
      return
    }

    setIsCreating(true)

    try {
      const path = currentPath.join("/")
      const result = await createFile(path, fileName)

      if (result.success) {
        toast({
          title: "File created",
          description: `File "${fileName}" has been created successfully.`,
        })
        setFileName("")
        onOpenChange(false)
        onSuccess()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Error creating file:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
            <DialogDescription>Enter a name for the new file.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fileName">File Name</Label>
              <Input
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="example.txt"
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
              {isCreating ? "Creating..." : "Create File"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
