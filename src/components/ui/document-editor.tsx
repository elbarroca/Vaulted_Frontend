import * as React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/theme-provider"
import { Squares } from "@/components/Landing/squares-background"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface DocumentEditorProps {
  initialContent?: string
  initialTitle?: string
  onSave?: (title: string, content: string) => void
}

export function DocumentEditor({ initialContent = "", initialTitle = "Untitled Document", onSave }: DocumentEditorProps) {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const isDark = theme === "dark"
  
  const [content, setContent] = React.useState(initialContent)
  const [title, setTitle] = React.useState(initialTitle)
  const [isPreview, setIsPreview] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave?.(title, content)
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Error saving document:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <Squares
          className="opacity-25"
          direction="diagonal"
          speed="slow"
          squareSize={80}
          hoverFillColor="var(--primary)"
          borderColor={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
        />
      </div>

      {/* Header */}
      <header className={cn(
        "sticky top-0 z-50 w-full border-b",
        isDark ? "bg-background/80" : "bg-background/80",
        "backdrop-blur-sm"
      )}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className={cn(
                "rounded-full",
                isDark ? "hover:bg-blue-500/10" : "hover:bg-blue-50"
              )}
            >
              <Icons.chevronLeft className="h-5 w-5" />
            </Button>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-9 w-[200px] lg:w-[300px] bg-transparent border-none text-lg font-medium focus-visible:ring-0"
              placeholder="Untitled Document"
            />
          </div>

          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPreview(!isPreview)}
                    className={cn(
                      "rounded-full",
                      isDark ? "hover:bg-blue-500/10" : "hover:bg-blue-50"
                    )}
                  >
                    <Icons.eye className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isPreview ? "Edit Mode" : "Preview Mode"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              onClick={handleSave}
              className="gap-2"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Icons.loader className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Icons.save className="h-4 w-4" />
                  Save
                </>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-full",
                    isDark ? "hover:bg-blue-500/10" : "hover:bg-blue-50"
                  )}
                >
                  <Icons.moreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Icons.share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Icons.download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Icons.trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Editor */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {isPreview ? (
            <div className="prose dark:prose-invert max-w-none">
              {/* Add markdown preview here */}
              {content}
            </div>
          ) : (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[500px] resize-none bg-transparent border-none focus-visible:ring-0 text-lg"
              placeholder="Start writing..."
            />
          )}
        </div>
      </main>
    </div>
  )
} 