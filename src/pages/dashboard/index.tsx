import { useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { FileUploadModal } from "@/components/ui/file-upload-modal"
import { Sidebar } from "@/components/ui/sidebar"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/components/theme-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Squares } from "@/components/Landing/squares-background"
import React from "react"
import { FileCard } from "@/components/ui/file-card"

type BrowserFile = globalThis.File
type CustomFile = {
  id: string
  name: string
  type: string
  size: number
  url?: string
  previewUrl?: string
  starred?: boolean
  createdAt: string
  folderId?: string | null
}

interface Folder {
  id: string
  name: string
  icon?: keyof typeof Icons
  color?: string
  parentId?: string | null
  files?: CustomFile[]
  created?: string
}

interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
  readonly webkitRelativePath: string;
  readonly type: string;
}

const FilePreviewDialog = ({ file, onClose }: { file: CustomFile; onClose: () => void }) => {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[80vh]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">{file.name}</h2>
            <div className="flex items-center gap-2">
              {file.url && (
                <Button variant="outline" size="icon" onClick={() => window.open(file.url, '_blank')}>
                  <Icons.download className="h-4 w-4" />
                </Button>
              )}
              <Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10">
                <Icons.trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1 bg-muted rounded-lg overflow-hidden">
            {file.type === "pdf" && file.url && (
              <iframe src={file.url} className="w-full h-full" />
            )}
            {file.type === "document" && (
              <div className="p-4">
                <p className="text-muted-foreground">Preview not available for this file type.</p>
              </div>
            )}
            {file.type === "spreadsheet" && (
              <div className="p-4">
                <p className="text-muted-foreground">Preview not available for this file type.</p>
              </div>
            )}
            {file.type === "image" && file.previewUrl && (
              <img src={file.previewUrl} alt={file.name} className="w-full h-full object-contain" />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const FolderCard = ({ folder, onClick }: { folder: Folder; onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className="group relative aspect-square rounded-xl border bg-card/50 backdrop-blur-sm p-6 hover:bg-card/80 hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer"
    onClick={onClick}
  >
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-4">
        <motion.div 
          className="p-4 w-fit rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icons.folder className="h-8 w-8" />
        </motion.div>
        <div>
          <h3 className="font-medium truncate group-hover:text-primary transition-colors text-base">{folder.name}</h3>
          <p className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors mt-1">
            {folder.files?.length} files
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground group-hover:text-primary/80 transition-colors">{folder.created}</span>
      </div>
    </div>
  </motion.div>
)

const CreateFolderDialog = ({ onClose, onCreate }: { onClose: () => void; onCreate: (name: string) => void }) => {
  const [folderName, setFolderName] = useState("")

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Create New Folder</h2>
          <Input
            placeholder="Folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => {
              onCreate(folderName)
              onClose()
            }}>Create</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface UploadAreaProps {
  onUpload: (files: CustomFile[]) => void
}

const UploadArea = ({ onUpload }: UploadAreaProps) => {
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFiles = (browserFiles: BrowserFile[]) => {
    const newFiles: CustomFile[] = browserFiles.map((file) => ({
      id: `new-${Date.now()}-${file.name}`,
      name: file.name,
      type: file.type,
      size: file.size,
      createdAt: new Date().toISOString(),
      folderId: null
    }))
    onUpload(newFiles)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFiles(files)
    }
  }

  return (
    <motion.div
      className={cn(
        "relative rounded-xl border-2 border-dashed p-8 transition-all duration-300",
        isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted-foreground/25",
        "bg-background/50 backdrop-blur-sm hover:border-primary/50 hover:bg-background/60"
      )}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragging(false)
        }
      }}
      onDrop={handleDrop}
      whileHover={{ scale: 1.01 }}
      animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={(e) => {
          if (e.target.files?.length) {
            handleFiles(Array.from(e.target.files))
          }
        }}
      />
      <div className="flex flex-col items-center justify-center gap-4">
        <motion.div 
          className="rounded-full bg-primary/10 p-4"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icons.upload className="h-6 w-6 text-primary" />
        </motion.div>
        <div className="text-center">
          <h3 className="text-lg font-semibold">Drop files here or click to upload</h3>
          <p className="text-sm text-muted-foreground">
            Support for documents, spreadsheets, PDFs, and images
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-2 gap-2 hover:bg-primary/10 transition-all duration-300"
          onClick={() => fileInputRef.current?.click()}
        >
          <Icons.upload className="h-4 w-4" />
          Select Files
        </Button>
      </div>
    </motion.div>
  )
}

// Add these utility functions
const getFileType = (file: File | CustomFile): string => {
  if ('type' in file) {
    if (file.type.includes('image')) return 'image'
    if (file.type.includes('video')) return 'video'
    if (file.type.includes('audio')) return 'audio'
    if (file.type.includes('pdf')) return 'pdf'
    if (file.type.includes('document')) return 'document'
    if (file.type.includes('spreadsheet')) return 'spreadsheet'
  }
  const extension = file.name.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'pdf': return 'pdf'
    case 'doc':
    case 'docx': return 'document'
    case 'xls':
    case 'xlsx': return 'spreadsheet'
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return 'image'
    case 'mp4':
    case 'mov': return 'video'
    case 'mp3':
    case 'wav': return 'audio'
    default: return 'file'
  }
}

const generatePreviewUrl = async (file: BrowserFile): Promise<string | undefined> => {
  if (file.type.startsWith('image/')) {
    return URL.createObjectURL(file)
  }
  return undefined
}

const formatTotalSize = (bytes: number): string => {
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

export function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark"
  
  const [currentFolderId, setCurrentFolderId] = React.useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = React.useState(false)
  const [folders, setFolders] = React.useState<Folder[]>([
    { id: "1", name: "Documents", icon: "fileText", files: [], created: "2024-01-25" },
    { id: "2", name: "Images", icon: "image", files: [], created: "2024-01-25" },
    { id: "3", name: "Videos", icon: "fileText", files: [], created: "2024-01-25" },
    { id: "4", name: "Projects", icon: "folder", files: [], created: "2024-01-25" }
  ])
  
  const [files, setFiles] = React.useState<CustomFile[]>([
    {
      id: "1",
      name: "Project Proposal.pdf",
      type: "application/pdf",
      size: 2.5 * 1024 * 1024,
      createdAt: "2024-01-25",
      folderId: "1"
    },
    {
      id: "2",
      name: "Meeting Notes.docx",
      type: "application/docx",
      size: 1.2 * 1024 * 1024,
      createdAt: "2024-01-24",
      starred: true,
      folderId: "1"
    }
  ])

  const currentFolder = folders.find(f => f.id === currentFolderId)
  const filteredFiles = files.filter(f => f.folderId === currentFolderId)
  const starredFiles = files.filter(f => f.starred)
  const recentFiles = [...files].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 5)

  const [isUploading, setIsUploading] = React.useState(false)

  const handleFileUpload = async (uploadedFiles: FileList | BrowserFile[]) => {
    setIsUploading(true)
    try {
      const browserFiles = Array.from(uploadedFiles)
      const newFiles: CustomFile[] = await Promise.all(
        browserFiles.map(async (file, index) => {
          const previewUrl = await generatePreviewUrl(file)
          return {
            id: `new-${Date.now()}-${index}`,
            name: file.name,
            type: getFileType(file as File | CustomFile),
            size: file.size,
            createdAt: new Date().toISOString(),
            folderId: currentFolderId,
            previewUrl,
            url: URL.createObjectURL(file)
          }
        })
      )

      setFiles(prev => [...prev, ...newFiles])
      setShowUploadModal(false)
      
      // Simulate API upload
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Files uploaded successfully')
    } catch (error) {
      console.error('Error uploading files:', error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreateFolder = () => {
    const dialog = document.createElement('dialog')
    dialog.innerHTML = `
      <div class="p-4 rounded-lg shadow-lg">
        <h2 class="text-lg font-semibold mb-4">Create New Folder</h2>
        <input type="text" placeholder="Folder name" class="w-full p-2 border rounded mb-4">
        <div class="flex justify-end gap-2">
          <button class="px-4 py-2 rounded bg-gray-200">Cancel</button>
          <button class="px-4 py-2 rounded bg-blue-500 text-white">Create</button>
        </div>
      </div>
    `
    document.body.appendChild(dialog)
    dialog.showModal()

    const [cancelBtn, createBtn] = dialog.querySelectorAll('button')
    const input = dialog.querySelector('input')

    cancelBtn.onclick = () => {
      dialog.close()
      document.body.removeChild(dialog)
    }

    createBtn.onclick = () => {
      const folderName = input?.value
      if (folderName) {
        const newFolder: Folder = {
          id: `folder-${Date.now()}`,
          name: folderName,
          icon: "folder",
          parentId: currentFolderId,
          files: [],
          created: new Date().toISOString()
        }
        setFolders(prev => [...prev, newFolder])
      }
      dialog.close()
      document.body.removeChild(dialog)
    }
  }

  const handleStarFile = (fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, starred: !file.starred } : file
    ))
  }

  const handleDeleteFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (!file) return

    const dialog = document.createElement('dialog')
    dialog.innerHTML = `
      <div class="p-4 rounded-lg shadow-lg">
        <h2 class="text-lg font-semibold mb-4">Delete File</h2>
        <p class="mb-4">Are you sure you want to delete "${file.name}"?</p>
        <div class="flex justify-end gap-2">
          <button class="px-4 py-2 rounded bg-gray-200">Cancel</button>
          <button class="px-4 py-2 rounded bg-red-500 text-white">Delete</button>
        </div>
      </div>
    `
    document.body.appendChild(dialog)
    dialog.showModal()

    const [cancelBtn, deleteBtn] = dialog.querySelectorAll('button')

    cancelBtn.onclick = () => {
      dialog.close()
      document.body.removeChild(dialog)
    }

    deleteBtn.onclick = () => {
      setFiles(prev => prev.filter(f => f.id !== fileId))
      dialog.close()
      document.body.removeChild(dialog)
    }
  }

  const handleShareFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (!file) return

    const dialog = document.createElement('dialog')
    dialog.innerHTML = `
      <div class="p-4 rounded-lg shadow-lg">
        <h2 class="text-lg font-semibold mb-4">Share "${file.name}"</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Share Link</label>
            <div class="flex gap-2">
              <input type="text" value="${window.location.origin}/share/${fileId}" readonly class="w-full p-2 border rounded bg-gray-50">
              <button class="px-4 py-2 rounded bg-blue-500 text-white copy-btn">Copy</button>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Share with email</label>
            <input type="email" placeholder="Enter email address" class="w-full p-2 border rounded">
          </div>
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <button class="px-4 py-2 rounded bg-gray-200 close-btn">Close</button>
          <button class="px-4 py-2 rounded bg-blue-500 text-white share-btn">Share</button>
        </div>
      </div>
    `
    document.body.appendChild(dialog)
    dialog.showModal()

    const closeBtn = dialog.querySelector('.close-btn') as HTMLButtonElement
    const shareBtn = dialog.querySelector('.share-btn') as HTMLButtonElement
    const copyBtn = dialog.querySelector('.copy-btn') as HTMLButtonElement
    const linkInput = dialog.querySelector('input[type="text"]') as HTMLInputElement
    const emailInput = dialog.querySelector('input[type="email"]') as HTMLInputElement

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(linkInput.value)
      copyBtn.textContent = 'Copied!'
      setTimeout(() => {
        copyBtn.textContent = 'Copy'
      }, 2000)
    })

    closeBtn.addEventListener('click', () => {
      dialog.close()
      document.body.removeChild(dialog)
    })

    shareBtn.addEventListener('click', () => {
      const email = emailInput.value
      if (email) {
        console.log(`Sharing ${file.name} with ${email}`)
      }
      dialog.close()
      document.body.removeChild(dialog)
    })
  }

  const handleDownloadFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (!file?.url) {
      console.error('Download URL not available')
      return
    }

    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="flex h-screen bg-background relative overflow-hidden">
      {/* Layered Background Pattern */}
      <div className="absolute inset-0 -z-10">
        {/* Primary Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95" />
        
        {/* Animated Squares Layer 1 - Slower, Larger */}
        <Squares
          className="opacity-[0.07]"
          direction="diagonal"
          speed={0.2}
          squareSize={80}
          hoverFillColor={isDark ? "rgba(59, 130, 246, 0.2)" : "rgba(59, 130, 246, 0.1)"}
          borderColor={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
        />
        
        {/* Animated Squares Layer 2 - Faster, Smaller */}
        <Squares
          className="opacity-[0.05]"
          direction="up"
          speed={0.4}
          squareSize={40}
          hoverFillColor={isDark ? "rgba(99, 102, 241, 0.2)" : "rgba(99, 102, 241, 0.1)"}
          borderColor={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}
        />
      </div>

      <Sidebar
        currentFolderId={currentFolderId}
        folders={folders}
        onFolderSelect={setCurrentFolderId}
      />
      
      <main className="flex-1 overflow-auto">
        <div className={cn(
          "container mx-auto px-8 py-6",
          isDark ? "bg-background/40" : "bg-background/40",
          "backdrop-blur-md"
        )}>
          {/* Header with Gradient Border */}
          <header className="relative mb-8 pb-6">
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            <div className="flex items-center justify-between">
              <div>
                <motion.h1 
                  className={cn(
                    "text-4xl font-bold mb-2",
                    isDark 
                      ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400"
                      : "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600"
                  )}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentFolder?.name || "My Files"}
                </motion.h1>
                <motion.div 
                  className="flex items-center gap-3 text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-lg">{files.length} file{files.length !== 1 && "s"}</span>
                  <span className="text-border/60">•</span>
                  <span className="text-lg">{formatTotalSize(files.reduce((acc, file) => acc + file.size, 0))}</span>
                </motion.div>
              </div>
              
              <div className="flex items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className={cn(
                        "flex items-center gap-2 px-6 h-11 rounded-full shadow-lg",
                        isDark 
                          ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:shadow-blue-500/10"
                          : "bg-blue-50 hover:bg-blue-100 text-blue-600 hover:shadow-blue-500/5",
                        "transition-all duration-300 hover:scale-105"
                      )}>
                        <Icons.add className="w-5 h-5" />
                        <span className="font-medium">Create New</span>
                        <Icons.chevronDown className="w-4 h-4 ml-1 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className={cn(
                      "w-56 p-2",
                      isDark ? "bg-background/80" : "bg-white/80",
                      "backdrop-blur-sm border-border/20"
                    )}>
                      <DropdownMenuItem 
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer hover:bg-primary/10"
                      >
                        <Icons.upload className="w-4 h-4" />
                        Upload Files
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={handleCreateFolder}
                        className="flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer hover:bg-primary/10"
                      >
                        <Icons.folder className="w-4 h-4" />
                        New Folder
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate("/document/new")}
                        className="flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer hover:bg-primary/10"
                      >
                        <Icons.fileText className="w-4 h-4" />
                        New Document
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              </div>
            </div>
          </header>

          {/* Quick Access Section */}
          <motion.section 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className={cn(
                  "text-2xl font-semibold",
                  isDark ? "text-blue-400" : "text-blue-600"
                )}>Quick Access</h2>
                <span className="text-sm text-muted-foreground">Recently accessed files</span>
              </div>
              <Button
                variant="ghost"
                className={cn(
                  "text-sm gap-2 hover:bg-primary/10",
                  isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
                )}
              >
                View All
                <Icons.arrowRight className="w-3 h-3" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentFiles.slice(0, 4).map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    delay: 0.1 * index,
                    duration: 0.3,
                    ease: "easeOut"
                  }}
                >
                  <FileCard
                    file={file}
                    onStar={() => handleStarFile(file.id)}
                    onDelete={() => handleDeleteFile(file.id)}
                    onShare={() => handleShareFile(file.id)}
                    onDownload={() => handleDownloadFile(file.id)}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Tabs Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "rounded-xl border",
              isDark 
                ? "bg-background/40 border-border/30"
                : "bg-white/40 border-border/10",
              "backdrop-blur-md shadow-lg"
            )}
          >
            <Tabs defaultValue="all" className="p-6">
              <TabsList className={cn(
                "p-1 gap-1",
                isDark 
                  ? "bg-background/60"
                  : "bg-white/60",
                "backdrop-blur-sm rounded-lg"
              )}>
                <TabsTrigger value="all" className="rounded-md px-6 data-[state=active]:bg-primary/20">
                  <span className="flex items-center gap-2">
                    <Icons.folder className="w-4 h-4" />
                    All Files
                  </span>
                </TabsTrigger>
                <TabsTrigger value="recent" className="rounded-md px-6 data-[state=active]:bg-primary/20">
                  <span className="flex items-center gap-2">
                    <Icons.clock className="w-4 h-4" />
                    Recent
                  </span>
                </TabsTrigger>
                <TabsTrigger value="starred" className="rounded-md px-6 data-[state=active]:bg-primary/20">
                  <span className="flex items-center gap-2">
                    <Icons.star className="w-4 h-4" />
                    Starred
                  </span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="rounded-md px-6 data-[state=active]:bg-primary/20">
                  <span className="flex items-center gap-2">
                    <Icons.fileText className="w-4 h-4" />
                    Documents
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-8">
                {files.length === 0 ? (
                  <motion.div 
                    className={cn(
                      "text-center py-16 rounded-xl border",
                      isDark 
                        ? "bg-background/40 border-border/30"
                        : "bg-white/40 border-border/10",
                      "backdrop-blur-sm"
                    )}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="relative w-20 h-20 mx-auto mb-6">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
                      <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-pulse" />
                      <div className="relative z-10 flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10">
                        <Icons.file className="w-10 h-10 text-blue-500" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-medium mb-3">No files yet</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      Upload your first file or create a new document to get started with your workspace.
                    </p>
                    <Button
                      onClick={() => setShowUploadModal(true)}
                      className={cn(
                        "flex items-center gap-2 px-8 h-11 rounded-full",
                        isDark 
                          ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                          : "bg-blue-50 hover:bg-blue-100 text-blue-600",
                        "hover:scale-105 transition-all duration-300"
                      )}
                    >
                      <Icons.upload className="w-4 h-4" />
                      Upload Files
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  >
                    {files.map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          delay: 0.05 * index,
                          duration: 0.3,
                          ease: "easeOut"
                        }}
                      >
                        <FileCard
                          file={file}
                          onStar={() => handleStarFile(file.id)}
                          onDelete={() => handleDeleteFile(file.id)}
                          onShare={() => handleShareFile(file.id)}
                          onDownload={() => handleDownloadFile(file.id)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="recent" className="mt-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {files
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 12)
                    .map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          delay: 0.05 * index,
                          duration: 0.3,
                          ease: "easeOut"
                        }}
                      >
                        <FileCard
                          file={file}
                          onStar={() => handleStarFile(file.id)}
                          onDelete={() => handleDeleteFile(file.id)}
                          onShare={() => handleShareFile(file.id)}
                          onDownload={() => handleDownloadFile(file.id)}
                        />
                      </motion.div>
                    ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="starred" className="mt-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {files
                    .filter(file => file.starred)
                    .map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          delay: 0.05 * index,
                          duration: 0.3,
                          ease: "easeOut"
                        }}
                      >
                        <FileCard
                          file={file}
                          onStar={() => handleStarFile(file.id)}
                          onDelete={() => handleDeleteFile(file.id)}
                          onShare={() => handleShareFile(file.id)}
                          onDownload={() => handleDownloadFile(file.id)}
                        />
                      </motion.div>
                    ))}
                </motion.div>
              </TabsContent>

              <TabsContent value="documents" className="mt-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {files
                    .filter(file => file.type === "document")
                    .map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ 
                          delay: 0.05 * index,
                          duration: 0.3,
                          ease: "easeOut"
                        }}
                      >
                        <FileCard
                          file={file}
                          onStar={() => handleStarFile(file.id)}
                          onDelete={() => handleDeleteFile(file.id)}
                          onShare={() => handleShareFile(file.id)}
                          onDownload={() => handleDownloadFile(file.id)}
                        />
                      </motion.div>
                    ))}
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>

      {/* Upload Modal */}
      <FileUploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
        isUploading={isUploading}
      />
    </div>
  )
} 