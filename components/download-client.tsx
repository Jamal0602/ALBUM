"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Download, X, CheckCircle, AlertCircle, Pause, Play } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DownloadItem {
  id: string
  name: string
  url: string
  progress: number
  status: "queued" | "downloading" | "paused" | "completed" | "error"
  error?: string
  size?: number
  downloaded?: number
  speed?: number
}

export function DownloadClient() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Add a download to the queue
  const addDownload = (url: string, name: string) => {
    const id = Date.now().toString()
    const newDownload: DownloadItem = {
      id,
      name,
      url,
      progress: 0,
      status: "queued",
    }

    setDownloads((prev) => [...prev, newDownload])
    setIsOpen(true)

    // Start the download
    startDownload(id)
  }

  // Simulate starting a download
  const startDownload = (id: string) => {
    setDownloads((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "downloading", progress: 0 } : item)),
    )

    // Simulate download progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 10

      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        setDownloads((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  progress: 100,
                  status: "completed",
                  downloaded: item.size,
                  speed: 0,
                }
              : item,
          ),
        )
      } else {
        setDownloads((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  progress,
                  speed: Math.floor(Math.random() * 1024) + 100,
                  downloaded: Math.floor((progress / 100) * (item.size || 1024 * 1024)),
                  size: item.size || Math.floor(Math.random() * 10 * 1024 * 1024) + 1024 * 1024,
                }
              : item,
          ),
        )
      }
    }, 300)

    // Store the interval ID in a ref to clear it when needed
    return () => clearInterval(interval)
  }

  // Pause a download
  const pauseDownload = (id: string) => {
    setDownloads((prev) => prev.map((item) => (item.id === id ? { ...item, status: "paused" } : item)))
  }

  // Resume a download
  const resumeDownload = (id: string) => {
    setDownloads((prev) => prev.map((item) => (item.id === id ? { ...item, status: "downloading" } : item)))
    startDownload(id)
  }

  // Cancel a download
  const cancelDownload = (id: string) => {
    setDownloads((prev) => prev.filter((item) => item.id !== id))
  }

  // Format bytes to human-readable size
  const formatBytes = (bytes?: number): string => {
    if (!bytes) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  // Make the download client available globally
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore
      window.downloadClient = {
        addDownload,
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        // @ts-ignore
        delete window.downloadClient
      }
    }
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Downloads</span>
          {downloads.length > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-xs">
              {downloads.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Downloads</DialogTitle>
          <DialogDescription>Manage your file downloads.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[300px] -mx-6 px-6">
          {downloads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Download className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No downloads yet</p>
              <p className="text-xs text-muted-foreground mt-1">Your downloads will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {downloads.map((download) => (
                <div key={download.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="truncate flex-1">
                      <p className="font-medium truncate">{download.name}</p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        {download.status === "downloading" && (
                          <>
                            <span>{formatBytes(download.downloaded)}</span>
                            <span className="mx-1">/</span>
                            <span>{formatBytes(download.size)}</span>
                            <span className="mx-1">•</span>
                            <span>{formatBytes(download.speed)}/s</span>
                          </>
                        )}
                        {download.status === "completed" && (
                          <>
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                            <span>Completed • {formatBytes(download.size)}</span>
                          </>
                        )}
                        {download.status === "paused" && (
                          <>
                            <Pause className="h-3 w-3 mr-1" />
                            <span>
                              Paused • {formatBytes(download.downloaded)} of {formatBytes(download.size)}
                            </span>
                          </>
                        )}
                        {download.status === "error" && (
                          <>
                            <AlertCircle className="h-3 w-3 text-destructive mr-1" />
                            <span className="text-destructive">{download.error || "Download failed"}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {download.status === "downloading" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => pauseDownload(download.id)}
                        >
                          <Pause className="h-3 w-3" />
                        </Button>
                      )}
                      {download.status === "paused" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => resumeDownload(download.id)}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => cancelDownload(download.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={download.progress} className="h-1" />
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
