"use client"

import type { FileType } from "@/types/file"
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
import { Copy, Check } from "lucide-react"
import { useState } from "react"

interface ShareDialogProps {
  file: FileType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareDialog({ file, open, onOpenChange }: ShareDialogProps) {
  const [copied, setCopied] = useState(false)

  // Generate a shareable URL for the file
  // If it's a GitHub file, use the direct URL, otherwise construct a local URL
  const fileUrl =
    file.url || (typeof window !== "undefined" ? `${window.location.origin}/${file.path}` : `/${file.path}`)

  const handleCopy = () => {
    navigator.clipboard.writeText(fileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share file</DialogTitle>
          <DialogDescription>Share a link to "{file.name}"</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-y-2 py-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={fileUrl} readOnly className="w-full" />
          </div>
          <Button type="button" size="sm" className="ml-2 px-3" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy</span>
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
