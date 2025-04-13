"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { uploadFile } from "@/lib/file-management"
import { toast } from "@/components/ui/use-toast"
import { Upload, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface UploadFileDialogProps {
  currentPath: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UploadFileDialog({ currentPath, open, onOpenChange, onSuccess }: UploadFileDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 5
      })
    }, 100)

    try {
      const path = currentPath.join("/")
      const result = await uploadFile(path, selectedFile)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        toast({
          title: "File uploaded",
          description: `File "${selectedFile.name}" has been uploaded successfully.`,
        })
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        onOpenChange(false)
        onSuccess()
      } else {
        setError(result.message)
        setUploadProgress(0)
      }
    } catch (error) {
      clearInterval(progressInterval)
      setUploadProgress(0)
      setError("An unexpected error occurred")
      console.error("Error uploading file:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFile(e.dataTransfer.files[0])
      setError(null)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!isUploading) {
          onOpenChange(newOpen)
          if (!newOpen) {
            setSelectedFile(null)
            setError(null)
            if (fileInputRef.current) {
              fileInputRef.current.value = ""
            }
          }
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>Upload a file to the current directory.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div
            className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-center text-muted-foreground mb-1">
              {selectedFile ? selectedFile.name : "Drag and drop a file here or click to browse"}
            </p>
            {selectedFile && (
              <div className="flex items-center mt-2">
                <span className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 ml-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedFile(null)
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ""
                    }
                  }}
                  disabled={isUploading}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground">Uploading... {uploadProgress}%</p>
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="text-sm text-muted-foreground">Location: {currentPath.join("/")}</div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button type="button" onClick={handleUpload} disabled={!selectedFile || isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
