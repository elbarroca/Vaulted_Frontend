import * as React from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { motion, AnimatePresence } from "framer-motion"

interface FileUploadProps {
  onChange?: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
  accept?: Record<string, string[]>
  className?: string
}

export function FileUpload({
  onChange,
  maxFiles = 1,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.ms-excel': ['.xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/plain': ['.txt'],
  },
  className,
  ...props
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)

  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      onChange?.(acceptedFiles)
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles,
    maxSize,
    accept,
  })

  React.useEffect(() => {
    setIsDragging(isDragActive)
  }, [isDragActive])

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative cursor-pointer",
        className
      )}
      {...props}
    >
      <input {...getInputProps()} />
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-primary/10 backdrop-blur-sm rounded-lg border-2 border-primary border-dashed flex items-center justify-center"
          >
            <div className="text-center">
              <Icons.upload className="mx-auto h-12 w-12 text-primary" />
              <p className="mt-2 text-sm text-primary font-medium">Drop your files here</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        variant="outline"
        className="relative overflow-hidden group hover:border-primary/50"
      >
        <div className="flex items-center gap-2">
          <Icons.upload className="h-4 w-4" />
          <span>Upload Files</span>
        </div>
        <div className="absolute inset-x-0 h-[2px] bottom-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform" />
      </Button>
    </div>          
  )
}
 