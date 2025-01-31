import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import React, { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "@/components/ui/icons"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "@/components/theme-provider"
import { useWallet } from "@/contexts/WalletProvider"

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 }
}

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 }
}

interface FileUploadModalProps {
  open: boolean
  onClose: () => void
  onUpload: (files: FileList | File[]) => void
  isUploading?: boolean
}

export function FileUploadModal({ open, onClose, onUpload, isUploading = false }: FileUploadModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { uploadFile } = useWallet()

  const handleFileChange = async (newFiles: File[]) => {
    try {
      setFiles((prevFiles) => [...prevFiles, ...newFiles])
      
      // Upload each file using the wallet provider
      for (const file of newFiles) {
        setUploadProgress(0)
        
        // Upload progress simulation
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90))
        }, 200)

        try {
          const fileMetadata = await uploadFile(file)
          console.log('File uploaded successfully:', fileMetadata)
          
          // Complete the progress bar
          setUploadProgress(100)
          clearInterval(progressInterval)
          
          // Notify parent component
          onUpload([file])
        } catch (error) {
          console.error('Error uploading file:', error)
          clearInterval(progressInterval)
          // You might want to show an error toast here
        }
      }
      
      // Clear the files and close the modal
      setFiles([])
      setUploadProgress(0)
      onClose()
    } catch (error) {
      console.error('Error handling files:', error)
      setUploadProgress(0)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop: handleFileChange,
    onDropRejected: (error) => {
      console.log(error)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <div className="relative w-full">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90">
            <div className="absolute inset-0" style={{ 
              backgroundImage: isDark 
                ? 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)'
                : 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.05) 1px, transparent 0)',
              backgroundSize: '32px 32px' 
            }} />
          </div>

          {/* Upload Area */}
          <div className="relative p-8" {...getRootProps()}>
            <input {...getInputProps()} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <motion.div 
                className={cn(
                  "rounded-full p-6 mb-6",
                  isDark ? "bg-blue-500/10" : "bg-blue-50",
                  "transition-all duration-300"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icons.upload className={cn(
                  "h-8 w-8",
                  isDark ? "text-blue-400" : "text-blue-600"
                )} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <h3 className={cn(
                  "text-2xl font-semibold",
                  isDark ? "text-blue-400" : "text-blue-600"
                )}>
                  Upload Files
                </h3>
                <p className="text-muted-foreground text-base max-w-md mx-auto">
                  Drag and drop your files here, or click to browse through your files
                </p>
              </motion.div>

              {/* File Types */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto w-full"
              >
                {[
                  { icon: "image", label: "Images", types: "JPG, PNG, GIF" },
                  { icon: "fileText", label: "Documents", types: "PDF, DOC, TXT" },
                  { icon: "table", label: "Spreadsheets", types: "XLS, CSV" }
                ].map((item, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-4 rounded-xl text-center",
                      isDark 
                        ? "bg-background/60 border border-border/40"
                        : "bg-white/60 border border-border/10",
                      "backdrop-blur-sm"
                    )}
                  >
                    <div className={cn(
                      "mx-auto w-fit p-3 rounded-lg mb-3",
                      isDark ? "bg-background/60" : "bg-gray-50"
                    )}>
                      {/* Render icon based on type */}
                      {(() => {
                        switch (item.icon) {
                          case "image":
                            return <Icons.image className="h-5 w-5 text-muted-foreground" />;
                          case "fileText":
                            return <Icons.fileText className="h-5 w-5 text-muted-foreground" />;
                          case "table":
                            return <Icons.table className="h-5 w-5 text-muted-foreground" />;
                          default:
                            return <Icons.file className="h-5 w-5 text-muted-foreground" />;
                        }
                      })()}
                    </div>
                    <h4 className="font-medium mb-1">{item.label}</h4>
                    <p className="text-xs text-muted-foreground">{item.types}</p>
                  </div>
                ))}
              </motion.div>
              
              {/* Upload Progress */}
              {isUploading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full max-w-md mt-8"
                >
                  <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <p className="text-sm text-center text-muted-foreground mt-2">
                    Uploading... {uploadProgress}%
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* File List */}
            <AnimatePresence mode="wait">
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 space-y-2"
                >
                  {files.map((file, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg",
                        isDark 
                          ? "bg-background/60 border border-border/40"
                          : "bg-white/60 border border-border/10",
                        "backdrop-blur-sm"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          isDark ? "bg-background/60" : "bg-gray-50"
                        )}>
                          {getFileIcon(file.type)}
                        </div>
                        <div>
                          <p className="font-medium truncate max-w-[200px]">
                            {file.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                      >
                        <Icons.close className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function GridPattern() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const columns = 41
  const rows = 11

  return (
    <div className={cn(
      "flex flex-shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105",
      isDark ? "bg-background" : "bg-gray-100"
    )}>
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col
          return (
            <div
              key={`${col}-${row}`}
              className={cn(
                "w-10 h-10 flex flex-shrink-0 rounded-[2px]",
                index % 2 === 0
                  ? isDark ? "bg-background" : "bg-gray-50"
                  : isDark 
                    ? "bg-background shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]" 
                    : "bg-gray-50 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset]"
              )}
            />
          )
        })
      )}
    </div>
  )
}

function getFileIcon(type: string) {
  if (type.includes("image")) return <Icons.image className="h-4 w-4" />
  if (type.includes("video")) return <Icons.fileText className="h-4 w-4" />
  if (type.includes("audio")) return <Icons.fileText className="h-4 w-4" />
  if (type.includes("pdf")) return <Icons.fileText className="h-4 w-4" />
  if (type.includes("document")) return <Icons.fileText className="h-4 w-4" />
  if (type.includes("spreadsheet")) return <Icons.table className="h-4 w-4" />
  return <Icons.file className="h-4 w-4" />
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
} 