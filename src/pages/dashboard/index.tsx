import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { FileUploadModal } from "@/components/ui/file-upload-modal"
import { Sidebar } from "@/components/ui/sidebar"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTheme } from "@/components/theme-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Squares } from "@/components/Landing/squares-background"
import React from "react"
import { FileCard } from "@/components/ui/file-card"
import { Label } from "@/components/ui/label"
import { CreateFolderModal } from "@/components/ui/create-folder-modal"
import { ShareFileModal } from "@/components/ui/share-file-modal"
import { DeleteFileModal } from "@/components/ui/delete-file-modal"
import { EnhancedShareModal } from "@/components/ui/enhanced-share-modal"
import { useWallet } from "@/contexts/WalletProvider"
import { BucketCreationDialog } from "@/components/BucketCreationDialog"
import { toast } from "@/hooks/use-toast"

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
  isDeleted?: boolean
  shared?: boolean
  lastModified: string
  lastAccessed: string
  location: string
  owner: string
  permissions: string[]
  cid?: string
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
      folderId: null,
      lastModified: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      location: "",
      owner: "",
      permissions: [],
      previewUrl: undefined
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
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState<"date" | "name" | "size" | "type">("date")
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
      type: "pdf",
      size: 2.5 * 1024 * 1024,
      createdAt: "2024-01-25",
      lastModified: "2024-01-26",
      lastAccessed: "2024-01-27",
      location: "/Documents/Projects",
      owner: "John Doe",
      permissions: ["read", "write", "share"],
      previewUrl: "https://picsum.photos/seed/1/800/600",
      folderId: "1"
    },
    {
      id: "2",
      name: "Meeting Notes.docx",
      type: "document",
      size: 1.2 * 1024 * 1024,
      createdAt: "2024-01-24",
      lastModified: "2024-01-24",
      lastAccessed: "2024-01-27",
      location: "/Documents/Meetings",
      owner: "John Doe",
      permissions: ["read", "write"],
      starred: true,
      folderId: "1"
    },
    {
      id: "3",
      name: "Product Launch.jpg",
      type: "image",
      size: 3.7 * 1024 * 1024,
      createdAt: "2024-01-23",
      lastModified: "2024-01-23",
      lastAccessed: "2024-01-27",
      location: "/Images/Marketing",
      owner: "John Doe",
      permissions: ["read", "write", "share"],
      previewUrl: "https://picsum.photos/seed/2/800/600",
      shared: true,
      folderId: "2"
    },
    {
      id: "4",
      name: "Financial Report.xlsx",
      type: "spreadsheet",
      size: 1.8 * 1024 * 1024,
      createdAt: "2024-01-22",
      lastModified: "2024-01-26",
      lastAccessed: "2024-01-27",
      location: "/Documents/Finance",
      owner: "John Doe",
      permissions: ["read"],
      starred: true,
      folderId: "1"
    },
    {
      id: "5",
      name: "Team Photo.png",
      type: "image",
      size: 4.2 * 1024 * 1024,
      createdAt: "2024-01-21",
      lastModified: "2024-01-21",
      lastAccessed: "2024-01-27",
      location: "/Images/Team",
      owner: "John Doe",
      permissions: ["read", "write"],
      previewUrl: "https://picsum.photos/seed/3/800/600",
      folderId: "2"
    },
    {
      id: "6",
      name: "Project Timeline.md",
      type: "markdown",
      size: 0.5 * 1024 * 1024,
      createdAt: "2024-01-20",
      lastModified: "2024-01-25",
      lastAccessed: "2024-01-27",
      location: "/Documents/Projects",
      owner: "John Doe",
      permissions: ["read", "write", "share"],
      folderId: "1"
    }
  ])

  const currentFolder = folders.find(f => f.id === currentFolderId)
  const filteredFiles = React.useMemo(() => {
    if (!currentFolderId) {
      switch (location.pathname) {
        case '/dashboard/trash':
          return files.filter(f => f.isDeleted)
        case '/dashboard/starred':
          return files.filter(f => f.starred)
        case '/dashboard/recent':
          return [...files].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ).slice(0, 12)
        case '/dashboard/shared':
          return files.filter(f => f.shared)
        default:
          return files
      }
    }
    return files.filter(f => f.folderId === currentFolderId)
  }, [files, currentFolderId, location.pathname])

  // Enhanced search and sort functionality
  const filteredAndSortedFiles = React.useMemo(() => {
    let result = filteredFiles

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(file => 
        file.name.toLowerCase().includes(query) || 
        file.type.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "name":
          return a.name.localeCompare(b.name)
        case "size":
          return b.size - a.size
        case "type":
          return a.type.localeCompare(b.type)
        default:
          return 0
      }
    })
  }, [filteredFiles, searchQuery, sortBy])

  const [isUploading, setIsUploading] = React.useState(false)
  const [showCreateFolderModal, setShowCreateFolderModal] = React.useState(false)
  const [showShareModal, setShowShareModal] = React.useState(false)
  const [selectedFile, setSelectedFile] = React.useState<CustomFile | null>(null)
  const [showDeleteModal, setShowDeleteModal] = React.useState(false)
  const [fileToDelete, setFileToDelete] = React.useState<CustomFile | null>(null)

  const { downloadFile: walletDownloadFile, signMessage } = useWallet();

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
            url: URL.createObjectURL(file),
            lastModified: new Date().toISOString(),
            lastAccessed: new Date().toISOString(),
            location: "",
            owner: "",
            permissions: []
          }
        })
      )

      setFiles(prev => [...prev, ...newFiles])
      
      // Update folder with new files
      if (currentFolderId) {
        setFolders(prev => prev.map(folder => {
          if (folder.id === currentFolderId) {
            return {
              ...folder,
              files: [...(folder.files || []), ...newFiles]
            }
          }
          return folder
        }))
      }
      
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

  const handleCreateFolder = (name: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: name,
      icon: "folder",
      parentId: currentFolderId,
      files: [],
      created: new Date().toISOString()
    }
    setFolders(prev => [...prev, newFolder])
    setCurrentFolderId(newFolder.id)
  }

  const handleStarFile = (fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, starred: !file.starred } : file
    ))
  }

  const handleDeleteFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (!file) return
    setFileToDelete(file)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
      
    // Remove file from folder
    const file = files.find(f => f.id === fileId)
    if (file?.folderId) {
      setFolders(prev => prev.map(folder => {
        if (folder.id === file.folderId) {
          return {
            ...folder,
            files: (folder.files || []).filter(f => f.id !== fileId)
          }
        }
        return folder
      }))
    }
  }

  const handleShareFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId)
    if (!file) return
    setSelectedFile(file)
    setShowShareModal(true)
  }

  const handleEmailShare = (email: string) => {
    if (selectedFile) {
      console.log(`Sharing ${selectedFile.name} with ${email}`)
      // Implement email sharing logic here
      setFiles(prev => prev.map(file => 
        file.id === selectedFile.id ? { ...file, shared: true } : file
      ))
    }
  }

  const handleDownloadFile = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) {
      toast({
        title: "Error",
        description: "File not found",
        variant: "destructive",
      });
      return;
    }

    try {
      // Sign the download request
      const message = `Download request for file: ${file.id}`;
      const signature = await signMessage(message);
      
      // Generate a temporary access token (this is just an example)
      const accessToken = `temp-token-${Date.now()}`;

      // Use the wallet provider's download method
      await walletDownloadFile(
        {
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          cid: file.cid || '', // Make sure your file metadata includes the CID
          uploadedBy: file.owner,
          uploadedAt: new Date(file.createdAt),
          authorizedUsers: file.permissions,
          mimeType: file.type,
          description: '',
          folderId: file.folderId
        },
        accessToken,
        signature
      );

      toast({
        title: "Success",
        description: "File download started",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your file",
        variant: "destructive",
      });
    }
  };

  const [showBucketDialog, setShowBucketDialog] = useState(false);
  const [isBucketLoading, setIsBucketLoading] = useState(false);
  const { createPrivateBucket, activeAccount } = useWallet();

  useEffect(() => {
    const checkBucket = async () => {
      if (activeAccount) {
        const bucketId = localStorage.getItem('userBucketId');
        if (!bucketId) {
          setShowBucketDialog(true);
        }
      }
    };

    checkBucket();
  }, [activeAccount]);

  const handleCreateBucket = async (amount: bigint) => {
    try {
      setIsBucketLoading(true);
      const bucketId = await createPrivateBucket(amount);
      localStorage.setItem('userBucketId', bucketId.toString());
      setShowBucketDialog(false);
      toast({
        title: "Bucket created successfully",
        description: "Your private bucket is ready to use",
      });
    } catch (error) {
      console.error('Failed to create bucket:', error);
      toast({
        title: "Failed to create bucket",
        description: "An error occurred while creating your bucket",
        variant: "destructive",
      });
    } finally {
      setIsBucketLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Main wrapper with background */}
      <div className="fixed inset-0 w-full h-full">
        {/* Simplified light mode background */}
        <div className={cn(
          "absolute inset-0",
          isDark 
            ? "bg-gradient-to-br from-background/90 via-background/85 to-background/75" 
            : "bg-[#fafafa]"
        )} />

        {/* Light mode subtle pattern */}
        {!isDark && (
          <div className="absolute inset-0 opacity-[0.4] pointer-events-none" 
               style={{ 
                 backgroundImage: 'radial-gradient(#e2e8f0 0.5px, transparent 0.5px), radial-gradient(#e2e8f0 0.5px, #fafafa 0.5px)',
                 backgroundSize: '20px 20px',
                 backgroundPosition: '0 0, 10px 10px'
               }} 
          />
        )}

        {/* Keep dark mode squares, remove from light mode */}
        {isDark && (
          <>
            <Squares
              className="absolute inset-0 opacity-[0.25] transition-all duration-500"
              direction="up"
              speed={0.2}
              squareSize={80}
              hoverFillColor="rgba(30, 41, 59, 0.9)"
              borderColor="rgba(148, 163, 184, 0.3)"
            />
            <Squares
              className="absolute inset-0 opacity-[0.2] transition-all duration-500"
              direction="right"
              speed={0.15}
              squareSize={140}
              hoverFillColor="rgba(30, 41, 59, 0.8)"
              borderColor="rgba(148, 163, 184, 0.25)"
            />
            <Squares
              className="absolute inset-0 opacity-[0.15] transition-all duration-500"
              direction="diagonal"
              speed={0.3}
              squareSize={40}
              hoverFillColor="rgba(30, 41, 59, 0.7)"
              borderColor="rgba(148, 163, 184, 0.2)"
            />
          </>
        )}
      </div>

      {/* Main content */}
      <div className="relative flex h-screen overflow-hidden">
        <Sidebar
          currentFolderId={currentFolderId}
          folders={folders}
          onFolderSelect={setCurrentFolderId}
        />
        
        <main className="flex-1 overflow-auto">
          <div className={cn(
            "container mx-auto px-8 py-6",
            isDark 
              ? "bg-transparent"
              : "bg-white/60 shadow-sm",
            "transition-all duration-500"
          )}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <motion.h1 
                  className={cn(
                    "text-4xl font-bold mb-2",
                    isDark 
                      ? "bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400"
                      : "text-gray-900"
                  )}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentFolder?.name || "My Files"}
                </motion.h1>
                <motion.div 
                  className="flex items-center gap-3 text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-lg">{filteredAndSortedFiles.length} file{filteredAndSortedFiles.length !== 1 && "s"}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-lg">{formatTotalSize(filteredAndSortedFiles.reduce((acc, file) => acc + file.size, 0))}</span>
                </motion.div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3"
                >
                  {/* Upload Files Button */}
                  <Button
                    onClick={() => setShowUploadModal(true)}
                    className={cn(
                      "flex items-center gap-2 px-4 h-10 rounded-lg",
                      isDark 
                        ? "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-600",
                      "transition-all duration-300"
                    )}
                  >
                    <Icons.upload className="w-4 h-4" />
                    <span className="font-medium">Upload</span>
                  </Button>

                  {/* Create Folder Button */}
                  <Button
                    onClick={() => setShowCreateFolderModal(true)}
                    className={cn(
                      "flex items-center gap-2 px-4 h-10 rounded-lg",
                      isDark 
                        ? "bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
                        : "bg-purple-50 hover:bg-purple-100 text-purple-600",
                      "transition-all duration-300"
                    )}
                  >
                    <Icons.folder className="w-4 h-4" />
                    <span className="font-medium">New Folder</span>
                  </Button>

                  {/* Create Document Button */}
                  <Button
                    onClick={() => navigate("/document/new")}
                    className={cn(
                      "flex items-center gap-2 px-4 h-10 rounded-lg",
                      isDark 
                        ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                        : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600",
                      "transition-all duration-300"
                    )}
                  >
                    <Icons.fileText className="w-4 h-4" />
                    <span className="font-medium">New Doc</span>
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-4 flex-1">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search files..."
                  className="max-w-md"
                  prefix={<Icons.search className="h-4 w-4 text-muted-foreground" />}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Icons.filter className="h-4 w-4" />
                      Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy("date")}>
                      <Icons.clock className="mr-2 h-4 w-4" /> Date
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("name")}>
                      <Icons.text className="mr-2 h-4 w-4" /> Name
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("size")}>
                      <Icons.arrowUpDown className="mr-2 h-4 w-4" /> Size
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("type")}>
                      <Icons.file className="mr-2 h-4 w-4" /> Type
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2">
                <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")} className="w-[200px]">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="grid" className="gap-2">
                      <Icons.layoutGrid className="h-4 w-4" />
                      Grid
                    </TabsTrigger>
                    <TabsTrigger value="list" className="gap-2">
                      <Icons.layoutList className="h-4 w-4" />
                      List
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Files Grid/List View */}
            <div className="relative">
              {viewMode === "grid" ? (
                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredAndSortedFiles.map((file) => (
                    <FileCard
                      key={file.id}
                      file={file}
                      onStar={() => handleStarFile(file.id)}
                      onDelete={() => handleDeleteFile(file.id)}
                      onShare={() => handleShareFile(file.id)}
                      onDownload={() => handleDownloadFile(file.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="relative space-y-2">
                  {filteredAndSortedFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg",
                        isDark 
                          ? "hover:bg-primary/5 bg-transparent"
                          : "hover:bg-gray-50 bg-white",
                        "border border-gray-100 shadow-sm transition-colors"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "p-2 rounded",
                          isDark ? "bg-primary/10" : "bg-primary/5"
                        )}>
                          {file.type === "image" && <Icons.image className="h-5 w-5 text-blue-500" />}
                          {file.type === "document" && <Icons.fileText className="h-5 w-5 text-emerald-500" />}
                          {file.type === "pdf" && <Icons.file className="h-5 w-5 text-red-500" />}
                          {file.type === "spreadsheet" && <Icons.table className="h-5 w-5 text-green-500" />}
                          {file.type === "video" && <Icons.play className="h-5 w-5 text-purple-500" />}
                          {file.type === "audio" && <Icons.volume2 className="h-5 w-5 text-yellow-500" />}
                        </div>
                        <div>
                          <h3 className="font-medium">{file.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatTotalSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStarFile(file.id)}
                          className={cn(
                            file.starred && "text-yellow-500"
                          )}
                        >
                          <Icons.star className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleShareFile(file.id)}
                        >
                          <Icons.share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownloadFile(file.id)}
                        >
                          <Icons.download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteFile(file.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Icons.trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      <FileUploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
        isUploading={isUploading}
      />

      {/* Modals */}
      <CreateFolderModal
        open={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        onCreate={handleCreateFolder}
      />

      {selectedFile && (
        <EnhancedShareModal
          open={showShareModal}
          onClose={() => {
            setShowShareModal(false)
            setSelectedFile(null)
          }}
          file={selectedFile}
          onShare={handleEmailShare}
        />
      )}

      {fileToDelete && (
        <DeleteFileModal
          open={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setFileToDelete(null)
          }}
          file={fileToDelete}
          onDelete={handleConfirmDelete}
        />
      )}

      <BucketCreationDialog
        open={showBucketDialog}
        onOpenChange={setShowBucketDialog}
        onCreateBucket={handleCreateBucket}
        isLoading={isBucketLoading}
      />
    </div>
  )
} 