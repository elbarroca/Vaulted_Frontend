import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FileText, Table, Image, File, Share2, Trash, Star, StarIcon, Info, Download, MoreVertical } from "lucide-react"
import { FilePreview } from "@/components/ui/file-preview"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent } from "@/components/ui/dialog"

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
    location?: string
    lastAccessed?: string
    lastModified?: string
    owner?: string
    permissions?: string[]
  }
  onStar?: (id: string) => void
  onDelete?: (id: string) => void
  onShare?: (id: string) => void
  onDownload?: (id: string) => void
  onPreview?: (id: string) => void
}

export function FileCard({ 
  file,
  onStar,
  onDelete,
  onShare,
  onDownload,
  onPreview
}: FileCardProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  const getFileIcon = () => {
    const extension = file.name.split('.').pop()?.toLowerCase()
    
    switch(extension) {
      case 'pdf':
        return <FileText className="h-5 w-5" />
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5" />
      case 'xls':
      case 'xlsx':
        return <Table className="h-5 w-5" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Image className="h-5 w-5" />
      case 'mp4':
      case 'mov':
        return <FileText className="h-5 w-5" />
      case 'md':
        return <File className="h-5 w-5" />
      default:
        return <File className="h-5 w-5" />
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
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
              <Share2 className="h-3 w-3" />
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
              <Trash className="h-3 w-3" />
              Deleted
            </div>
          )}
        </div>

        {/* Preview Area */}
        <div 
          className="relative aspect-[4/3] cursor-pointer group"
          onClick={() => onPreview?.(file.id)}
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
          
          {/* Always Visible Actions */}
          <div className="absolute top-3 left-3 flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80",
                file.starred && "text-yellow-500"
              )}
              onClick={(e) => {
                e.stopPropagation()
                onStar?.(file.id)
              }}
            >
              {file.starred ? <StarIcon className="h-4 w-4" /> : <Star className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80"
              onClick={(e) => {
                e.stopPropagation()
                onShare?.(file.id)
              }}
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80"
              onClick={(e) => {
                e.stopPropagation()
                onDownload?.(file.id)
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80 text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.(file.id)
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-primary"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => onPreview?.(file.id)}
                >
                  <FileText className="h-4 w-4" />
                  Preview
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => onDownload?.(file.id)}
                >
                  <Download className="h-4 w-4" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => onShare?.(file.id)}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => onStar?.(file.id)}
                >
                  {file.starred ? <StarIcon className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                  {file.starred ? 'Unstar' : 'Star'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2"
                  onClick={() => onDelete?.(file.id)}
                >
                  <Trash className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                isDark ? "bg-muted/30" : "bg-muted/20"
              )}>
                {getFileIcon()}
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{file.name}</h2>
                <p className="text-sm text-muted-foreground">{formatSize(file.size)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Created</h4>
                  <p className="text-sm">{formatDate(file.createdAt)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Modified</h4>
                  <p className="text-sm">{formatDate(file.lastModified || file.createdAt)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Accessed</h4>
                  <p className="text-sm">{formatDate(file.lastAccessed || file.createdAt)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Type</h4>
                  <p className="text-sm capitalize">{file.type}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Location</h4>
                <p className="text-sm">{file.location || 'Root Directory'}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Owner</h4>
                <p className="text-sm">{file.owner || 'You'}</p>
              </div>

              {file.permissions && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {file.permissions.map((permission, index) => (
                      <div
                        key={index}
                        className={cn(
                          "px-2 py-1 rounded-md text-xs font-medium",
                          isDark ? "bg-muted/30" : "bg-muted/20"
                        )}
                      >
                        {permission}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              {onShare && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    setIsDetailsOpen(false)
                    onShare(file.id)
                  }}
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              )}
              {onDownload && (
                <Button
                  className="gap-2"
                  onClick={() => {
                    setIsDetailsOpen(false)
                    onDownload(file.id)
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  )
}