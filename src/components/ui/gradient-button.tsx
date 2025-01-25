import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gradientButtonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-lg text-sm font-medium text-white",
    "bg-gradient-to-r from-blue-600 to-indigo-600",
    "hover:from-blue-500 hover:to-indigo-500",
    "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "transition-all duration-300",
    "shadow-[0_1px_0_0_#1b1b1f33]",
    "hover:shadow-[0_3px_10px_rgb(59,130,246,0.25)]",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-r from-blue-600 to-indigo-600",
          "hover:from-blue-500 hover:to-indigo-500",
          "shadow-blue-500/20",
          "hover:shadow-blue-500/30",
        ],
        secondary: [
          "bg-gradient-to-r from-purple-600 to-pink-600",
          "hover:from-purple-500 hover:to-pink-500",
          "shadow-purple-500/20",
          "hover:shadow-purple-500/30",
        ],
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8 text-base",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(gradientButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
GradientButton.displayName = "GradientButton"

export { GradientButton, gradientButtonVariants }