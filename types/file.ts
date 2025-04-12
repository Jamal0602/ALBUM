export interface FileType {
  name: string
  path: string
  type: "file" | "directory"
  size?: number
  extension?: string
  lastModified?: string
  url?: string
  children?: FileType[] // For directories in the manifest
}
