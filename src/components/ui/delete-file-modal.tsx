import * as React from "react"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface DeleteFileModalProps {
  open: boolean
  onClose: () => void
  file: {
    id: string
    name: string
  }
  onDelete: (id: string) => void
}

export function DeleteFileModal({
  open,
  onClose,
  file,
  onDelete,
}: DeleteFileModalProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const handleDelete = () => {
    onDelete(file.id)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} maxWidth="sm">
      <ModalHeader
        title="Delete File"
        description={`Are you sure you want to delete "${file.name}"?`}
        icon={<Icons.trash className="h-6 w-6 text-destructive" />}
      />

      <ModalContent>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "rounded-lg p-4 space-y-3",
            isDark ? "bg-destructive/10" : "bg-destructive/5"
          )}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icons.warning className="h-4 w-4 text-destructive" />
            <span>This action cannot be undone</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Icons.warning className="h-4 w-4 text-destructive" />
            <span>The file will be permanently deleted</span>
          </div>
        </motion.div>
      </ModalContent>

      <ModalFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className={cn(
            "transition-all duration-200",
            isDark
              ? "hover:bg-muted/30"
              : "hover:bg-muted/20"
          )}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleDelete}
          className={cn(
            "gap-2 transition-all duration-200",
            isDark
              ? "bg-destructive/20 hover:bg-destructive/30 text-destructive"
              : "bg-destructive/10 hover:bg-destructive/20 text-destructive"
          )}
        >
          <Icons.trash className="h-4 w-4" />
          Delete File
        </Button>
      </ModalFooter>
    </Modal>
  )
} 