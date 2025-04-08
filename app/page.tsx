import { PublicFileExplorer } from "@/components/public-file-explorer"

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Public Files Explorer</h1>
      <PublicFileExplorer />
    </div>
  )
}
