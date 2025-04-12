import type { FileType } from "@/types/file"
import { FileCard } from "./file-card"

interface FileGridProps {
  files: FileType[]
  onFolderClick: (folderName: string) => void
}

export function FileGrid({ files, onFolderClick }: FileGridProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
        <p>No files found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {files.map((file) => (
        <FileCard key={file.path} file={file} onFolderClick={onFolderClick} />
      ))}
    </div>
  )
}
