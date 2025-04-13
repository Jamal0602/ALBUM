"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Save, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { saveFileContent } from "@/lib/file-management"

interface TextEditorProps {
  content: string
  fileUrl: string
  onClose: () => void
  readOnly?: boolean
}

export function TextEditor({ content, fileUrl, onClose, readOnly = false }: TextEditorProps) {
  const [text, setText] = useState(content)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (readOnly) return

    setIsSaving(true)
    try {
      // Call the API to save the file
      const result = await saveFileContent(fileUrl, text)

      if (result.success) {
        toast({
          title: "File saved",
          description: "Your changes have been saved successfully.",
        })
      } else {
        toast({
          title: "Error saving file",
          description: result.message || "Failed to save file",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error saving file",
        description: "There was an error saving your changes.",
        variant: "destructive",
      })
      console.error("Error saving file:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium">
          {readOnly ? "Viewing" : "Editing"}: {fileUrl.split("/").pop()}
        </h3>
        <div className="flex gap-2">
          {!readOnly && (
            <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-1" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Textarea
        className="flex-1 font-mono text-sm resize-none min-h-[300px]"
        value={text}
        onChange={(e) => setText(e.target.value)}
        readOnly={readOnly}
      />
    </div>
  )
}
