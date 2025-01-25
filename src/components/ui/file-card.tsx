import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { FilePreview } from "@/components/ui/file-preview"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"

interface FileCardProps {
  file: {
    id: string
    name: string
    type: string
    size: number
    url?: string
    previewUrl?: string
    starred?: boolean
    createdAt: string
  }
  onStar?: (id: string) => void
  onDelete?: (id: string) => void
  onShare?: (id: string) => void
  onDownload?: (id: string) => void
}

export function FileCard({ 
  file,
  onStar,
  onDelete,
  onShare,
  onDownload
}: FileCardProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  const getFileIcon = () => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    switch(extension) {
      case 'pdf':
        return <Icons.fileText className="h-5 w-5" />
      case 'doc':
      case 'docx':
        return <Icons.fileText className="h-5 w-5" />
      case 'xls':
      case 'xlsx':
        return <Icons.table className="h-5 w-5" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Icons.image className="h-5 w-5" />
      case 'mp4':
      case 'mov':
        return <Icons.fileText className="h-5 w-5" /> // Changed from video to fileText
      case 'md':
        return <Icons.file className="h-5 w-5" /> // Changed from fileCode to file
      default:
        return <Icons.file className="h-5 w-5" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(date)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <>
      <motion.div
        className={cn(
          "group relative overflow-hidden rounded-xl border",
          isDark 
            ? "bg-background/60 border-border/40 hover:border-blue-500/40"
            : "bg-white/60 border-border/10 hover:border-blue-500/20",
          "backdrop-blur-sm transition-colors duration-200"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        {/* Preview Area */}
        <div 
          className="relative aspect-[4/3] cursor-pointer"
          onClick={() => setIsPreviewOpen(true)}
        >
          {file.previewUrl ? (
            <img 
              src={file.previewUrl} 
              alt={file.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className={cn(
              "absolute inset-0 flex items-center justify-center",
              isDark ? "bg-muted/30" : "bg-muted/20"
            )}>
              {getFileIcon()}
            </div>
          )}
          
          {/* Hover Overlay */}
          <motion.div 
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={(e) => {
                e.stopPropagation()
                setIsPreviewOpen(true)
              }}
            >
              <Icons.fileText className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>

        {/* Info Area */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-1">
              <h3 className="font-medium truncate pr-4">{file.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formatSize(file.size)}</span>
                <span>•</span>
                <span>{formatDate(file.createdAt)}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "shrink-0",
                file.starred
                  ? isDark
                    ? "text-amber-400 hover:text-amber-400/80"
                    : "text-amber-500 hover:text-amber-500/80"
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => onStar?.(file.id)}
            >
              {file.starred ? <Icons.starFilled className="h-4 w-4" /> : <Icons.star className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
        >
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onShare?.(file.id)}
            >
              <Icons.share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onDownload?.(file.id)}
            >
              <Icons.download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete?.(file.id)}
            >
              <Icons.trash className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* File Preview Dialog */}
      {isPreviewOpen && (
        <FilePreview
          file={file}
          open={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onDelete={() => onDelete?.(file.id)}
          onShare={() => onShare?.(file.id)}   
          onDownload={() => onDownload?.(file.id)}
        />
      )}
    </>
  )
}