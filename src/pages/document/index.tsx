import { useParams, useNavigate } from "react-router-dom"
import { DocumentEditor } from "@/components/ui/document-editor"
import { ToastSave } from "@/components/ui/toast-save"
import * as React from "react"

export function DocumentPage() {  
  const { id } = useParams()
  const navigate = useNavigate()
  const [saveState, setSaveState] = React.useState<"initial" | "loading" | "success">("initial")

  const handleSave = async (title: string, content: string) => {
    try {
      setSaveState("loading")
      // Here you would typically save to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      setSaveState("success")
      setTimeout(() => setSaveState("initial"), 2000)
    } catch (error) {
      setSaveState("initial")
    }
  }
  const handleReset = () => {
    // Reset document changes
    setSaveState("initial")
  }

  const handleSaveClick = () => {
    handleSave("", "") // Pass empty strings as placeholders
  }

  return (
    <div className="relative">
      <DocumentEditor
        initialTitle={id ? undefined : "Untitled Document"}
        onSave={handleSave}
      />
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <ToastSave
          state={saveState}
          onSave={handleSaveClick}
          onReset={handleReset}
          loadingText="Saving document..."
          successText="Document saved"
          initialText="Unsaved changes"
        />
      </div>
    </div>
  )
}