import * as React from "react"
import { Modal, ModalHeader, ModalContent, ModalFooter } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Link, Mail, Check, Copy, Twitter, Facebook, Linkedin, MessageCircle } from "lucide-react"

interface EnhancedShareModalProps {
  open: boolean
  onClose: () => void
  file: {
    id: string
    name: string
    type: string
  }
  onShare: (email: string) => void
}

export function EnhancedShareModal({
  open,
  onClose,
  file,
  onShare,
}: EnhancedShareModalProps) {
  const [email, setEmail] = React.useState("")
  const [shareType, setShareType] = React.useState<"link" | "social" | "email">("link")
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

  const socialPlatforms = [
    { 
      name: 'Twitter', 
      icon: <Twitter className="h-5 w-5" />, 
      color: 'bg-[#1DA1F2]/10 text-[#1DA1F2]',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=Check out this file:`
    },
    { 
      name: 'Facebook', 
      icon: <Facebook className="h-5 w-5" />, 
      color: 'bg-[#4267B2]/10 text-[#4267B2]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`
    },
    { 
      name: 'LinkedIn', 
      icon: <Linkedin className="h-5 w-5" />, 
      color: 'bg-[#0077B5]/10 text-[#0077B5]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareLink)}`
    },
    { 
      name: 'WhatsApp', 
      icon: <MessageCircle className="h-5 w-5" />, 
      color: 'bg-[#25D366]/10 text-[#25D366]',
      url: `https://wa.me/?text=${encodeURIComponent(`Check out this file: ${shareLink}`)}`
    }
  ]

  return (
    <Modal open={open} onClose={onClose} maxWidth="md">
      <ModalHeader
        title={`Share "${file.name}"`}
        description="Share this file with others via a link, social media, or email"
        icon={<Share2 className="h-6 w-6 text-primary" />}
      />

      <ModalContent className="space-y-6">
        <Tabs
          value={shareType}
          onValueChange={(value) => setShareType(value as "link" | "social" | "email")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="link" className="gap-2">
              <Link className="h-4 w-4" />
              Share Link
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Share2 className="h-4 w-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="email" className="gap-2">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {shareType === "link" && (
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
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
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
                <Check className="h-4 w-4" />
                <span>Anyone with the link can view this file</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4" />
                <span>The link never expires</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4" />
                <span>You can revoke access at any time</span>
              </div>
            </motion.div>
          </motion.div>
        )}

        {shareType === "social" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-2 gap-4"
          >
            {socialPlatforms.map((platform) => (
              <motion.button
                key={platform.name}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg transition-all duration-200",
                  platform.color,
                  isDark ? "hover:bg-opacity-20" : "hover:bg-opacity-15"
                )}
                onClick={() => window.open(platform.url, '_blank')}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  isDark ? "bg-white/10" : "bg-white/50"
                )}>
                  {platform.icon}
                </div>
                <span className="font-medium">Share on {platform.name}</span>
              </motion.button>
            ))}
          </motion.div>
        )}

        {shareType === "email" && (
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
                <Check className="h-4 w-4" />
                <span>The recipient will receive an email with access instructions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4" />
                <span>They'll need to sign in to access the file</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4" />
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
              <Mail className="h-4 w-4" />
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