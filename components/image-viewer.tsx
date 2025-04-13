"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCw, Maximize, Minimize, Download } from "lucide-react"
import Image from "next/image"

interface ImageViewerProps {
  src: string
  alt: string
  onToggleFullscreen: () => void
  isFullscreen: boolean
  onDownload: () => void
}

export function ImageViewer({ src, alt, onToggleFullscreen, isFullscreen, onDownload }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation((rotation + 90) % 360)
  }

  return (
    <div className={`flex flex-col ${isFullscreen ? "h-full" : ""}`}>
      <div className="flex justify-between items-center mb-2 p-2 bg-muted rounded-md">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 0.5}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 3}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleRotate}>
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onDownload}>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className={`flex-1 overflow-auto bg-muted/30 rounded-md flex items-center justify-center ${isFullscreen ? "h-[calc(100%-3rem)]" : "min-h-[300px]"}`}
      >
        <div
          style={{
            transform: `scale(${zoom}) rotate(${rotation}deg)`,
            transition: "transform 0.2s ease",
          }}
          className="relative"
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={800}
            height={600}
            className="max-w-full max-h-[60vh] object-contain"
            unoptimized={src.startsWith("http")}
          />
        </div>
      </div>
    </div>
  )
}
