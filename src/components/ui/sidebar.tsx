import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { useState } from "react"
import { 
  FileText, 
  Clock, 
  Star, 
  Trash2, 
  ChevronDown,
  Plus,
  Settings,
  Search
} from "lucide-react"

interface Folder {
  id: string
  name: string
  icon?: keyof typeof Icons
  color?: string
  parentId?: string | null
  files?: Array<{
    id: string
    name: string
    type: string
    size: number
  }>
  created?: string
}

interface SidebarProps {
  className?: string
  storageUsed?: number
  storageLimit?: number
  folders: Folder[]
  currentFolderId: string | null
  onFolderSelect: (folderId: string | null) => void
}

const navigationItems = [
  {
    title: "My Files",
    icon: "folder",
    href: "/dashboard",
    lightColor: "text-blue-600",
    lightBg: "bg-blue-50",
    darkColor: "text-blue-400",
    darkBg: "bg-blue-500/10",
    hoverLight: "hover:bg-blue-100",
    hoverDark: "hover:bg-blue-500/20"
  },
  {
    title: "Shared Files",
    icon: "share2",
    href: "/dashboard/shared",
    lightColor: "text-indigo-600",
    lightBg: "bg-indigo-50",
    darkColor: "text-indigo-400",
    darkBg: "bg-indigo-500/10",
    hoverLight: "hover:bg-indigo-100",
    hoverDark: "hover:bg-indigo-500/20"
  },
  {
    title: "Recent Files",
    icon: "clock",
    href: "/dashboard/recent",
    lightColor: "text-cyan-600",
    lightBg: "bg-cyan-50",
    darkColor: "text-cyan-400",
    darkBg: "bg-cyan-500/10",
    hoverLight: "hover:bg-cyan-100",
    hoverDark: "hover:bg-cyan-500/20"
  },
  {
    title: "Starred Files",
    icon: "star",
    href: "/dashboard/starred",
    lightColor: "text-amber-600",
    lightBg: "bg-amber-50",
    darkColor: "text-amber-400",
    darkBg: "bg-amber-500/10",
    hoverLight: "hover:bg-amber-100",
    hoverDark: "hover:bg-amber-500/20"
  },
  {
    title: "Trash Bin",
    icon: "trash",
    href: "/dashboard/trash",
    lightColor: "text-red-600",
    lightBg: "bg-red-50",
    darkColor: "text-red-400",
    darkBg: "bg-red-500/10",
    hoverLight: "hover:bg-red-100",
    hoverDark: "hover:bg-red-500/20"
  }
] as const

export function Sidebar({ 
  className, 
  folders = [], 
  currentFolderId,
  onFolderSelect,
  ...props 
}: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [isHovered, setIsHovered] = React.useState(false)
  const [isFoldersExpanded, setIsFoldersExpanded] = React.useState(true)
  const storageUsed = props.storageUsed ?? 12 // GB
  const storageTotal = props.storageLimit ?? 20 // GB
  const storagePercentage = (storageUsed / storageTotal) * 100
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [isExpanded, setIsExpanded] = React.useState(true)
  const [quickPages] = React.useState([
    { id: '1', title: 'Getting Started', icon: '📚' },
    { id: '2', title: 'Product Roadmap', icon: '🛣️' },
    { id: '3', title: 'Meeting Notes', icon: '📝' },
  ])

  const getIcon = (iconName: keyof typeof Icons) => {
    const IconComponent = Icons[iconName]
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null
  }

  const isDark = theme === "dark"

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev)
      if (next.has(folderId)) {
        next.delete(folderId)
      } else {
        next.add(folderId)
      }
      return next
    })
  }

  return (
    <TooltipProvider>
      <motion.div
        className={cn(
          "flex h-screen flex-col gap-4 border-r",
          isDark ? "border-border/40 bg-background/95" : "border-border/5 bg-white/95",
          "relative backdrop-blur-sm",
          className
        )}
        initial={false}
        animate={{
          width: isHovered ? "280px" : "80px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {/* Logo */}
        <div className={cn(
          "flex items-center gap-4 p-4",
          !isHovered && "justify-center"
        )}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <motion.div
              className={cn(
                "absolute inset-0 rounded-lg blur",
                isDark ? "bg-blue-500/20" : "bg-blue-500/10"
              )}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.2, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <Icons.logo className={cn(
              "h-8 w-8 relative",
              isDark ? "text-blue-400" : "text-blue-600"
            )} />
          </motion.div>
          <motion.span
            initial={false}
            animate={{
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.8,
            }}
            transition={{ duration: 0.2 }}
            className={cn(
              "text-xl font-bold bg-clip-text text-transparent",
              isDark 
                ? "bg-gradient-to-r from-blue-400 to-indigo-400"
                : "bg-gradient-to-r from-blue-600 to-indigo-600"
            )}
          >
            Vaulted Cloud
          </motion.span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col gap-1 px-2">
          {/* Main Navigation */}
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "relative h-10 justify-start",
                      isDark ? item.darkColor : item.lightColor,
                      "transition-colors duration-200",
                      isActive && (isDark ? item.darkBg : item.lightBg),
                      !isActive && (isDark ? item.hoverDark : item.hoverLight),
                      !isHovered && "w-10 p-0 mx-auto"
                    )}
                    onClick={() => navigate(item.href)}
                  >
                    <span className={cn(
                      "flex items-center justify-center",
                      !isHovered && "w-10"
                    )}>
                      {getIcon(item.icon as keyof typeof Icons)}
                    </span>
                    {isHovered && (
                      <motion.span
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="ml-3 font-medium"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  className={cn(
                    "text-sm font-medium",
                    isDark ? "bg-background/80" : "bg-white/80",
                    "backdrop-blur-sm"
                  )}
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            )
          })}

          {/* Folders Section */}
          {folders.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className={cn(
                "flex items-center px-2 py-1.5",
                isDark ? "text-blue-400" : "text-blue-600"
              )}>
                {isHovered ? (
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Folders
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setIsFoldersExpanded(!isFoldersExpanded)}
                    >
                      <ChevronDown className={cn(
                        "h-4 w-4 transition-transform",
                        !isFoldersExpanded && "-rotate-90"
                      )} />
                    </Button>
                  </div>
                ) : (
                  <div className="w-full h-px bg-border/40" />
                )}
              </div>

              <AnimatePresence initial={false}>
                {isFoldersExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1 overflow-hidden"
                  >
                    {folders.map((folder) => {
                      const isActive = folder.id === currentFolderId
                      return (
                        <Tooltip key={folder.id}>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              className={cn(
                                "relative h-9 justify-start w-full",
                                isDark ? "text-blue-400" : "text-blue-600",
                                "transition-colors duration-200",
                                isActive && (isDark ? "bg-blue-500/10" : "bg-blue-50"),
                                !isActive && (isDark ? "hover:bg-blue-500/5" : "hover:bg-blue-50/50"),
                                !isHovered && "w-10 p-0 mx-auto"
                              )}
                              onClick={() => {
                                onFolderSelect(folder.id)
                                toggleFolder(folder.id)
                              }}
                            >
                              <span className={cn(
                                "flex items-center justify-center",
                                !isHovered && "w-10"
                              )}>
                                {getIcon((folder.icon || "folder") as keyof typeof Icons)}
                              </span>
                              {isHovered && (
                                <motion.span
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="ml-3 font-medium truncate"
                                >
                                  {folder.name}
                                </motion.span>
                              )}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent 
                            side="right" 
                            className={cn(
                              "text-sm font-medium",
                              isDark ? "bg-background/80" : "bg-white/80",
                              "backdrop-blur-sm"
                            )}
                          >
                            {folder.name}
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>

        {/* Theme Toggle */}
        <motion.div
          className={cn(
            "mx-2 mb-2 rounded-xl border",
            isDark 
              ? "bg-background/60 border-border/40"
              : "bg-white border-border/5",
            "backdrop-blur-sm overflow-hidden",
            isHovered ? "p-4" : "p-2"
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            <span className={cn(
              "flex items-center gap-2",
              isHovered ? "w-auto" : "w-6"
            )}>
              {isDark ? (
                <Icons.moon className="h-4 w-4" />
              ) : (
                <Icons.sun className="h-4 w-4" />
              )}
              {isHovered && (
                <span className="text-sm">
                  {isDark ? "Dark" : "Light"} Mode
                </span>
              )}
            </span>
            {isHovered && (
              <Icons.chevronRight className="h-4 w-4" />
            )}
          </Button>
        </motion.div>

        {/* Storage Section */}
        <motion.div
          className={cn(
            "mx-2 mb-2 rounded-xl border",
            isDark 
              ? "bg-background/60 border-border/40"
              : "bg-white border-border/5",
            "backdrop-blur-sm overflow-hidden shadow-sm",
            isHovered ? "p-4" : "p-2"
          )}
          initial={false}
          animate={{
            height: isHovered ? "auto" : "48px",
          }}
          transition={{ duration: 0.2 }}
        >
          {isHovered ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <div className="space-y-1">
                  <h3 className={cn(
                    "font-semibold",
                    isDark ? "text-blue-400" : "text-blue-600"
                  )}>
                    Storage
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {storagePercentage < 80 
                      ? `${storageUsed}GB of ${storageTotal}GB used`
                      : "Storage almost full!"
                    }
                  </p>
                </div>
                <motion.span 
                  className="text-xl"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                >
                  {storagePercentage < 30 ? "🚀" : 
                   storagePercentage < 60 ? "⚡️" : 
                   storagePercentage < 80 ? "⚠️" : "🔥"}
                </motion.span>
              </div>
              <div className="space-y-3">
                <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn(
                      "h-full transition-all",
                      storagePercentage < 80
                        ? isDark ? "bg-blue-500" : "bg-blue-600"
                        : isDark ? "bg-red-500" : "bg-red-600"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${storagePercentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
              <Button 
                variant="outline" 
                className={cn(
                  "w-full gap-2 text-sm mt-3",
                  isDark
                    ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20"
                    : "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100",
                  "transition-all duration-300"
                )}
                onClick={() => navigate("/dashboard/upgrade")}
              >
                <Icons.zap className={cn(
                  "h-4 w-4",
                  isDark ? "text-amber-400" : "text-amber-500"
                )} />
                <span className={cn(
                  "bg-clip-text text-transparent font-medium",
                  isDark
                    ? "bg-gradient-to-r from-blue-400 to-indigo-400"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600"
                )}>
                  Upgrade Plan
                </span>
              </Button>
            </>
          ) : (
            <motion.div 
              className="flex flex-col items-center justify-center h-full"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative h-1 w-8 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={cn(
                    "h-full transition-all",
                    storagePercentage < 80
                      ? isDark ? "bg-blue-500" : "bg-blue-600"
                      : isDark ? "bg-red-500" : "bg-red-600"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${storagePercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <span className="text-xs mt-1 text-muted-foreground font-medium">
                {Math.round(storagePercentage)}%
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Referral Section */}
        <motion.div
          className={cn(
            "mx-2 mb-2 rounded-xl border",
            isDark 
              ? "bg-background/60 border-border/40"
              : "bg-white border-border/5",
            "backdrop-blur-sm overflow-hidden",
            isHovered ? "p-4" : "p-2"
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full gap-2 group",
              isDark
                ? "hover:bg-emerald-500/10"
                : "hover:bg-emerald-50",
              isHovered ? "justify-between" : "justify-center"
            )}
            onClick={() => navigate("/dashboard/referral")}
          >
            <span className={cn(
              "flex items-center gap-2",
              isHovered ? "w-auto" : "w-6"
            )}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={cn(
                  "p-1 rounded-lg",
                  isDark
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-emerald-50 text-emerald-600"
                )}
              >
                <span role="img" aria-label="gift" className="text-lg">🎁</span>
              </motion.div>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col items-start"
                >
                  <span className={cn(
                    "font-semibold",
                    isDark ? "text-emerald-400" : "text-emerald-600"
                  )}>
                    Refer & Earn
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Invite friends, get rewards
                  </span>
                </motion.div>
              )}
            </span>
            {isHovered && (
              <Icons.chevronRight className={cn(
                "h-4 w-4",
                isDark ? "text-emerald-400" : "text-emerald-600"
              )} />
            )}
          </Button>
        </motion.div>

        {/* User Profile */}
        <div className="px-2 pb-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full gap-3 group",
                  isDark 
                    ? "hover:bg-blue-500/10"
                    : "hover:bg-blue-50",
                  isHovered ? "justify-start px-4" : "justify-center w-12 px-0 mx-auto"
                )}
              >
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Avatar className={cn(
                    "h-9 w-9 ring-2 ring-offset-2",
                    isDark
                      ? "ring-blue-500/20 group-hover:ring-blue-500 ring-offset-background"
                      : "ring-blue-500/10 group-hover:ring-blue-500 ring-offset-white",
                    "transition-all duration-200"
                  )}>
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className={cn(
                      isDark
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-blue-50 text-blue-600",
                      "font-medium"
                    )}>
                      JD
                    </AvatarFallback>
                  </Avatar>
                </motion.div>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-1 flex-col items-start text-sm"
                  >
                    <span className={cn(
                      "font-semibold",
                      isDark ? "text-blue-400" : "text-blue-600"
                    )}>
                      John Doe
                    </span>
                    <span className="text-muted-foreground">
                      john@example.com
                    </span>
                  </motion.div>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className={cn(
                "w-[240px]",
                isDark
                  ? "bg-background/80"
                  : "bg-white/80",
                "backdrop-blur-sm"
              )}
            >
              <DropdownMenuItem 
                onClick={() => navigate("/profile")} 
                className={cn(
                  isDark
                    ? "hover:bg-blue-500/10 hover:text-blue-400"
                    : "hover:bg-blue-50 hover:text-blue-600"
                )}
              >
                <Icons.user className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate("/settings")} 
                className={cn(
                  isDark
                    ? "hover:bg-blue-500/10 hover:text-blue-400"
                    : "hover:bg-blue-50 hover:text-blue-600"
                )}
              >
                <Icons.settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                className={cn(
                  "text-red-400 hover:text-red-500",
                  isDark
                    ? "hover:bg-red-500/10"
                    : "hover:bg-red-50"
                )}
              >
                <Icons.logout className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
    </TooltipProvider>
  )
}