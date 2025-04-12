import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, FolderPlus, RefreshCw, Upload, Github } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 max-w-3xl">
      <div className="mb-6">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explorer
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Public Files Explorer Help</h1>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Github className="mr-2 h-5 w-5" />
            GitHub Repository Integration
          </h2>

          <div className="space-y-4">
            <p>
              The Public Files Explorer can now fetch files directly from a GitHub repository. This is useful when you
              want to display files from a repository without having to deploy them with your application.
            </p>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">How it works:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Toggle the "Use GitHub Repository" switch at the top of the explorer</li>
                <li>The explorer will fetch files from the Jamal0602/files repository's public folder</li>
                <li>You can browse, preview, and download files directly from GitHub</li>
                <li>The GitHub icon button allows you to view the file on GitHub</li>
              </ol>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200 p-4 rounded-md">
              <p className="text-sm">
                <strong>Note:</strong> GitHub has rate limits for API requests. If you encounter errors, try switching
                back to local files or wait a few minutes before trying again.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FolderPlus className="mr-2 h-5 w-5" />
            Adding Files to the Public Folder
          </h2>

          <div className="space-y-4">
            <p>
              To make files appear in the Public Files Explorer when using local files, you need to add them to the{" "}
              <code>public</code> folder in your project.
            </p>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium mb-2">Steps:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Navigate to your project's root directory</li>
                <li>
                  Find or create the <code>public</code> folder
                </li>
                <li>Add your files to this folder or any subfolder within it</li>
                <li>
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Rebuild your application or refresh the explorer
                  </span>
                </li>
              </ol>
            </div>

            <div className="bg-muted/50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Example folder structure:</h3>
              <pre className="text-sm">
                {`your-project/
├── public/
│   ├── images/
│   │   ├── logo.png
│   │   └── banner.jpg
│   ├── documents/
│   │   └── guide.pdf
│   └── data.json
└── ... (other project files)`}
              </pre>
            </div>
          </div>
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Upload className="mr-2 h-5 w-5" />
            After Deployment
          </h2>

          <p>When your application is deployed, you have two options for displaying files:</p>

          <ol className="list-disc list-inside mt-2 space-y-2">
            <li>
              <strong>GitHub Repository:</strong> Toggle on "Use GitHub Repository" to fetch files from GitHub
            </li>
            <li>
              <strong>Local Files:</strong> When using local files, a manifest is generated during the build process
            </li>
          </ol>

          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/30 text-yellow-800 dark:text-yellow-200 rounded-md">
            <p className="text-sm">
              <strong>Note:</strong> When using local files, the file explorer reads from a manifest generated at build
              time. Files added after deployment won't appear until the next build.
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Explorer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
