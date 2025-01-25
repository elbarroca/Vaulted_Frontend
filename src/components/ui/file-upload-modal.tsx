import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import React, { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icons } from "@/components/ui/icons"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "@/components/theme-provider"

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

  const handleFileChange = async (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setUploadProgress(i)
    }
    
    onUpload(newFiles)
    setFiles([])
    setUploadProgress(0)
    onClose()
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
      <DialogContent className="sm:max-w-[800px]">
        <div className="w-full" {...getRootProps()}>
          <motion.div
            whileHover="animate"
            className={cn(
              "p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden",
              isDark ? "bg-background" : "bg-white"
            )}
          >
            <input {...getInputProps()} />
            <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
              <GridPattern />
            </div>
            <div className="flex flex-col items-center justify-center">
              <motion.div 
                className={cn(
                  "rounded-full p-6 mb-4",
                  isDark ? "bg-blue-500/10" : "bg-blue-50"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icons.upload className={cn(
                  "h-8 w-8",
                  isDark ? "text-blue-400" : "text-blue-600"
                )} />
              </motion.div>
              <p className={cn(
                "relative z-20 font-bold text-lg",
                isDark ? "text-blue-400" : "text-blue-600"
              )}>
                Upload Files
              </p>
              <p className="relative z-20 text-muted-foreground text-base mt-2">
                Drag and drop your files here or click to browse
              </p>
              
              {isUploading && (
                <div className="w-full max-w-md mt-6 space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              <div className="relative w-full mt-10 max-w-xl mx-auto">
                <AnimatePresence mode="wait">
                  {files.map((file, idx) => (
                    <motion.div
                      key={`file-${idx}`}
                      layoutId={`file-${idx}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={cn(
                        "relative overflow-hidden z-40 flex flex-col items-start justify-start p-4 mt-4 w-full mx-auto rounded-xl border",
                        isDark 
                          ? "bg-background/60 border-border/40"
                          : "bg-white/60 border-border/10",
                        "backdrop-blur-sm"
                      )}
                    >
                      <div className="flex justify-between w-full items-center gap-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg",
                            isDark ? "bg-blue-500/10" : "bg-blue-50"
                          )}>
                            {getFileIcon(file.type)}
                          </div>
                          <div>
                            <p className="font-medium truncate max-w-xs">
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
                          className="shrink-0 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            setFiles(files.filter((_, i) => i !== idx))
                          }}
                        >
                          <Icons.trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}

                  {!files.length && !isUploading && (
                    <motion.div
                      layoutId="upload-placeholder"
                      variants={mainVariant}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                      className={cn(
                        "relative z-40 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-xl border",
                        isDark 
                          ? "bg-background/60 border-border/40"
                          : "bg-white/60 border-border/10",
                        "backdrop-blur-sm"
                      )}
                    >
                      {isDragActive ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex flex-col items-center gap-2 text-primary"
                        >
                          <p>Drop files here</p>
                          <Icons.upload className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <Icons.upload className={cn(
                          "h-6 w-6",
                          isDark ? "text-blue-400" : "text-blue-600"
                        )} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
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