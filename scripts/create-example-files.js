const fs = require("fs")
const path = require("path")

// Function to create a directory if it doesn't exist
function createDirIfNotExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
    console.log(`Created directory: ${dirPath}`)
  }
}

// Function to create a text file with content
function createTextFile(filePath, content) {
  fs.writeFileSync(filePath, content)
  console.log(`Created file: ${filePath}`)
}

// Function to create a JSON file with data
function createJsonFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
  console.log(`Created file: ${filePath}`)
}

// Main function to create example files
function createExampleFiles() {
  const publicDir = path.join(process.cwd(), "public")

  // Create public directory if it doesn't exist
  createDirIfNotExists(publicDir)

  // Create subdirectories
  const imagesDir = path.join(publicDir, "images")
  const docsDir = path.join(publicDir, "documents")
  const dataDir = path.join(publicDir, "data")

  createDirIfNotExists(imagesDir)
  createDirIfNotExists(docsDir)
  createDirIfNotExists(dataDir)

  // Create example text files
  createTextFile(
    path.join(docsDir, "readme.txt"),
    "This is an example text file created for testing the Public Files Explorer.\n\nYou can add more files to the public directory to see them in the explorer.",
  )

  createTextFile(
    path.join(publicDir, "example.md"),
    "# Example Markdown File\n\nThis is an example markdown file created for testing the Public Files Explorer.\n\n## Features\n\n- View files\n- Download files\n- Share files",
  )

  // Create example JSON files
  createJsonFile(path.join(dataDir, "config.json"), {
    name: "Public Files Explorer",
    version: "1.0.0",
    description: "A file explorer for the public directory",
    features: ["View files", "Download files", "Share files"],
  })

  createJsonFile(path.join(dataDir, "sample-data.json"), {
    users: [
      { id: 1, name: "John Doe", email: "john@example.com" },
      { id: 2, name: "Jane Smith", email: "jane@example.com" },
      { id: 3, name: "Bob Johnson", email: "bob@example.com" },
    ],
    products: [
      { id: 1, name: "Product A", price: 19.99 },
      { id: 2, name: "Product B", price: 29.99 },
      { id: 3, name: "Product C", price: 39.99 },
    ],
  })

  // Create a simple SVG image
  const svgContent = `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#f0f0f0" />
  <circle cx="50" cy="50" r="40" stroke="#333" stroke-width="2" fill="#6366f1" />
  <text x="50" y="55" font-family="Arial" font-size="12" text-anchor="middle" fill="white">Example</text>
</svg>`

  createTextFile(path.join(imagesDir, "example.svg"), svgContent)

  console.log("\nExample files created successfully!")
  console.log("Run the file explorer to see these files.")
}

// Run the function
createExampleFiles()
