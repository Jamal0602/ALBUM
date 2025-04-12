"use client"

import { useState, useEffect } from "react"
import { FileList } from "./file-list"
import { FileGrid } from "./file-grid"
import { Breadcrumb } from "./breadcrumb"
import { SearchBar } from "./search-bar"
import { ViewToggle } from "./view-toggle"
import { EmptyState } from "./empty-state"
import type { FileType } from "@/types/file"
import { Loader2, HelpCircle, Github, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function FileExplorer() {
  const [files, setFiles] = useState<FileType[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileType[]>([])
  const [currentPath, setCurrentPath] = useState<string[]>(["public"])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [useGitHub, setUseGitHub] = useState(true)

  useEffect(() => {
    fetchFiles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPath, useGitHub])

  const fetchFiles = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const path = currentPath.join("/")
      const source = useGitHub ? "github" : "local"
      const response = await fetch(`/api/files?path=${path}&source=${source}&t=${Date.now()}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch files: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setFiles(data)
      setFilteredFiles(data)
    } catch (error) {
      console.error("Error fetching files:", error)
      setError(error instanceof Error ? error.message : "Failed to load files")
      setFiles([])
      setFilteredFiles([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (searchQuery) {
      const filtered = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredFiles(filtered)
    } else {
      setFilteredFiles(files)
    }
  }, [searchQuery, files])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const navigateTo = (path: string[]) => {
    setCurrentPath(path)
  }

  const navigateToFolder = (folderName: string) => {
    setCurrentPath([...currentPath, folderName])
  }

  const toggleGitHub = () => {
    setUseGitHub(!useGitHub)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Public Files Explorer</h1>
        <div className="flex items-center gap-2">
          <Link href="/help">
            <Button variant="ghost" size="sm" className="gap-1">
              <HelpCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Help</span>
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={fetchFiles} title="Refresh files">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-muted/40 p-2 rounded-md">
        <Switch id="github-mode" checked={useGitHub} onCheckedChange={toggleGitHub} />
        <Label htmlFor="github-mode" className="flex items-center gap-1.5 cursor-pointer">
          <Github className="h-4 w-4" />
          <span>Use GitHub Repository</span>
        </Label>
        <div className="text-xs text-muted-foreground ml-auto">
          {useGitHub ? "Fetching from GitHub" : "Using local files"}
        </div>
      </div>

      <Breadcrumb path={currentPath} onNavigate={navigateTo} />

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchBar onSearch={handleSearch} />
        <div className="flex items-center gap-2">
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          <span className="text-sm text-muted-foreground">{filteredFiles.length} files</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <EmptyState message={`Error: ${error}`} actionLabel="Try Again" onAction={fetchFiles} />
      ) : filteredFiles.length === 0 ? (
        <EmptyState
          message={searchQuery ? "No files match your search" : "No files found in this folder"}
          actionLabel={searchQuery ? "Clear Search" : "Refresh"}
          onAction={searchQuery ? () => handleSearch("") : fetchFiles}
        />
      ) : (
        <>
          {viewMode === "grid" ? (
            <FileGrid files={filteredFiles} onFolderClick={navigateToFolder} />
          ) : (
            <FileList files={filteredFiles} onFolderClick={navigateToFolder} />
          )}
        </>
      )}
    </div>
  )
}
