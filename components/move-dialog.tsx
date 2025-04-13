"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { moveItem } from "@/lib/file-management"
import { toast } from "@/components/ui/use-toast"
import type { FileType } from "@/types/file"
import { Folder, ChevronRight, ArrowRight } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MoveDialogProps {
  file: FileType
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function MoveDialog({ file, open, onOpenChange, onSuccess }: MoveDialogProps) {
  const [isMoving, setIsMoving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [folders, setFolders] = useState<FileType[]>([])
  const [currentPath, setCurrentPath] = useState<string[]>(["public"])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPath, setSelectedPath] = useState<string[]>(["public"])

  // Fetch folders when the dialog opens
  useEffect(() => {
    if (open) {
      fetchFolders(["public"])
    }
  }, [open])

  const fetchFolders = async (path: string[]) => {
    setIsLoading(true)
    try {
      const pathString = path.join("/")
      const response = await fetch(`/api/files?path=${pathString}&t=${Date.now()}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch folders: ${response.status}`)
      }

      const data = await response.json()

      // Filter out only directories
      const foldersList = data.filter((item: FileType) => item.type === "directory")

      // Don't allow moving to the same directory or to a subdirectory of the item
      if (file.type === "directory") {
        const itemPath = file.path
        const filteredFolders = foldersList.filter((folder: FileType) => {
          return !folder.path.startsWith(itemPath)
        })
        setFolders(filteredFolders)
      } else {
        setFolders(foldersList)
      }

      setCurrentPath(path)
    } catch (error) {
      console.error("Error fetching folders:", error)
      setError("Failed to load folders")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMove = async () => {
    setError(null)

    // Don't allow moving to the current directory
    const currentDir = file.path.substring(0, file.path.lastIndexOf("/"))
    const targetDir = selectedPath.join("/")

    if (currentDir === targetDir) {
      setError("Cannot move to the same directory")
      return
    }

    setIsMoving(true)

    try {
      const result = await moveItem(file.path, targetDir)

      if (result.success) {
        toast({
          title: "Item moved",
          description: `"${file.name}" has been moved to "${targetDir}".`,
        })
        onOpenChange(false)
        onSuccess()
      } else {
        setError(result.message)
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error("Error moving item:", error)
    } finally {
      setIsMoving(false)
    }
  }

  const navigateToFolder = (folderPath: string) => {
    const pathParts = folderPath.split("/")
    fetchFolders(pathParts)
  }

  const navigateUp = () => {
    if (currentPath.length > 1) {
      const newPath = [...currentPath]
      newPath.pop()
      fetchFolders(newPath)
    }
  }

  const selectFolder = (path: string[]) => {
    setSelectedPath(path)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Move {file.type === "directory" ? "Folder" : "File"}</DialogTitle>
          <DialogDescription>Select a destination folder for "{file.name}".</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex items-center gap-2 mb-2 text-sm">
            <Button variant="outline" size="sm" onClick={navigateUp} disabled={currentPath.length <= 1}>
              Up
            </Button>
            <div className="flex items-center overflow-x-auto">
              {currentPath.map((segment, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />}
                  <span className="whitespace-nowrap">{segment}</span>
                </div>
              ))}
            </div>
          </div>

          <ScrollArea className="h-60 border rounded-md">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">Loading folders...</p>
              </div>
            ) : folders.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">No folders found</p>
              </div>
            ) : (
              <div className="p-2">
                {folders.map((folder) => (
                  <div
                    key={folder.path}
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted ${
                      selectedPath.join("/") === folder.path ? "bg-muted" : ""
                    }`}
                    onClick={() => selectFolder([...currentPath, folder.name])}
                    onDoubleClick={() => navigateToFolder(folder.path)}
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{folder.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigateToFolder(folder.path)
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {error && <p className="text-sm text-destructive mt-2">{error}</p>}

          <div className="mt-4 text-sm">
            <p className="font-medium">Selected destination:</p>
            <p className="text-muted-foreground">{selectedPath.join("/")}</p>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleMove}
            disabled={isMoving || selectedPath.join("/") === currentPath.join("/")}
          >
            {isMoving ? "Moving..." : "Move Here"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
