"use client"

import { useEffect, useState } from "react"
import { getPublicFiles } from "@/lib/file-actions"
import { FileCard } from "@/components/file-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Loader2, Search } from "lucide-react"

type FileInfo = {
  name: string
  path: string
  size: number
  type: string
  lastModified: string
}

export function FileExplorer() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [filteredFiles, setFilteredFiles] = useState<FileInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [view, setView] = useState<"grid" | "list">("grid")

  useEffect(() => {
    async function loadFiles() {
      try {
        const fileData = await getPublicFiles()
        setFiles(fileData)
        setFilteredFiles(fileData)
      } catch (error) {
        console.error("Error loading files:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFiles()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = files.filter((file) => file.name.toLowerCase().includes(searchTerm.toLowerCase()))
      setFilteredFiles(filtered)
    } else {
      setFilteredFiles(files)
    }
  }, [searchTerm, files])

  const fileTypes = Array.from(new Set(files.map((file) => file.type)))

  return (
    <div className="space-y-6">
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
          <span className="text-sm text-muted-foreground">
            {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <FileCard key={file.path} file={file} />
              ))}
            </div>
          </TabsContent>

          {fileTypes.map((type) => (
            <TabsContent key={type} value={type} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredFiles
                  .filter((file) => file.type === type)
                  .map((file) => (
                    <FileCard key={file.path} file={file} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
