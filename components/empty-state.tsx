"use client"

import { FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  message?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  message = "No files found in the public folder",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground p-8 border-2 border-dashed rounded-lg">
      <FolderOpen className="h-12 w-12 mb-4 text-muted-foreground/60" />
      <p className="text-center mb-4">{message}</p>
      {actionLabel && onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
