import { useNavigate, useParams } from "react-router-dom"
import { MarkdownEditor } from "@/components/ui/markdown-editor"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function DocumentPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDocument = async () => {
      if (id === 'new') {
        setContent("")
        setIsLoading(false)
        return
      }

      try {
        // Here you would typically fetch the document from your backend
        // const doc = await fetchDocument(id)
        // setContent(doc.content)
        setContent("Loading content...")
      } catch (err) {
        setError("Failed to load document")
      } finally {
        setIsLoading(false)
      }
    }

    loadDocument()
  }, [id])

  const handleSave = async (content: string) => {
    try {
      // Here you would typically save the content to your backend
      console.log('Saving content:', content)
      
      if (!id || id === 'new') {
        // TODO: Create document in backend
        // const newId = await createDocument(content)
        // navigate(`/document/${newId}`)
      }
    } catch (err) {
      console.error('Failed to save document:', err)
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-500 mb-2">Error</h2>
          <p className="text-muted-foreground">{error}</p>
          <button 
            onClick={() => navigate("/dashboard")}
            className="mt-4 text-primary hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-muted-foreground">Loading document...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen"
    >
      <MarkdownEditor
        initialContent={content}
        onSave={handleSave}
        onClose={() => navigate("/dashboard")}
      />
    </motion.div>
  )
}