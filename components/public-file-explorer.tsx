"use client"

import React from "react"

import { useState, useEffect } from "react"
import { getAllPublicFiles } from "@/lib/file-utils"
import { FileCard } from "./file-card"
import { FileList } from "./file-list"
import { FileDetails } from "./file-details"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Grid, List, Loader2, FolderTree, RefreshCw, Download } from "lucide-react"
import type { FileType } from "@/lib/types"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { downloadAllFiles } from "@/lib/file-utils"

export function PublicFileExplorer() {
  const [files, setFiles] = useState<FileType[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPath, setCurrentPath] = useState<string[]>([])
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    async function loadFiles() {
      setLoading(true)
      try {
        const fileData = await getAllPublicFiles()
        setFiles(fileData)
        setFilteredFiles(fileData)
      } catch (error) {
        console.error("Error loading files:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFiles()
  }, [refreshTrigger])

  useEffect(() => {
    let filtered = [...files]

    // Filter by current path
    if (currentPath.length > 0) {
      const pathString = currentPath.join("/")
      filtered = filtered.filter((file) => {
        const fileDirPath = file.dirPath.startsWith("/") ? file.dirPath.substring(1) : file.dirPath
        return fileDirPath === pathString
      })
    } else {
      // Show only root files when no path is selected
      filtered = filtered.filter((file) => !file.dirPath || file.dirPath === "/" || file.dirPath === "")
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    setFilteredFiles(filtered)
  }, [searchTerm, files, currentPath])

  const fileTypes = Array.from(new Set(files.map((file) => file.type)))

  const handlePathClick = (index: number) => {
    setCurrentPath((prev) => prev.slice(0, index + 1))
    setSelectedFile(null)
  }

  const handleFolderClick = (folderPath: string) => {
    setCurrentPath(folderPath.split("/").filter(Boolean))
    setSelectedFile(null)
  }

  const handleFileClick = (file: FileType) => {
    setSelectedFile(file)
  }

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1)
    setSelectedFile(null)
  }

  const handleDownloadAll = async () => {
    try {
      const zipBlob = await downloadAllFiles(filteredFiles)

      // Create a download link and trigger it
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = "public-files.zip"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      // Clean up
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading files:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb navigation */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => setCurrentPath([])}>
              <FolderTree className="h-4 w-4 mr-1" />
              public
            </BreadcrumbLink>
          </BreadcrumbItem>

          {currentPath.map((segment, index) => (
            <React.Fragment key={index}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => handlePathClick(index)}>{segment}</BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search files..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh} title="Refresh files">
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={viewMode === "grid" ? "bg-muted" : ""}
            title="Grid view"
          >
            <Grid className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("list")}
            className={viewMode === "list" ? "bg-muted" : ""}
            title="List view"
          >
            <List className="h-4 w-4" />
          </Button>

          {filteredFiles.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleDownloadAll} className="ml-2">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          )}

          <span className="text-sm text-muted-foreground ml-2">
            {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* File/Folder Browser (2/3 width) */}
          <div className={`${selectedFile ? "md:col-span-2" : "md:col-span-3"} space-y-6`}>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4 flex flex-wrap">
                <TabsTrigger value="all">All Files</TabsTrigger>
                {fileTypes.map((type) => (
                  <TabsTrigger key={type} value={type}>
                    {type}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all" className="mt-0">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredFiles.map((file) => (
                      <FileCard
                        key={file.path}
                        file={file}
                        onFolderClick={handleFolderClick}
                        onFileClick={handleFileClick}
                        isSelected={selectedFile?.path === file.path}
                      />
                    ))}
                  </div>
                ) : (
                  <FileList
                    files={filteredFiles}
                    onFolderClick={handleFolderClick}
                    onFileClick={handleFileClick}
                    selectedFilePath={selectedFile?.path}
                  />
                )}
              </TabsContent>

              {fileTypes.map((type) => (
                <TabsContent key={type} value={type} className="mt-0">
                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredFiles
                        .filter((file) => file.type === type)
                        .map((file) => (
                          <FileCard
                            key={file.path}
                            file={file}
                            onFolderClick={handleFolderClick}
                            onFileClick={handleFileClick}
                            isSelected={selectedFile?.path === file.path}
                          />
                        ))}
                    </div>
                  ) : (
                    <FileList
                      files={filteredFiles.filter((file) => file.type === type)}
                      onFolderClick={handleFolderClick}
                      onFileClick={handleFileClick}
                      selectedFilePath={selectedFile?.path}
                    />
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* File Details Panel (1/3 width) */}
          {selectedFile && (
            <div className="md:col-span-1">
              <FileDetails file={selectedFile} onClose={() => setSelectedFile(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
