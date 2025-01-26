import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/ui/icons"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { Squares } from "@/components/Landing/squares-background"
import { SparklesCore } from "@/components/ui/sparkles"

export function ReferralPage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const referralCode = "VAULTED-123XYZ"
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-background/50 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className={cn(
          "absolute inset-0",
          isDark 
            ? "bg-gradient-to-br from-background via-background/95 to-emerald-950/20"
            : "bg-gradient-to-br from-background via-background/95 to-emerald-100/30"
        )}>
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        <Squares
          className={cn(
            isDark ? "opacity-[0.08]" : "opacity-[0.05]",
            "transition-opacity duration-1000"
          )}
          direction="diagonal"
          speed={0.2}
          squareSize={80}
          hoverFillColor={isDark ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.1)"}
          borderColor={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
        />
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-12"
        >
          {/* Hero Section */}
          <div className="text-center space-y-6 relative">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-32 h-32 mx-auto"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-20 blur-2xl" />
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
                className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 p-1"
              >
                <div className={cn(
                  "w-full h-full rounded-full flex items-center justify-center",
                  isDark ? "bg-background/90" : "bg-white/90"
                )}>
                  <span role="img" aria-label="gift" className="text-5xl">🎁</span>
                </div>
              </motion.div>
            </motion.div>

            <div className="relative h-28">
              <SparklesCore
                id="tsparticles-header"
                background="transparent"
                minSize={0.8}
                maxSize={1.6}
                particleColor={isDark ? "#34d399" : "#059669"}
                className="w-full h-full"
                particleDensity={70}
                speed={0.8}
              />
              <motion.h1 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={cn(
                  "text-5xl font-bold bg-clip-text text-transparent absolute inset-0 flex items-center justify-center",
                  isDark
                    ? "bg-gradient-to-r from-emerald-300 via-emerald-400 to-green-400"
                    : "bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600"
                )}
              >
                Refer & Earn Program
              </motion.h1>
            </div>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Share Vaulted with friends and unlock premium storage space together. Each successful referral earns you both <span className="font-semibold text-emerald-500">5GB extra space</span>.
            </motion.p>
          </div>

          {/* Stats Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={cn(
              "rounded-2xl border p-8",
              isDark
                ? "bg-background/60 border-border/40 backdrop-blur-xl"
                : "bg-white/60 border-border/10 backdrop-blur-xl"
            )}
          >
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-muted-foreground">Total Referrals</h3>
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full" />
                  <p className="text-4xl font-bold relative">12</p>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-muted-foreground">Storage Earned</h3>
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full" />
                  <p className="text-4xl font-bold relative">60GB</p>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium text-muted-foreground">Active Users</h3>
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/10 blur-xl rounded-full" />
                  <p className="text-4xl font-bold relative">8</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* How It Works */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className={cn(
                "rounded-2xl border p-8 h-full",
                isDark
                  ? "bg-background/60 border-border/40 backdrop-blur-xl"
                  : "bg-white/60 border-border/10 backdrop-blur-xl"
              )}
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Icons.star className="w-6 h-6 text-emerald-500" />
                How It Works
              </h2>
              <ul className="space-y-6">
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-4"
                >
                  <div className={cn(
                    "mt-1 p-3 rounded-xl",
                    isDark ? "bg-emerald-500/10" : "bg-emerald-50"
                  )}>
                    <Icons.share2 className={cn(
                      "w-5 h-5",
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Share Your Link</h3>
                    <p className="text-muted-foreground">Copy your unique referral link and share it with friends who would love Vaulted.</p>
                  </div>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-start gap-4"
                >
                  <div className={cn(
                    "mt-1 p-3 rounded-xl",
                    isDark ? "bg-emerald-500/10" : "bg-emerald-50"
                  )}>
                    <Icons.userPlus className={cn(
                      "w-5 h-5",
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Friends Join In</h3>
                    <p className="text-muted-foreground">When they create an account using your link, they'll get started with extra storage.</p>
                  </div>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start gap-4"
                >
                  <div className={cn(
                    "mt-1 p-3 rounded-xl",
                    isDark ? "bg-emerald-500/10" : "bg-emerald-50"
                  )}>
                    <Icons.gift className={cn(
                      "w-5 h-5",
                      isDark ? "text-emerald-400" : "text-emerald-600"
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Both Get Rewarded</h3>
                    <p className="text-muted-foreground">You'll both receive 5GB of bonus storage space instantly. Keep sharing to earn more!</p>
                  </div>
                </motion.li>
              </ul>
            </motion.div>

            {/* Share Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-8"
            >
              {/* Referral Code Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={cn(
                  "rounded-2xl border p-8",
                  isDark
                    ? "bg-background/60 border-border/40 backdrop-blur-xl"
                    : "bg-white/60 border-border/10 backdrop-blur-xl"
                )}
              >
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Icons.starFilled className="w-6 h-6 text-emerald-500" />
                  Your Referral Code
                </h2>
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      value={referralCode}
                      readOnly
                      className="pr-24 font-mono text-lg h-12"
                    />
                    <Button
                      size="sm"
                      className="absolute right-1 top-1 h-10 px-6"
                      onClick={() => copyToClipboard(referralCode)}
                    >
                      <Icons.copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Share Link Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={cn(
                  "rounded-2xl border p-8",
                  isDark
                    ? "bg-background/60 border-border/40 backdrop-blur-xl"
                    : "bg-white/60 border-border/10 backdrop-blur-xl"
                )}
              >
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <Icons.share2 className="w-6 h-6 text-emerald-500" />
                  Share Your Link
                </h2>
                <div className="space-y-6">
                  <div className="relative">
                    <Input
                      value={referralLink}
                      readOnly
                      className="pr-24 text-lg h-12"
                    />
                    <Button
                      size="sm"
                      className="absolute right-1 top-1 h-10 px-6"
                      onClick={() => copyToClipboard(referralLink)}
                    >
                      <Icons.copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full gap-2 h-12"
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=Join me on Vaulted! Use my referral link: ${referralLink}`, '_blank')}
                    >
                      <Icons.twitter className="w-5 h-5" />
                      Share on Twitter
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full gap-2 h-12"
                      onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${referralLink}`, '_blank')}
                    >
                      <Icons.facebook className="w-5 h-5" />
                      Share on Facebook
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center relative"
          >
            <div className="relative h-32">
              <SparklesCore
                id="tsparticles-footer"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleColor={isDark ? "#34d399" : "#059669"}
                className="w-full h-full"
                particleDensity={50}
                speed={0.6}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="space-y-4">
                  <p className={cn(
                    "text-2xl font-medium",
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  )}>
                    Join our growing community of sharers! 🌟
                  </p>
                  <p className="text-muted-foreground">
                    Already referred {12} friends and counting
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
} 