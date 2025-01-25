import { useParams, useNavigate } from "react-router-dom"
import { DocumentEditor } from "@/components/ui/document-editor"
import { useToast } from "@/components/ui/use-toast"

export function DocumentPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSave = async (title: string, content: string) => {
    try {
      // Here you would typically save to your backend
      // For now, we'll just show a success message
      toast({
        title: "Document saved",
        description: "Your document has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error saving document",
        description: "There was an error saving your document. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <DocumentEditor
      initialTitle={id ? undefined : "Untitled Document"}
      onSave={handleSave}
    />
  )
} 