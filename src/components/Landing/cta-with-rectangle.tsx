import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface CTAProps {
  badge?: {
    text: string
  }
  title: string
  description?: string
  action: {
    text: string
    href: string
    variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  }
  withGlow?: boolean
  className?: string
}

export function CTASection({
  badge,
  title,
  description,
  action,
  className,
}: CTAProps) {
  return (
    <section className={cn("overflow-hidden bg-white", className)}>
      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-8 py-24 text-center">
        {/* Content Container */}
        <div className="relative z-20 flex flex-col items-center gap-8">
          {/* Badge */}
          {badge && (
            <Badge
              variant="outline"
              className="border-blue-500 bg-blue-50 text-blue-600 px-4 py-2 text-base rounded-full"
            >
              <span className="font-medium tracking-wide">{badge.text}</span>
            </Badge>
          )}

          {/* Title */}
          <div className="space-y-4">
            <h2 className="text-4xl font-bold sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 leading-tight">
              {title}
            </h2>
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              Try it now without any strings attached
            </p>
          </div>

          {/* Description */}
          {description && (
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed">
              {description}
            </p>
          )}

          {/* Action Button */}
          <div className="flex flex-col items-center gap-3 mt-4">
            <Button
              variant={action.variant || "default"}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white text-lg px-8 py-6 h-auto font-semibold shadow-lg transition-all duration-300 rounded-full"
              asChild
            >
              <a href={action.href}>{action.text}</a>
            </Button>
            <span className="text-gray-500 text-sm">Free up to 10GB of secure storage</span>
          </div>
        </div>

        {/* Simple Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(100%_100%_at_top_center,black,transparent)]">
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M0 32V.5H32" fill="none" stroke="currentColor" strokeWidth="1"></path>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)"></rect>
          </svg>
        </div>
      </div>
    </section>
  )
}
