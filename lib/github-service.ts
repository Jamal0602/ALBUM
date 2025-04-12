/**
 * Service to fetch files from a GitHub repository
 */

const GITHUB_API_BASE = "https://api.github.com"
const REPO_OWNER = "Jamal0602"
const REPO_NAME = "files"
const BRANCH = "main"

export interface GitHubFile {
  name: string
  path: string
  sha: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string | null
  type: "file" | "dir"
  _links: {
    self: string
    git: string
    html: string
  }
}

/**
 * Fetches contents of a directory from GitHub
 */
export async function fetchGitHubDirectory(path = "public"): Promise<GitHubFile[]> {
  const url = `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}

/**
 * Converts GitHub files to our application's FileType format
 */
export function convertGitHubFilesToFileType(files: GitHubFile[], basePath = "public"): any[] {
  return files.map((file) => {
    // Extract file extension if it's a file
    const extension = file.type === "file" && file.name.includes(".") ? file.name.split(".").pop() : undefined

    return {
      name: file.name,
      path: file.path,
      type: file.type === "dir" ? "directory" : "file",
      size: file.size,
      extension,
      url: file.download_url,
      // We don't have lastModified from the GitHub API
      lastModified: new Date().toISOString(),
    }
  })
}
