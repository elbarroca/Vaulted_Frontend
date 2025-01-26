import * as React from "react"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface CreateFolderModalProps {
  open: boolean
  onClose: () => void
  onCreate: (name: string) => void
}

export function CreateFolderModal({
  open,
  onClose,
  onCreate,
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = React.useState("")
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) {
      setFolderName("")
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (folderName.trim()) {
      onCreate(folderName.trim())
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <ModalHeader
          title="Create New Folder"
          description="Create a new folder to organize your files"
          icon={<Icons.folder className="h-6 w-6 text-primary" />}
        />

        <ModalContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="folderName"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Folder Name
              </label>
              <Input
                ref={inputRef}
                id="folderName"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className={cn(
                  "w-full transition-all duration-200",
                  isDark
                    ? "bg-background/60 border-border/40 focus:border-primary/40"
                    : "bg-white border-border/10 focus:border-primary/20"
                )}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                "rounded-lg p-4 space-y-3",
                isDark ? "bg-muted/30" : "bg-muted/20"
              )}
            >
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.check className="h-4 w-4" />
                <span>Folder names can contain letters, numbers, and special characters</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.check className="h-4 w-4" />
                <span>Folders can be nested inside other folders</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.check className="h-4 w-4" />
                <span>Folders inherit permissions from their parent folder</span>
              </div>
            </motion.div>
          </div>
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
            type="submit"
            disabled={!folderName.trim()}
            className={cn(
              "gap-2 transition-all duration-200",
              isDark
                ? "bg-primary/20 hover:bg-primary/30 text-primary"
                : "bg-primary/10 hover:bg-primary/20 text-primary"
            )}
          >
            <Icons.folder className="h-4 w-4" />
            Create Folder
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
} 