// lib/file-management.ts

// Remove direct fs imports as they're not available in the browser
// We'll use fetch API to call our server endpoints instead

export async function saveFileContent(
  filePath: string,
  content: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch("/api/files/save", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: filePath, content }),
    })

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error("Error saving file:", error)
    return { success: false, message: error.message || "Failed to save file" }
  }
}

export async function deleteItem(filePath: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch("/api/files/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: filePath }),
    })

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error("Error deleting item:", error)
    return { success: false, message: error.message || "Failed to delete item" }
  }
}

export async function renameItem(
  filePath: string,
  newName: string,
): Promise<{ success: boolean; message?: string; newPath?: string }> {
  try {
    const response = await fetch("/api/files/rename", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: filePath, newName }),
    })

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error("Error renaming item:", error)
    return { success: false, message: error.message || "Failed to rename item" }
  }
}

export async function moveItem(
  sourcePath: string,
  destinationPath: string,
): Promise<{ success: boolean; message?: string; newPath?: string }> {
  try {
    const response = await fetch("/api/files/move", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sourcePath, destinationPath }),
    })

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error("Error moving item:", error)
    return { success: false, message: error.message || "Failed to move item" }
  }
}

export async function createFile(
  filePath: string,
  fileName: string,
): Promise<{ success: boolean; message?: string; path?: string }> {
  try {
    const response = await fetch("/api/files/create-file", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: filePath, fileName }),
    })

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error("Error creating file:", error)
    return { success: false, message: error.message || "Failed to create file" }
  }
}

export async function createFolder(
  folderPath: string,
  folderName: string,
): Promise<{ success: boolean; message?: string; path?: string }> {
  try {
    const response = await fetch("/api/files/create-folder", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ path: folderPath, folderName }),
    })

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error("Error creating folder:", error)
    return { success: false, message: error.message || "Failed to create folder" }
  }
}

export async function uploadFile(
  uploadPath: string,
  file: File,
): Promise<{ success: boolean; message?: string; file?: any }> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("path", uploadPath)

    const response = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
    })

    const data = await response.json()
    return data
  } catch (error: any) {
    console.error("Error uploading file:", error)
    return { success: false, message: error.message || "Failed to upload file" }
  }
}
