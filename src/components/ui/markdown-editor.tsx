import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandInput, CommandList, CommandGroup, CommandItem } from "@/components/ui/command"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Minimize2, 
  Maximize2, 
  Save, 
  Code, 
  X,
  Heading1,
  Heading2, 
  Heading3,
  Bold,
  Italic,
  Link,
  Image,
  List,
  Table,
  Sun,
  Moon,
  Plus,
  Hash,
  FileText,
  Download,
  History,
  Settings,
  HelpCircle,
  Minus,
  CheckSquare,
  MessageSquare,
  Smile,
  FileIcon,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Coffee,
  Flag,
  Heart,
  Home,
  Info,
  Lightbulb,
  Mail,
  Map,
  Music,
  Package,
  Phone,
  Search,
  Send,
  Star,
  Target,
  Trash,
  Trophy,
  Umbrella,
  User,
  Video,
  Zap,
  type LucideIcon,
  ListOrdered,
  Quote,
  AlertCircle
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { TextareaAutosize } from "@/components/ui/textarea"
import { Sidebar } from "@/components/ui/sidebar"
import { Icons } from "@/components/ui/icons"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"

interface Block {
  id: string
  type: 'text' | 'h1' | 'h2' | 'h3' | 'bullet' | 'numbered' | 'todo' | 'quote' | 'divider' | 'code' | 'callout'
  content: string
  checked?: boolean
  language?: string
}

interface Tag {
  id: string
  name: string
  color: string
}

interface Comment {
  id: string
  text: string
  author: string
  createdAt: Date
  resolved: boolean
}

interface DocumentIcon {
  icon: LucideIcon
  label: string
  keywords: string[]
}

interface DocumentTemplate {
  id: string
  title: string
  description: string
  icon: LucideIcon
  blocks: Block[]
  tags: Tag[]
}

const documentIcons: DocumentIcon[] = [
  { icon: FileIcon, label: "Document", keywords: ["file", "doc", "paper"] },
  { icon: BookOpen, label: "Book", keywords: ["read", "manual", "guide"] },
  { icon: Calendar, label: "Calendar", keywords: ["date", "schedule", "event"] },
  { icon: CheckCircle, label: "Task", keywords: ["todo", "check", "done"] },
  { icon: Clock, label: "Time", keywords: ["schedule", "deadline", "timer"] },
  { icon: Coffee, label: "Coffee", keywords: ["break", "cafe", "drink"] },
  { icon: Flag, label: "Flag", keywords: ["goal", "milestone", "target"] },
  { icon: Heart, label: "Heart", keywords: ["love", "like", "favorite"] },
  { icon: Home, label: "Home", keywords: ["house", "main", "base"] },
  { icon: Info, label: "Info", keywords: ["information", "help", "about"] },
  { icon: Lightbulb, label: "Idea", keywords: ["thought", "innovation", "creative"] },
  { icon: Mail, label: "Mail", keywords: ["email", "message", "contact"] },
  { icon: Map, label: "Map", keywords: ["location", "place", "navigation"] },
  { icon: Music, label: "Music", keywords: ["song", "audio", "sound"] },
  { icon: Package, label: "Package", keywords: ["box", "delivery", "product"] },
  { icon: Phone, label: "Phone", keywords: ["call", "contact", "mobile"] },
  { icon: Search, label: "Search", keywords: ["find", "lookup", "explore"] },
  { icon: Send, label: "Send", keywords: ["share", "deliver", "transfer"] },
  { icon: Star, label: "Star", keywords: ["favorite", "important", "bookmark"] },
  { icon: Target, label: "Target", keywords: ["goal", "aim", "objective"] },
  { icon: Trophy, label: "Trophy", keywords: ["award", "achievement", "win"] },
  { icon: Umbrella, label: "Umbrella", keywords: ["protection", "cover", "shield"] },
  { icon: User, label: "User", keywords: ["person", "profile", "account"] },
  { icon: Video, label: "Video", keywords: ["movie", "film", "media"] },
  { icon: Zap, label: "Zap", keywords: ["power", "energy", "fast"] }
]

const documentTemplates: DocumentTemplate[] = [
  {
    id: 'empty',
    title: 'Empty Document',
    description: 'Start with a blank canvas',
    icon: FileText,
    blocks: [{ id: '1', type: 'text', content: '' }],
    tags: []
  },
  {
    id: 'meeting',
    title: 'Meeting Notes',
    description: 'Template for meeting minutes and action items',
    icon: Calendar,
    blocks: [
      { id: '1', type: 'h1', content: 'Meeting Title' },
      { id: '2', type: 'text', content: 'Date: ' },
      { id: '3', type: 'text', content: 'Attendees: ' },
      { id: '4', type: 'h2', content: 'Agenda' },
      { id: '5', type: 'bullet', content: '' },
      { id: '6', type: 'h2', content: 'Discussion Points' },
      { id: '7', type: 'bullet', content: '' },
      { id: '8', type: 'h2', content: 'Action Items' },
      { id: '9', type: 'todo', content: '' }
    ],
    tags: [{ id: '1', name: 'meeting', color: 'bg-blue-500/10 text-blue-500' }]
  },
  {
    id: 'business-plan',
    title: 'Business Plan',
    description: 'Structured template for business planning',
    icon: Target,
    blocks: [
      { id: '1', type: 'h1', content: 'Business Plan' },
      { id: '2', type: 'h2', content: 'Executive Summary' },
      { id: '3', type: 'text', content: '' },
      { id: '4', type: 'h2', content: 'Market Analysis' },
      { id: '5', type: 'bullet', content: 'Target Market: ' },
      { id: '6', type: 'bullet', content: 'Competition: ' },
      { id: '7', type: 'h2', content: 'Financial Projections' },
      { id: '8', type: 'text', content: '' }
    ],
    tags: [{ id: '1', name: 'business', color: 'bg-green-500/10 text-green-500' }]
  },
  {
    id: 'research',
    title: 'Research Paper',
    description: 'Academic research paper structure',
    icon: BookOpen,
    blocks: [
      { id: '1', type: 'h1', content: 'Research Title' },
      { id: '2', type: 'h2', content: 'Abstract' },
      { id: '3', type: 'text', content: '' },
      { id: '4', type: 'h2', content: 'Introduction' },
      { id: '5', type: 'text', content: '' },
      { id: '6', type: 'h2', content: 'Methodology' },
      { id: '7', type: 'text', content: '' },
      { id: '8', type: 'h2', content: 'Results' },
      { id: '9', type: 'text', content: '' },
      { id: '10', type: 'h2', content: 'Discussion' },
      { id: '11', type: 'text', content: '' }
    ],
    tags: [{ id: '1', name: 'research', color: 'bg-purple-500/10 text-purple-500' }]
  },
  {
    id: 'weekly-review',
    title: 'Weekly Review',
    description: 'Template for weekly progress tracking',
    icon: Clock,
    blocks: [
      { id: '1', type: 'h1', content: 'Weekly Review' },
      { id: '2', type: 'text', content: 'Week of: ' },
      { id: '3', type: 'h2', content: 'Accomplishments' },
      { id: '4', type: 'todo', content: '' },
      { id: '5', type: 'h2', content: 'Challenges' },
      { id: '6', type: 'bullet', content: '' },
      { id: '7', type: 'h2', content: 'Next Week\'s Goals' },
      { id: '8', type: 'todo', content: '' }
    ],
    tags: [{ id: '1', name: 'review', color: 'bg-amber-500/10 text-amber-500' }]
  }
]

interface MarkdownEditorProps {
  initialContent?: string
  onSave?: (content: string, title: string, tags: Tag[]) => void
  onClose?: () => void
}

const blockTypes = [
  {
    heading: "Basic blocks",
    items: [
      { id: 'text', icon: '📝', label: 'Text', description: 'Just start writing with plain text' },
      { id: 'h1', icon: 'H1', label: 'Heading 1', description: 'Big section heading' },
      { id: 'h2', icon: 'H2', label: 'Heading 2', description: 'Medium section heading' },
      { id: 'h3', icon: 'H3', label: 'Heading 3', description: 'Small section heading' },
    ]
  },
  {
    heading: "Media",
    items: [
      { id: 'image', icon: '🖼️', label: 'Image', description: 'Upload or embed an image' },
      { id: 'video', icon: '🎥', label: 'Video', description: 'Embed a video' },
      { id: 'bookmark', icon: '🔖', label: 'Bookmark', description: 'Save a link as a visual bookmark' },
      { id: 'file', icon: '📎', label: 'File', description: 'Upload a file' },
    ]
  },
  {
    heading: "Lists",
    items: [
      { id: 'bullet', icon: '•', label: 'Bulleted list', description: 'Create a simple bullet list' },
      { id: 'numbered', icon: '1.', label: 'Numbered list', description: 'Create a numbered list' },
      { id: 'todo', icon: '☐', label: 'To-do list', description: 'Track tasks with a to-do list' },
      { id: 'toggle', icon: '▸', label: 'Toggle list', description: 'Expandable toggle list' },
    ]
  },
  {
    heading: "Advanced",
    items: [
      { id: 'code', icon: '💻', label: 'Code', description: 'Add code with syntax highlighting' },
      { id: 'quote', icon: '💭', label: 'Quote', description: 'Capture a quote or highlight' },
      { id: 'callout', icon: '💡', label: 'Callout', description: 'Make text stand out' },
      { id: 'divider', icon: '⎯', label: 'Divider', description: 'Visual divider between blocks' },
    ]
  },
]

// Add emoji picker component
const EmojiPicker = ({ onSelect }: { onSelect: (emoji: string) => void }) => {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState("smileys")
  
  const categories = [
    { id: "smileys", icon: "😊", label: "Smileys" },
    { id: "people", icon: "👋", label: "People" },
    { id: "nature", icon: "🌲", label: "Nature" },
    { id: "food", icon: "🍔", label: "Food" },
    { id: "activities", icon: "⚽", label: "Activities" },
    { id: "travel", icon: "✈️", label: "Travel" },
    { id: "objects", icon: "💡", label: "Objects" },
    { id: "symbols", icon: "❤️", label: "Symbols" },
    { id: "flags", icon: "🏁", label: "Flags" }
  ]

  return (
    <div className="w-[350px] p-4 bg-popover rounded-lg shadow-lg">
      <div className="flex flex-col space-y-4">
        <Input
          placeholder="Search emojis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex-shrink-0"
            >
              <span className="mr-1">{category.icon}</span>
              {category.label}
            </Button>
          ))}
        </div>

        <ScrollArea className="h-[300px]">
          <div className="grid grid-cols-8 gap-1">
            {/* This would be populated with actual emojis based on the category and search */}
            {Array.from({ length: 100 }).map((_, i) => (
              <button
                key={i}
                className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted"
                onClick={() => onSelect("😊")}
              >
                😊
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

// Update the BlockMenu component
const BlockMenu = ({ onClose, onSelect }: { onClose: () => void, onSelect: (type: string) => void }) => {
  const [searchTerm, setSearchTerm] = React.useState("")
  const { theme } = useTheme()
  const isDark = theme === "dark"
  
  const blockCategories = [
    {
      title: "Basic blocks",
      items: [
        { id: 'text', icon: <FileText className="h-4 w-4" />, label: 'Text', description: 'Just start writing with plain text' },
        { id: 'h1', icon: <Heading1 className="h-4 w-4" />, label: 'Heading 1', description: 'Big section heading' },
        { id: 'h2', icon: <Heading2 className="h-4 w-4" />, label: 'Heading 2', description: 'Medium section heading' },
        { id: 'h3', icon: <Heading3 className="h-4 w-4" />, label: 'Heading 3', description: 'Small section heading' },
      ]
    },
    {
      title: "Lists",
      items: [
        { id: 'bullet', icon: <List className="h-4 w-4" />, label: 'Bullet List', description: 'Create a simple bullet list' },
        { id: 'numbered', icon: <ListOrdered className="h-4 w-4" />, label: 'Numbered List', description: 'Create a numbered list' },
        { id: 'todo', icon: <CheckSquare className="h-4 w-4" />, label: 'To-do List', description: 'Track tasks with a to-do list' },
      ]
    },
    {
      title: "Media",
      items: [
        { id: 'image', icon: <Image className="h-4 w-4" />, label: 'Image', description: 'Upload or embed an image' },
        { id: 'video', icon: <Video className="h-4 w-4" />, label: 'Video', description: 'Embed a video' },
        { id: 'code', icon: <Code className="h-4 w-4" />, label: 'Code', description: 'Add code with syntax highlighting' },
      ]
    },
    {
      title: "Advanced",
      items: [
        { id: 'quote', icon: <Quote className="h-4 w-4" />, label: 'Quote', description: 'Capture a quote or highlight' },
        { id: 'callout', icon: <AlertCircle className="h-4 w-4" />, label: 'Callout', description: 'Make text stand out' },
        { id: 'divider', icon: <Minus className="h-4 w-4" />, label: 'Divider', description: 'Visual divider between blocks' },
      ]
    }
  ]

  const filteredCategories = React.useMemo(() => {
    if (!searchTerm) return blockCategories
    const search = searchTerm.toLowerCase()
    return blockCategories
      .map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.label.toLowerCase().includes(search) ||
          item.description.toLowerCase().includes(search)
        )
      }))
      .filter(category => category.items.length > 0)
  }, [searchTerm])

  return (
    <div className={cn(
      "w-[300px] rounded-lg shadow-lg border overflow-hidden",
      isDark ? "bg-background border-border/40" : "bg-white border-border/10"
    )}>
      <div className="p-2 border-b">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for blocks..."
          className="w-full"
          autoFocus
        />
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="p-2">
          {filteredCategories.map((category) => (
            <div key={category.title} className="mb-4">
              <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                {category.title}
              </h3>
              <div className="space-y-1">
                {category.items.map((item) => (
                  <button
                    key={item.id}
                    className={cn(
                      "w-full flex items-center gap-3 p-2 rounded-lg text-left",
                      "hover:bg-accent transition-colors"
                    )}
                    onClick={() => {
                      onSelect(item.id)
                      onClose()
                    }}
                  >
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border",
                      isDark ? "bg-background/50 border-border/40" : "bg-background border-border/10"
                    )}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

// Add after the BlockMenu component
const BlockRenderer = ({ 
  block, 
  isActive, 
  onChange,
  onToggleTodo,
  onKeyDown,
  onFocus,
  onBlur
}: { 
  block: Block
  isActive: boolean
  onChange: (content: string) => void
  onToggleTodo: (id: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onFocus: () => void
  onBlur: () => void
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [showBlockMenu, setShowBlockMenu] = React.useState(false)
  const [blockMenuPosition, setBlockMenuPosition] = React.useState({ x: 0, y: 0 })

  const getBlockStyles = () => {
    const baseStyles = cn(
      "relative w-full rounded-lg transition-all duration-200",
      "focus-within:ring-1 focus-within:ring-ring",
      isActive && "bg-accent/50"
    )

    switch (block.type) {
      case 'h1':
        return cn(baseStyles, "text-4xl font-bold tracking-tight")
      case 'h2':
        return cn(baseStyles, "text-3xl font-semibold tracking-tight")
      case 'h3':
        return cn(baseStyles, "text-2xl font-medium tracking-tight")
      case 'bullet':
        return cn(baseStyles, "flex items-start gap-2 pl-4")
      case 'numbered':
        return cn(baseStyles, "flex items-start gap-2 pl-4")
      case 'todo':
        return cn(baseStyles, "flex items-start gap-2 pl-4")
      case 'quote':
        return cn(baseStyles, "pl-4 border-l-4 border-muted italic")
      case 'code':
        return cn(baseStyles, "font-mono bg-muted/50 p-4")
      case 'callout':
        return cn(baseStyles, "bg-muted/30 p-4 border border-border/50")
      default:
        return baseStyles
    }
  }

  const getPlaceholder = () => {
    if (!isActive) return ""
    
    switch (block.type) {
      case 'h1':
        return "Heading 1"
      case 'h2':
        return "Heading 2"
      case 'h3':
        return "Heading 3"
      case 'bullet':
        return "List item"
      case 'numbered':
        return "List item"
      case 'todo':
        return "To-do item"
      case 'quote':
        return "Quote"
      case 'code':
        return "Code"
      case 'callout':
        return "Callout"
      default:
        return "Type '/' for commands..."
    }
  }

  const renderPrefix = () => {
    switch (block.type) {
      case 'bullet':
        return (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mt-[0.6em] w-1.5 h-1.5 rounded-full bg-foreground shrink-0"
          />
        )
      case 'numbered':
        return (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="mt-[0.4em] text-sm text-muted-foreground font-medium shrink-0 w-4 text-right"
          >
            {/* We'll handle the actual numbering in the parent component */}
            1.
          </motion.div>
        )
      case 'todo':
        return (
          <motion.button
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggleTodo(block.id)}
            className={cn(
              "mt-[0.4em] w-4 h-4 rounded border border-input shrink-0",
              "transition-colors duration-200",
              block.checked && "bg-primary border-primary"
            )}
          >
            {block.checked && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
              >
                <CheckCircle className="w-3 h-3 text-primary-foreground" />
              </motion.div>
            )}
          </motion.button>
        )
      case 'quote':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-0 top-0 bottom-0 w-1 bg-muted-foreground rounded"
          />
        )
      case 'callout':
        return (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute left-2 top-1/2 -translate-y-1/2"
          >
            <Info className="w-4 h-4 text-muted-foreground" />
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <div className={cn(
      "group relative py-1 -mx-3 px-3 rounded-lg",
      "hover:bg-muted/50 transition-colors duration-200"
    )}>
      <div className={getBlockStyles()}>
        {renderPrefix()}
        <TextareaAutosize
          ref={textareaRef}
          value={block.content}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={getPlaceholder()}
          className={cn(
            "w-full resize-none bg-transparent px-0 py-1",
            "focus:outline-none focus:ring-0",
            "placeholder:text-muted-foreground/50",
            block.type === 'code' && "font-mono",
            block.checked && "line-through opacity-50"
          )}
          style={{
            fontSize: block.type === 'h1' ? '2.25rem' : 
                     block.type === 'h2' ? '1.875rem' : 
                     block.type === 'h3' ? '1.5rem' : 
                     '1rem',
            lineHeight: block.type.startsWith('h') ? '1.2' : '1.5'
          }}
        />
      </div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="absolute -left-12 top-1/2 -translate-y-1/2 flex items-center gap-1"
          >
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-6 w-6 rounded-md",
                "hover:bg-accent transition-colors duration-200"
              )}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                setBlockMenuPosition({ x: rect.left - 320, y: rect.top })
                setShowBlockMenu(true)
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-md hover:bg-accent"
                onClick={() => {
                  const newBlock = { ...block, type: 'h1' }
                  onChange(newBlock.content)
                }}
              >
                <Heading1 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-md hover:bg-accent"
                onClick={() => {
                  const newBlock = { ...block, type: 'h2' }
                  onChange(newBlock.content)
                }}
              >
                <Heading2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-md hover:bg-accent"
                onClick={() => {
                  const newBlock = { ...block, type: 'h3' }
                  onChange(newBlock.content)
                }}
              >
                <Heading3 className="h-3 w-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Add template selection dialog component
const TemplateDialog = ({
  open,
  onOpenChange,
  onSelectTemplate
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectTemplate: (template: DocumentTemplate) => void
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const filteredTemplates = documentTemplates.filter(template =>
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[800px] p-0",
        isDark ? "bg-background/95" : "bg-white/95",
        "backdrop-blur-sm"
      )}>
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">Choose a Template</DialogTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </DialogHeader>
        <ScrollArea className="h-[500px] p-6">
          <div className="grid grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <motion.button
                key={template.id}
                className={cn(
                  "group relative flex flex-col gap-2 rounded-lg border p-6 text-left",
                  "transition-all duration-200",
                  isDark
                    ? "hover:bg-accent/50 border-border/40"
                    : "hover:bg-accent/50 border-border/5",
                  "overflow-hidden"
                )}
                onClick={() => onSelectTemplate(template)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{template.icon}</span>
                  <div>
                    <h3 className="font-semibold">{template.title}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className={cn(
                        "px-2 py-1 text-xs rounded-full",
                        isDark
                          ? "bg-accent/50 text-accent-foreground"
                          : "bg-accent/50 text-accent-foreground"
                      )}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
                <div className="absolute inset-0 pointer-events-none">
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity",
                    isDark
                      ? "bg-gradient-to-br from-blue-500/10 to-indigo-500/10"
                      : "bg-gradient-to-br from-blue-500/5 to-indigo-500/5"
                  )} />
                </div>
              </motion.button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

interface SidebarProps {
  className?: string
  folders?: Array<{
    id: string
    name: string
    files: Array<{
      id: string
      name: string
      type: string
    }>
  }>
  currentFolderId?: string | null
  onFolderSelect?: (folderId: string | null) => void
}

export function MarkdownEditor({ 
  initialContent = "", 
  onSave,
  onClose 
}: MarkdownEditorProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [showTemplateDialog, setShowTemplateDialog] = React.useState(!initialContent)
  const [blocks, setBlocks] = React.useState<Block[]>([])
  const [title, setTitle] = React.useState("Untitled Document")
  const [tags, setTags] = React.useState<Tag[]>([])
  const [newTag, setNewTag] = React.useState("")
  const [showComments, setShowComments] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [activeBlockId, setActiveBlockId] = React.useState<string | null>(null)
  const [selectedEmoji, setSelectedEmoji] = React.useState("📄")
  const [showBlockMenu, setShowBlockMenu] = React.useState(false)
  const [blockMenuPosition, setBlockMenuPosition] = React.useState({ x: 0, y: 0 })
  const [showCommands, setShowCommands] = React.useState(false)
  const [comments, setComments] = React.useState<Comment[]>([])
  const [newComment, setNewComment] = React.useState("")
  const [selectedText, setSelectedText] = React.useState("")
  const [showTagInput, setShowTagInput] = React.useState(false)
  const [wordCount, setWordCount] = React.useState(0)
  const [charCount, setCharCount] = React.useState(0)
  const [folders] = React.useState([
    {
      id: '1',
      name: 'My Documents',
      files: [
        { id: '1', name: 'Welcome', type: 'doc' }
      ]
    }
  ])

  const editorRef = React.useRef<HTMLTextAreaElement>(null)

  // Initialize with welcome content if no template is selected
  React.useEffect(() => {
    if (!showTemplateDialog && blocks.length === 0) {
      setBlocks([
        { id: '1', type: 'h1', content: 'Welcome to Your Document' },
        { id: '2', type: 'text', content: 'Start writing or press "/" for commands...' },
      ])
      setActiveBlockId('2')
    }
  }, [showTemplateDialog])

  // Handle text selection for comments
  const handleTextSelection = () => {
    if (window.getSelection) {
      const selection = window.getSelection()
      if (selection && selection.toString().trim()) {
        setSelectedText(selection.toString())
      }
    }
  }

  // Add comment
  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Math.random().toString(36).substr(2, 9),
        text: newComment,
        author: "You",
        createdAt: new Date(),
        resolved: false
      }
      setComments([...comments, comment])
      setNewComment("")
      setSelectedText("")
    }
  }

  // Toggle comment resolution
  const toggleCommentResolution = (id: string) => {
    setComments(comments.map(comment =>
      comment.id === id ? { ...comment, resolved: !comment.resolved } : comment
    ))
  }

  // Delete comment
  const deleteComment = (id: string) => {
    setComments(comments.filter(comment => comment.id !== id))
  }

  // Auto-save functionality
  React.useEffect(() => {
    const saveTimer = setTimeout(() => {
      onSave?.(blocks.map(b => b.content).join('\n'), title, tags)
    }, 1000)

    return () => clearTimeout(saveTimer)
  }, [blocks, title, tags])

  // Word and character count
  React.useEffect(() => {
    const words = blocks.map(b => b.content.trim().split(/\s+/).filter(Boolean).length).reduce((a, b) => a + b, 0)
    const chars = blocks.map(b => b.content.length).reduce((a, b) => a + b, 0)
    setWordCount(words)
    setCharCount(chars)
  }, [blocks])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, blockId: string) => {
    const currentBlockIndex = blocks.findIndex(b => b.id === blockId)
    const currentBlock = blocks[currentBlockIndex]
    
    if (!currentBlock) return

    // Handle Enter to create new block
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      
      const textBeforeCursor = e.currentTarget.value.slice(0, e.currentTarget.selectionStart)
      const textAfterCursor = e.currentTarget.value.slice(e.currentTarget.selectionStart)
      
      // Update current block with text before cursor
      const updatedBlocks = [...blocks]
      updatedBlocks[currentBlockIndex] = {
        ...currentBlock,
        content: textBeforeCursor
      }
      
      // Create new block with text after cursor
      const newBlock: Block = {
        id: Math.random().toString(36).substr(2, 9),
        type: currentBlock.type === 'h1' || currentBlock.type === 'h2' || currentBlock.type === 'h3' ? 'text' : currentBlock.type,
        content: textAfterCursor,
        checked: currentBlock.type === 'todo' ? false : undefined
      }
      
      updatedBlocks.splice(currentBlockIndex + 1, 0, newBlock)
      setBlocks(updatedBlocks)
      setActiveBlockId(newBlock.id)
    }
    
    // Handle Backspace to merge with previous block
    if (e.key === 'Backspace' && e.currentTarget.selectionStart === 0 && currentBlockIndex > 0) {
      e.preventDefault()
      
      const previousBlock = blocks[currentBlockIndex - 1]
      const updatedBlocks = [...blocks]
      
      // Merge current block content with previous block
      updatedBlocks[currentBlockIndex - 1] = {
        ...previousBlock,
        content: previousBlock.content + currentBlock.content
      }
      
      // Remove current block
      updatedBlocks.splice(currentBlockIndex, 1)
      setBlocks(updatedBlocks)
      setActiveBlockId(previousBlock.id)
    }
    
    // Handle Tab for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const updatedBlocks = [...blocks]
      
      if (e.shiftKey) {
        // Unindent: Remove 2 spaces from the start if they exist
        if (currentBlock.content.startsWith('  ')) {
          updatedBlocks[currentBlockIndex] = {
            ...currentBlock,
            content: currentBlock.content.slice(2)
          }
          setBlocks(updatedBlocks)
          setTimeout(() => {
            if (e.currentTarget) {
              e.currentTarget.setSelectionRange(Math.max(0, start - 2), Math.max(0, end - 2))
            }
          }, 0)
        }
      } else {
        // Indent: Add 2 spaces
        updatedBlocks[currentBlockIndex] = {
          ...currentBlock,
          content: '  ' + currentBlock.content
        }
        setBlocks(updatedBlocks)
        setTimeout(() => {
          if (e.currentTarget) {
            e.currentTarget.setSelectionRange(start + 2, end + 2)
          }
        }, 0)
      }
    }

    // Handle arrow keys for block navigation
    if (e.key === 'ArrowUp' && e.currentTarget.selectionStart === 0) {
      e.preventDefault()
      if (currentBlockIndex > 0) {
        setActiveBlockId(blocks[currentBlockIndex - 1].id)
      }
    }
    
    if (e.key === 'ArrowDown' && e.currentTarget.selectionStart === currentBlock.content.length) {
      e.preventDefault()
      if (currentBlockIndex < blocks.length - 1) {
        setActiveBlockId(blocks[currentBlockIndex + 1].id)
      }
    }
  }

  const addTag = (name: string) => {
    const colors = [
      "bg-blue-500/10 text-blue-500",
      "bg-green-500/10 text-green-500",
      "bg-purple-500/10 text-purple-500",
      "bg-amber-500/10 text-amber-500",
      "bg-rose-500/10 text-rose-500",
    ]
    
    setTags([
      ...tags,
      {
        id: Math.random().toString(36).substr(2, 9),
        name,
        color: colors[Math.floor(Math.random() * colors.length)]
      }
    ])
  }

  const removeTag = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id))
  }

  const insertMarkdown = (type: string) => {
    if (!editorRef.current) return

    const start = editorRef.current.selectionStart
    const end = editorRef.current.selectionEnd
    const text = editorRef.current.value
    let insertion = ""

    switch (type) {
      case "h1":
        insertion = "# "
        break
      case "h2":
        insertion = "## "
        break
      case "h3":
        insertion = "### "
        break
      case "bold":
        insertion = "**Bold Text**"
        break
      case "italic":
        insertion = "*Italic Text*"
        break
      case "link":
        insertion = "[Link Text](url)"
        break
      case "image":
        insertion = "![Alt Text](image-url)"
        break
      case "code":
        insertion = "\`\`\`\ncode\n\`\`\`"
        break
      case "list":
        insertion = "- List Item\n- List Item\n- List Item"
        break
      case "table":
        insertion = "| Header | Header |\n| ------ | ------ |\n| Cell | Cell |"
        break
      case "divider":
        insertion = "\n---\n"
        break
      case "todo":
        insertion = "- [ ] Task 1\n- [ ] Task 2\n- [ ] Task 3"
        break
    }

    const newContent = text.substring(0, start) + insertion + text.substring(end)
    setBlocks(blocks.map(b =>
      b.id === activeBlockId ? { ...b, content: newContent } : b
    ))
    setShowCommands(false)

    // Set cursor position after insertion
    setTimeout(() => {
      editorRef.current?.focus()
      editorRef.current?.setSelectionRange(start + insertion.length, start + insertion.length)
    }, 0)
  }

  const formatToolbarItems = [
    { icon: "heading1", label: "Heading 1", action: () => insertMarkdown("h1"), component: <Heading1 className="h-4 w-4" /> },
    { icon: "heading2", label: "Heading 2", action: () => insertMarkdown("h2"), component: <Heading2 className="h-4 w-4" /> },
    { icon: "heading3", label: "Heading 3", action: () => insertMarkdown("h3"), component: <Heading3 className="h-4 w-4" /> },
    { icon: "bold", label: "Bold", action: () => insertMarkdown("bold"), component: <Bold className="h-4 w-4" /> },
    { icon: "italic", label: "Italic", action: () => insertMarkdown("italic"), component: <Italic className="h-4 w-4" /> },
    { icon: "link", label: "Link", action: () => insertMarkdown("link"), component: <Link className="h-4 w-4" /> },
    { icon: "image", label: "Image", action: () => insertMarkdown("image"), component: <Image className="h-4 w-4" /> },
    { icon: "code", label: "Code Block", action: () => insertMarkdown("code"), component: <Code className="h-4 w-4" /> },
    { icon: "list", label: "List", action: () => insertMarkdown("list"), component: <List className="h-4 w-4" /> },
    { icon: "table", label: "Table", action: () => insertMarkdown("table"), component: <Table className="h-4 w-4" /> }
  ]

  const handleBlockChange = (
    blocks: Block[], 
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>
  ) => (id: string, content: string) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, content } : block
    ))
  }

  const addBlock = (
    blocks: Block[], 
    setBlocks: React.Dispatch<React.SetStateAction<Block[]>>,
    activeBlockId: string | null,
    type: Block['type']
  ) => {
    const newBlock: Block = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: '',
      checked: type === 'todo' ? false : undefined
    }
    
    if (activeBlockId) {
      const index = blocks.findIndex(b => b.id === activeBlockId)
      const newBlocks = [...blocks]
      newBlocks.splice(index + 1, 0, newBlock)
      setBlocks(newBlocks)
    } else {
      setBlocks([...blocks, newBlock])
    }
  }

  const toggleTodo = (blocks: Block[], setBlocks: React.Dispatch<React.SetStateAction<Block[]>>) => (id: string) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, checked: !block.checked } : block
    ))
  }

  const renderBlock = (block: Block) => {
    const BlockWrapper = ({ children }: { children: React.ReactNode }) => (
      <div className="group relative">
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-muted"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              setBlockMenuPosition({ x: rect.left - 320, y: rect.top })
              setActiveBlockId(block.id)
              setShowBlockMenu(true)
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    )

    switch (block.type) {
      case 'h1':
        return (
          <BlockWrapper>
            <div className="relative group">
              <textarea
                value={block.content}
                onChange={(e) => handleBlockChange(blocks, setBlocks)(block.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                className="w-full resize-none bg-transparent text-4xl font-bold focus:outline-none"
                placeholder="Heading 1"
                rows={1}
                style={{ height: 'auto' }}
              />
            </div>
          </BlockWrapper>
        )
      case 'h2':
        return (
          <BlockWrapper>
            <div className="relative group">
              <textarea
                value={block.content}
                onChange={(e) => handleBlockChange(blocks, setBlocks)(block.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                className="w-full resize-none bg-transparent text-3xl font-semibold focus:outline-none"
                placeholder="Heading 2"
                rows={1}
                style={{ height: 'auto' }}
              />
            </div>
          </BlockWrapper>
        )
      case 'h3':
        return (
          <BlockWrapper>
            <div className="relative group">
              <textarea
                value={block.content}
                onChange={(e) => handleBlockChange(blocks, setBlocks)(block.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                className="w-full resize-none bg-transparent text-2xl font-medium focus:outline-none"
                placeholder="Heading 3"
                rows={1}
                style={{ height: 'auto' }}
              />
            </div>
          </BlockWrapper>
        )
      case 'bullet':
        return (
          <BlockWrapper>
            <div className="relative group flex items-start gap-2">
              <div className="mt-2.5 w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <textarea
                value={block.content}
                onChange={(e) => handleBlockChange(blocks, setBlocks)(block.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                className="flex-1 resize-none bg-transparent focus:outline-none"
                placeholder="List item"
                rows={1}
                style={{ height: 'auto' }}
              />
            </div>
          </BlockWrapper>
        )
      case 'numbered':
        return (
          <BlockWrapper>
            <div className="relative group flex items-start gap-2">
              <div className="mt-1 text-sm text-muted-foreground shrink-0">
                {blocks.filter(b => b.type === 'numbered').findIndex(b => b.id === block.id) + 1}.
              </div>
              <textarea
                value={block.content}
                onChange={(e) => handleBlockChange(blocks, setBlocks)(block.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                className="flex-1 resize-none bg-transparent focus:outline-none"
                placeholder="List item"
                rows={1}
                style={{ height: 'auto' }}
              />
            </div>
          </BlockWrapper>
        )
      case 'todo':
        return (
          <BlockWrapper>
            <div className="relative group flex items-start gap-2">
              <button
                onClick={() => toggleTodo(blocks, setBlocks)(block.id)}
                className={cn(
                  "mt-1 w-4 h-4 rounded border border-input shrink-0",
                  block.checked && "bg-primary border-primary"
                )}
              >
                {block.checked && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
              </button>
              <textarea
                value={block.content}
                onChange={(e) => handleBlockChange(blocks, setBlocks)(block.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                className={cn(
                  "flex-1 resize-none bg-transparent focus:outline-none",
                  block.checked && "line-through opacity-50"
                )}
                placeholder="To-do"
                rows={1}
                style={{ height: 'auto' }}
              />
            </div>
          </BlockWrapper>
        )
      case 'quote':
        return (
          <BlockWrapper>
            <div className="relative group flex gap-2">
              <div className="w-1 bg-muted-foreground rounded" />
              <textarea
                value={block.content}
                onChange={(e) => handleBlockChange(blocks, setBlocks)(block.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                className="flex-1 resize-none bg-transparent focus:outline-none italic"
                placeholder="Quote"
                rows={1}
                style={{ height: 'auto' }}
              />
            </div>
          </BlockWrapper>
        )
      case 'divider':
        return <hr className="my-4 border-border" />
      default:
        return (
          <BlockWrapper>
            <div className="relative group">
              <textarea
                value={block.content}
                onChange={(e) => handleBlockChange(blocks, setBlocks)(block.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, block.id)}
                className="w-full resize-none bg-transparent focus:outline-none"
                placeholder="Type '/' for commands"
                rows={1}
                style={{ height: 'auto' }}
              />
            </div>
          </BlockWrapper>
        )
    }
  }

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setBlocks(template.blocks)
    setTags(template.tags)
    setTitle(template.title)
    setSelectedEmoji(template.icon === FileText ? "📄" : "📝")
    setShowTemplateDialog(false)
    setActiveBlockId(template.blocks[0].id)
  }

  return (
    <div className="flex h-screen">
      <Sidebar 
        className="w-[280px] shrink-0"
        folders={folders}
        currentFolderId="1"
        onFolderSelect={() => {}}
      />

      <div className={cn(
        "flex-1 flex flex-col bg-background transition-colors duration-300",
        isFullscreen && "fixed inset-0 z-50"
      )}>
        <div className={cn(
          "flex items-center justify-between px-4 py-2 border-b",
          isDark ? "border-border/40" : "border-border/10"
        )}>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-muted"
                  >
                    {selectedEmoji}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0" align="start">
                  <Picker
                    data={data}
                    onEmojiSelect={(emoji: any) => {
                      setSelectedEmoji(emoji.native)
                    }}
                    theme={isDark ? "dark" : "light"}
                  />
                </PopoverContent>
              </Popover>

              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={cn(
                  "text-lg font-medium bg-transparent border-0 p-0 focus-visible:ring-0 w-[300px]",
                  isDark ? "placeholder:text-muted-foreground" : "placeholder:text-muted-foreground/70"
                )}
                placeholder="Untitled Document"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {tags.map(tag => (
                  <motion.div
                    key={tag.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge
                      className={cn(
                        "px-2 py-0.5 text-xs font-medium cursor-pointer transition-colors",
                        tag.color
                      )}
                      onClick={() => removeTag(tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {showTagInput ? (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                >
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => {
                      if (newTag.trim()) addTag(newTag)
                      setNewTag("")
                      setShowTagInput(false)
                    }}
                    className="h-6 text-xs w-24"
                    placeholder="Add tag..."
                    autoFocus
                  />
                </motion.div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setShowTagInput(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Tag
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowComments(!showComments)}
              className={cn(
                "text-muted-foreground",
                showComments && "bg-muted"
              )}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>

            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                  <X className="h-4 w-4" />
                </Button>
              )}
          </div>
        </div>

        <div className="flex flex-1">
          <div className="flex-1 overflow-auto">
            <div className="max-w-3xl mx-auto p-8 space-y-4">
              {blocks.map(block => (
                <div key={block.id} className="min-h-[1.5em]">
                  <BlockRenderer
                    block={block}
                    isActive={block.id === activeBlockId}
                    onChange={(content) => handleBlockChange(blocks, setBlocks)(block.id, content)}
                    onToggleTodo={toggleTodo(blocks, setBlocks)}
                    onKeyDown={(e) => handleKeyDown(e, block.id)}
                    onFocus={() => setActiveBlockId(block.id)}
                    onBlur={() => {
                      // Only clear active block if we're not clicking another block
                      if (!blocks.some(b => b.id === activeBlockId)) {
                        setActiveBlockId(null)
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {showComments && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "300px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className={cn(
                "w-[300px] flex flex-col border-l",
                isDark ? "border-border/40" : "border-border/10"
              )}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-medium">Comments</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowComments(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4 space-y-4">
                  {comments.map(comment => (
                    <div
                      key={comment.id}
                      className={cn(
                        "p-3 rounded-lg",
                        isDark ? "bg-muted/50" : "bg-muted",
                        comment.resolved && "opacity-50"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => toggleCommentResolution(comment.id)}
                          >
                            <CheckCircle className={cn(
                              "h-4 w-4",
                              comment.resolved && "text-green-500"
                            )} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => deleteComment(comment.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                {selectedText && (
                  <div className="mb-2 p-2 text-sm bg-muted rounded">
                    <p className="font-medium mb-1">Selected Text:</p>
                    <p className="text-muted-foreground">{selectedText}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  <Input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        addComment()
                      }
                    }}
                  />
                  <Button
                    variant="default"
                    size="icon"
                    onClick={addComment}
                    disabled={!newComment.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className={cn(
          "flex items-center justify-between px-4 py-2 border-t text-sm text-muted-foreground",
          isDark ? "border-border/40" : "border-border/10"
        )}>
          <div className="flex items-center gap-4">
            <span>{wordCount} words</span>
            <span>{charCount} characters</span>
          </div>
        </div>
      </div>

      {showBlockMenu && (
        <div
          className="fixed z-50"
          style={{
            top: blockMenuPosition.y,
            left: blockMenuPosition.x
          }}
        >
          <BlockMenu 
            onClose={() => setShowBlockMenu(false)} 
            onSelect={(type) => {
              addBlock(blocks, setBlocks, activeBlockId, type as Block['type'])
              setShowBlockMenu(false)
            }} 
          />
        </div>
      )}

      <TemplateDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        onSelectTemplate={handleTemplateSelect}
      />
    </div>
  )
} 