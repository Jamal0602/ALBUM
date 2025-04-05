import type { Metadata } from "next"
import Link from "next/link"
import { FileUpIcon, FolderIcon, FolderPlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileExplorer } from "@/components/file-explorer"

export const metadata: Metadata = {
  title: "Files | Direct.Cubiz.Space",
  description: "Manage all your files in one place",
}

export default function FilesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Files</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <FolderPlusIcon className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Link href="/upload">
            <Button>
              <FileUpIcon className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Files</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="shared">Shared</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Images</CardTitle>
                <FolderIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245 files</div>
                <p className="text-xs text-muted-foreground">85.2 GB total</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Videos</CardTitle>
                <FolderIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">64 files</div>
                <p className="text-xs text-muted-foreground">45.8 GB total</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Audio</CardTitle>
                <FolderIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">128 files</div>
                <p className="text-xs text-muted-foreground">25.4 GB total</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Documents</CardTitle>
                <FolderIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">352 files</div>
                <p className="text-xs text-muted-foreground">20.1 GB total</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <FolderIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">48 files</div>
                <p className="text-xs text-muted-foreground">40.6 GB total</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">3D Models</CardTitle>
                <FolderIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32 files</div>
                <p className="text-xs text-muted-foreground">15.3 GB total</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Code</CardTitle>
                <FolderIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">415 files</div>
                <p className="text-xs text-muted-foreground">10.2 GB total</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temporary</CardTitle>
                <FolderIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24 files</div>
                <p className="text-xs text-muted-foreground">3.2 GB total</p>
              </CardContent>
            </Card>
          </div>

          <FileExplorer />
        </TabsContent>
        <TabsContent value="recent">
          <FileExplorer filter="recent" />
        </TabsContent>
        <TabsContent value="favorites">
          <FileExplorer filter="favorites" />
        </TabsContent>
        <TabsContent value="shared">
          <FileExplorer filter="shared" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

