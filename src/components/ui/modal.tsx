import * as React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  maxWidth?: "sm" | "md" | "lg" | "xl"
  showOverlay?: boolean
}

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

export function Modal({
  open,
  onClose,
  children,
  maxWidth = "md",
  showOverlay = true,
}: ModalProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "p-0 border-none bg-transparent shadow-none",
          maxWidthClasses[maxWidth]
        )}
      >
        <AnimatePresence mode="wait">
          {open && (
            <>
              {showOverlay && (
                <motion.div
                  className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                />
              )}
              <motion.div
                className={cn(
                  "relative w-full rounded-xl p-6",
                  isDark
                    ? "bg-background/80 backdrop-blur-xl border border-border/40"
                    : "bg-white/90 backdrop-blur-xl border border-border/10 shadow-lg"
                )}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {children}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

export function ModalHeader({
  title,
  description,
  icon,
}: {
  title: string
  description?: string
  icon?: React.ReactNode
}) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div className="flex items-start gap-4 mb-6">
      {icon && (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn(
            "p-3 rounded-xl",
            isDark ? "bg-primary/10" : "bg-primary/5"
          )}
        >
          {icon}
        </motion.div>
      )}
      <div>
        <motion.h2
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-semibold"
        >
          {title}
        </motion.h2>
        {description && (
          <motion.p
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-muted-foreground mt-1"
          >
            {description}
          </motion.p>
        )}
      </div>
    </div>
  )
}

export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className={cn("flex justify-end gap-2 mt-6", className)}
    >
      {children}
    </motion.div>
  )
}

export function ModalContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  )
} 