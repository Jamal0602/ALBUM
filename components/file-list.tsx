import type { FileType } from "@/types/file"
import { FileRow } from "./file-row"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface FileListProps {
  files: FileType[]
  onFolderClick: (folderName: string) => void
}

export function FileList({ files, onFolderClick }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-muted-foreground">
        <p>No files found</p>
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50%]">Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Last Modified</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <FileRow key={file.path} file={file} onFolderClick={onFolderClick} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
