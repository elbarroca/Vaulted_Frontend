import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"

interface FilePreviewProps {
  open: boolean
  onClose: () => void
  file: {
    name: string
    type: string
    size: number
    url?: string
    previewUrl?: string
    id: string
  }
  onDelete?: (id: string) => void
  onShare?: (id: string) => void
  onDownload?: (id: string) => void
}

export function FilePreview({ 
  open, 
  onClose, 
  file, 
  onDelete, 
  onShare, 
  onDownload 
}: FilePreviewProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const handleDelete = () => onDelete?.(file.id)
  const handleShare = () => onShare?.(file.id)
  const handleDownload = () => onDownload?.(file.id)

  const getFileIcon = () => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    switch(extension) {
      case 'pdf':
        return <Icons.fileText className="h-6 w-6" />
      case 'doc':
      case 'docx':
        return <Icons.fileText className="h-6 w-6" />
      case 'xls':
      case 'xlsx':
        return <Icons.table className="h-6 w-6" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Icons.image className="h-6 w-6" />
      case 'mp4':
      case 'mov':
        return <Icons.video className="h-6 w-6" />
      case 'md':
        return <Icons.fileCode className="h-6 w-6" />
      default:
        return <Icons.file className="h-6 w-6" />
    }
  }

  const renderPreview = () => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    if (!file.previewUrl && !file.url) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
          {getFileIcon()}
          <p className="mt-2 text-sm">Preview not available</p>
        </div>
      )
    }

    switch(extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <div className="relative w-full h-full min-h-[300px] bg-muted/30 rounded-lg overflow-hidden">
            <img 
              src={file.previewUrl || file.url} 
              alt={file.name}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        )
      case 'mp4':
      case 'mov':
        return (
          <div className="relative w-full h-full min-h-[300px] bg-muted/30 rounded-lg overflow-hidden">
            <video 
              src={file.url} 
              controls 
              className="absolute inset-0 w-full h-full"
            />
          </div>
        )
      case 'pdf':
        return (
          <iframe 
            src={file.url} 
            className="w-full h-[600px] rounded-lg"
          />
        )
      case 'md':
        return (
          <div className="w-full h-full min-h-[300px] p-6 bg-muted/30 rounded-lg">
            {/* Add markdown renderer here */}
            <pre className="text-sm">{file.previewUrl || file.url}</pre>
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
            {getFileIcon()}
            <p className="mt-2 text-sm">Preview not available</p>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0 gap-0 bg-transparent border-none shadow-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className={cn(
            "relative overflow-hidden rounded-2xl",
            isDark
              ? "bg-background/95 border border-border/40"
              : "bg-white/95 border border-border/10",
            "backdrop-blur-sm shadow-2xl"
          )}
        >
          {/* Header */}
          <div className={cn(
            "flex items-center justify-between p-4 border-b",
            isDark ? "border-border/40" : "border-border/10"
          )}>
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <h3 className="font-semibold">{file.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onShare && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                  className={cn(
                    "hover:bg-blue-500/10 hover:text-blue-500",
                    isDark ? "text-blue-400" : "text-blue-600"
                  )}
                >
                  <Icons.share2 className="h-4 w-4" />
                </Button>
              )}
              {onDownload && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  className={cn(
                    "hover:bg-green-500/10 hover:text-green-500",
                    isDark ? "text-green-400" : "text-green-600"
                  )}
                >
                  <Icons.download className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="hover:bg-red-500/10 hover:text-red-500"
                >
                  <Icons.trash className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-muted"
              >
                <Icons.x className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="p-6">
            {renderPreview()}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
} 