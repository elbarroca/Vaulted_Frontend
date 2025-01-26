import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { FilePreview } from "@/components/ui/file-preview"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

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
    shared?: boolean
    isDeleted?: boolean
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
          "backdrop-blur-sm transition-all duration-200"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {/* Status Indicators */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          {file.shared && (
            <div className={cn(
              "h-6 px-2 rounded-full flex items-center gap-1.5 text-xs font-medium",
              isDark 
                ? "bg-blue-500/20 text-blue-400"
                : "bg-blue-50 text-blue-600"
            )}>
              <Icons.share2 className="h-3 w-3" />
              Shared
            </div>
          )}
          {file.isDeleted && (
            <div className={cn(
              "h-6 px-2 rounded-full flex items-center gap-1.5 text-xs font-medium",
              isDark 
                ? "bg-red-500/20 text-red-400"
                : "bg-red-50 text-red-600"
            )}>
              <Icons.trash className="h-3 w-3" />
              Deleted
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div 
          className="relative aspect-[4/3] cursor-pointer group"
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
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsPreviewOpen(true)
                }}
              >
                <Icons.fileText className="h-4 w-4" />
              </Button>
              {onDownload && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDownload(file.id)
                  }}
                >
                  <Icons.download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </div>

        {/* File Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate" title={file.name}>
                {file.name}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <span>{formatSize(file.size)}</span>
                <span>•</span>
                <span>{formatDate(file.createdAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {onStar && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "hover:text-amber-500",
                    file.starred && "text-amber-500"
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    onStar(file.id)
                  }}
                >
                  {file.starred ? <Icons.starFilled className="h-4 w-4" /> : <Icons.star className="h-4 w-4" />}
                </Button>
              )}
              {onShare && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "hover:text-blue-500",
                    file.shared && "text-blue-500"
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    onShare(file.id)
                  }}
                >
                  <Icons.share2 className="h-4 w-4" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-primary"
                  >
                    <Icons.moreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="gap-2"
                    onClick={() => setIsPreviewOpen(true)}
                  >
                    <Icons.fileText className="h-4 w-4" />
                    Preview
                  </DropdownMenuItem>
                  {onDownload && (
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => onDownload(file.id)}
                    >
                      <Icons.download className="h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                  )}
                  {onShare && (
                    <DropdownMenuItem
                      className="gap-2"
                      onClick={() => onShare(file.id)}
                    >
                      <Icons.share2 className="h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      className="gap-2 text-red-500 focus:text-red-500"
                      onClick={() => onDelete(file.id)}
                    >
                      <Icons.trash className="h-4 w-4" />
                      {file.isDeleted ? 'Delete Forever' : 'Move to Trash'}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <FilePreview
          open={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          file={file}
          onDelete={onDelete}
          onShare={onShare}
          onDownload={onDownload}
        />
      )}
    </>
  )
}