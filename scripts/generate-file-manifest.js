const fs = require("fs")
const path = require("path")

// Function to recursively scan a directory
function scanDirectory(dirPath, basePath = "") {
  const result = []
  const items = fs.readdirSync(dirPath)

  for (const item of items) {
    const itemPath = path.join(dirPath, item)
    const relativePath = path.join(basePath, item).replace(/\\/g, "/")
    const stats = fs.statSync(itemPath)

    if (stats.isDirectory()) {
      // It's a directory, add it and scan its contents
      result.push({
        name: item,
        path: relativePath,
        type: "directory",
        lastModified: stats.mtime.toISOString(),
        children: scanDirectory(itemPath, relativePath),
      })
    } else {
      // It's a file
      result.push({
        name: item,
        path: relativePath,
        type: "file",
        size: stats.size,
        extension: path.extname(item).slice(1),
        lastModified: stats.mtime.toISOString(),
      })
    }
  }

  // Sort directories first, then files alphabetically
  result.sort((a, b) => {
    if (a.type === "directory" && b.type !== "directory") return -1
    if (a.type !== "directory" && b.type === "directory") return 1
    return a.name.localeCompare(b.name)
  })

  return result
}

// Main function to generate the manifest
function generateManifest() {
  const publicDir = path.join(process.cwd(), "public")

  // Check if public directory exists
  if (!fs.existsSync(publicDir)) {
    console.error("Public directory not found!")
    return
  }

  // Scan the public directory
  const manifest = scanDirectory(publicDir)

  // Write the manifest to a JSON file in the public directory
  const manifestPath = path.join(publicDir, "file-manifest.json")
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

  console.log(`File manifest generated at ${manifestPath}`)
}

// Run the function
generateManifest()
