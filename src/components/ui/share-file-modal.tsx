import * as React from "react"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ShareFileModalProps {
  open: boolean
  onClose: () => void
  file: {
    id: string
    name: string
    type: string
  }
  onShare: (email: string) => void
}

export function ShareFileModal({
  open,
  onClose,
  file,
  onShare,
}: ShareFileModalProps) {
  const [email, setEmail] = React.useState("")
  const [shareType, setShareType] = React.useState<"link" | "email">("link")
  const [copied, setCopied] = React.useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const linkRef = React.useRef<HTMLInputElement>(null)

  const shareLink = `${window.location.origin}/share/${file.id}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      onShare(email.trim())
      setEmail("")
    }
  }

  return (
    <Modal open={open} onClose={onClose} maxWidth="md">
      <ModalHeader
        title={`Share "${file.name}"`}
        description="Share this file with others via a link or email"
        icon={<Icons.share2 className="h-6 w-6 text-primary" />}
      />

      <ModalContent className="space-y-6">
        <Tabs
          value={shareType}
          onValueChange={(value) => setShareType(value as "link" | "email")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="link" className="gap-2">
              <Icons.link className="h-4 w-4" />
              Share Link
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Icons.send className="h-4 w-4" />
              Share via Email
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {shareType === "link" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label
                htmlFor="shareLink"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Share Link
              </label>
              <div className="flex gap-2">
                <Input
                  ref={linkRef}
                  id="shareLink"
                  value={shareLink}
                  readOnly
                  className={cn(
                    "flex-1 transition-all duration-200",
                    isDark
                      ? "bg-background/60 border-border/40"
                      : "bg-white border-border/10"
                  )}
                />
                <Button
                  type="button"
                  onClick={handleCopyLink}
                  className={cn(
                    "gap-2 transition-all duration-200",
                    isDark
                      ? "bg-primary/20 hover:bg-primary/30 text-primary"
                      : "bg-primary/10 hover:bg-primary/20 text-primary"
                  )}
                >
                  {copied ? (
                    <>
                      <Icons.check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Icons.copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
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
                <span>Anyone with the link can view this file</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.check className="h-4 w-4" />
                <span>The link never expires</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.check className="h-4 w-4" />
                <span>You can revoke access at any time</span>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter recipient's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                <span>The recipient will receive an email with access instructions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.check className="h-4 w-4" />
                <span>They'll need to sign in to access the file</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.check className="h-4 w-4" />
                <span>You can manage their access permissions later</span>
              </div>
            </motion.div>

            <Button
              type="submit"
              disabled={!email.trim()}
              className={cn(
                "w-full gap-2 transition-all duration-200",
                isDark
                  ? "bg-primary/20 hover:bg-primary/30 text-primary"
                  : "bg-primary/10 hover:bg-primary/20 text-primary"
              )}
            >
              <Icons.send className="h-4 w-4" />
              Send Invite
            </Button>
          </motion.form>
        )}
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
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
} 