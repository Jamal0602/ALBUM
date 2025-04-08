export interface FileType {
  name: string
  path: string
  dirPath: string
  size: number
  type: string
  lastModified: string
  isDirectory: boolean
  children?: FileType[]
}
