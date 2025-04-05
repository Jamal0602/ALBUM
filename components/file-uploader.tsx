"use client"

import type React from "react"

import { useState } from "react"
import { FileUpIcon, FolderIcon, XIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FileUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [destination, setDestination] = useState("/")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (files.length === 0) return

    setUploading(true)
    setProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">File Upload</TabsTrigger>
          <TabsTrigger value="folder">Folder Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="space-y-4">
          <div
            className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              if (e.dataTransfer.files) {
                setFiles(Array.from(e.dataTransfer.files))
              }
            }}
          >
            <FileUpIcon className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Drag & Drop Files</h3>
            <p className="mt-2 text-sm text-muted-foreground">or click to browse files</p>
            <label htmlFor="file-upload" className="mt-4">
              <div className="inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                Browse Files
              </div>
              <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </TabsContent>
        <TabsContent value="folder" className="space-y-4">
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <FolderIcon className="h-10 w-10 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Upload Folder</h3>
            <p className="mt-2 text-sm text-muted-foreground">Select a folder to upload</p>
            <label htmlFor="folder-upload" className="mt-4">
              <div className="inline-flex cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                Browse Folder
              </div>
              <input
                id="folder-upload"
                type="file"
                webkitdirectory=""
                directory=""
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </TabsContent>
      </Tabs>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-lg border">
            <div className="p-4">
              <h3 className="text-lg font-semibold">Selected Files ({files.length})</h3>
            </div>
            <div className="max-h-60 overflow-auto p-4">
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between rounded-md border p-2">
                    <div className="flex items-center space-x-2">
                      <FileUpIcon className="h-4 w-4" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFile(index)} disabled={uploading}>
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-full space-y-1">
                <div className="text-sm font-medium">Destination</div>
                <Select value={destination} onValueChange={setDestination} disabled={uploading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="/">Root Directory</SelectItem>
                    <SelectItem value="/img">Images</SelectItem>
                    <SelectItem value="/video">Videos</SelectItem>
                    <SelectItem value="/audio">Audio</SelectItem>
                    <SelectItem value="/documents">Documents</SelectItem>
                    <SelectItem value="/applications">Applications</SelectItem>
                    <SelectItem value="/3d">3D Models</SelectItem>
                    <SelectItem value="/code">Code</SelectItem>
                    <SelectItem value="/temp">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

