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

const recentFiles = [
  {
    id: "1",
    name: "hero-banner.jpg",
    type: "image",
    size: "2.4 MB",
    path: "/img/hero-banner.jpg",
    modified: "2 hours ago",
  },
  {
    id: "2",
    name: "product-demo.mp4",
    type: "video",
    size: "24.8 MB",
    path: "/video/product-demo.mp4",
    modified: "Yesterday",
  },
  {
    id: "3",
    name: "background-music.mp3",
    type: "audio",
    size: "4.2 MB",
    path: "/audio/background-music.mp3",
    modified: "2 days ago",
  },
  {
    id: "4",
    name: "user-manual.pdf",
    type: "document",
    size: "1.8 MB",
    path: "/documents/user-manual.pdf",
    modified: "3 days ago",
  },
  {
    id: "5",
    name: "app-installer.exe",
    type: "application",
    size: "45.6 MB",
    path: "/applications/windows/app-installer.exe",
    modified: "1 week ago",
  },
  {
    id: "6",
    name: "product-model.glb",
    type: "3d",
    size: "12.3 MB",
    path: "/3d/product-model.glb",
    modified: "1 week ago",
  },
  {
    id: "7",
    name: "api-helper.js",
    type: "code",
    size: "24 KB",
    path: "/code/api-helper.js",
    modified: "2 weeks ago",
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

export function RecentFiles() {
  const [files, setFiles] = useState(recentFiles)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Path</TableHead>
          <TableHead>Size</TableHead>
          <TableHead>Modified</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow key={file.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                {getFileIcon(file.type)}
                <span>{file.name}</span>
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
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

