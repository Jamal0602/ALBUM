"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, Maximize, Minimize } from "lucide-react"

interface PDFViewerProps {
  src: string
  onToggleFullscreen: () => void
  isFullscreen: boolean
}

export function PDFViewer({ src, onToggleFullscreen, isFullscreen }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100)

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 50))
  }

  return (
    <div className={`flex flex-col ${isFullscreen ? "h-full" : ""}`}>
      <div className="flex justify-between items-center mb-2 p-2 bg-muted rounded-md">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleZoomOut} disabled={zoom <= 50}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{zoom}%</span>
          <Button variant="ghost" size="icon" onClick={handleZoomIn} disabled={zoom >= 200}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="ghost" size="icon" onClick={onToggleFullscreen}>
          {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
        </Button>
      </div>

      <div className={`flex-1 overflow-auto bg-muted rounded-md ${isFullscreen ? "h-[calc(100%-3rem)]" : ""}`}>
        <iframe src={`${src}#view=FitH&zoom=${zoom}`} className="w-full h-full border-0" title="PDF Viewer" />
      </div>
    </div>
  )
}
