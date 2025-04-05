"use client"

import { useState } from "react"
import {
  FileIcon,
  FileImageIcon,
  FileTextIcon,
  FileVideoIcon,
  FileVolumeIcon,
  MoreHorizontalIcon,
  PackageIcon,
  CuboidIcon as Cube3dIcon,
  FileCodeIcon,
  StarIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"

// Sample data - in a real app this would come from an API
const allFiles = [
  {
    id: "1",
    name: "hero-banner.jpg",
    type: "image",
    size: "2.4 MB",
    path: "/img/hero-banner.jpg",
    modified: "2 hours ago",
    favorite: true,
    shared: false,
  },
  {
    id: "2",
    name: "product-demo.mp4",
    type: "video",
    size: "24.8 MB",
    path: "/video/product-demo.mp4",
    modified: "Yesterday",
    favorite: false,
    shared: true,
  },
  {
    id: "3",
    name: "background-music.mp3",
    type: "audio",
    size: "4.2 MB",
    path: "/audio/background-music.mp3",
    modified: "2 days ago",
    favorite: true,
    shared: false,
  },
  {
    id: "4",
    name: "user-manual.pdf",
    type: "document",
    size: "1.8 MB",
    path: "/documents/user-manual.pdf",
    modified: "3 days ago",
    favorite: false,
    shared: true,
  },
  {
    id: "5",
    name: "app-installer.exe",
    type: "application",
    size: "45.6 MB",
    path: "/applications/windows/app-installer.exe",
    modified: "1 week ago",
    favorite: false,
    shared: false,
  },
  {
    id: "6",
    name: "product-model.glb",
    type: "3d",
    size: "12.3 MB",
    path: "/3d/product-model.glb",
    modified: "1 week ago",
    favorite: true,
    shared: true,
  },
  {
    id: "7",
    name: "api-helper.js",
    type: "code",
    size: "24 KB",
    path: "/code/api-helper.js",
    modified: "2 weeks ago",
    favorite: false,
    shared: false,
  },
  {
    id: "8",
    name: "logo.png",
    type: "image",
    size: "1.2 MB",
    path: "/img/logo.png",
    modified: "3 weeks ago",
    favorite: true,
    shared: true,
  },
  {
    id: "9",
    name: "presentation.pptx",
    type: "document",
    size: "5.6 MB",
    path: "/documents/presentation.pptx",
    modified: "1 month ago",
    favorite: false,
    shared: true,
  },
  {
    id: "10",
    name: "android-app.apk",
    type: "application",
    size: "32.1 MB",
    path: "/applications/android/android-app.apk",
    modified: "1 month ago",
    favorite: false,
    shared: false,
  },
]

function getFileIcon(type: string) {
  switch (type) {
    case "image":
      return <FileImageIcon className="h-4 w-4 text-blue-500" />
    case "video":
      return <FileVideoIcon className="h-4 w-4 text-red-500" />
    case "audio":
      return <FileVolumeIcon className="h-4 w-4 text-green-500" />
    case "document":
      return <FileTextIcon className="h-4 w-4 text-amber-500" />
    case "application":
      return <PackageIcon className="h-4 w-4 text-purple-500" />
    case "3d":
      return <Cube3dIcon className="h-4 w-4 text-pink-500" />
    case "code":
      return <FileCodeIcon className="h-4 w-4 text-indigo-500" />
    default:
      return <FileIcon className="h-4 w-4 text-gray-500" />
  }
}

interface FileExplorerProps {
  filter?: "recent" | "favorites" | "shared" | string
}

export function FileExplorer({ filter }: FileExplorerProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  // Filter files based on the filter prop
  const filteredFiles = filter
    ? filter === "recent"
      ? allFiles.sort((a, b) => a.modified.localeCompare(b.modified)).slice(0, 5)
      : filter === "favorites"
        ? allFiles.filter((file) => file.favorite)
        : filter === "shared"
          ? allFiles.filter((file) => file.shared)
          : allFiles
    : allFiles

  const toggleFileSelection = (id: string) => {
    setSelectedFiles((prev) => (prev.includes(id) ? prev.filter((fileId) => fileId !== id) : [...prev, id]))
  }

  const toggleAllFiles = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([])
    } else {
      setSelectedFiles(filteredFiles.map((file) => file.id))
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                onCheckedChange={toggleAllFiles}
                aria-label="Select all files"
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFiles.map((file) => (
            <TableRow key={file.id} className={selectedFiles.includes(file.id) ? "bg-accent/50" : ""}>
              <TableCell>
                <Checkbox
                  checked={selectedFiles.includes(file.id)}
                  onCheckedChange={() => toggleFileSelection(file.id)}
                  aria-label={`Select ${file.name}`}
                />
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {getFileIcon(file.type)}
                  <span>{file.name}</span>
                  {file.favorite && <StarIcon className="h-3 w-3 text-yellow-500 fill-yellow-500" />}
                </div>
              </TableCell>
              <TableCell>{file.path}</TableCell>
              <TableCell>{file.size}</TableCell>
              <TableCell>{file.modified}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontalIcon className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
                    <DropdownMenuItem>Copy URL</DropdownMenuItem>
                    <DropdownMenuItem>{file.favorite ? "Remove from Favorites" : "Add to Favorites"}</DropdownMenuItem>
                    <DropdownMenuItem>{file.shared ? "Manage Sharing" : "Share File"}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

