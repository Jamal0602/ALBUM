interface Window {
  downloadClient?: {
    addDownload: (url: string, name: string) => void
  }
}
