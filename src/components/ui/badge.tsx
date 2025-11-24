import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-b from-primary/70 to-primary/80 text-primary-foreground shadow-sm hover:shadow-md",
        secondary:
          "border-transparent bg-gradient-to-b from-secondary/70 to-secondary/80 text-secondary-foreground shadow-sm hover:shadow-md",
        destructive:
          "border-transparent bg-gradient-to-b from-destructive/70 to-destructive/80 text-destructive-foreground shadow-sm hover:shadow-md",
        outline: "text-foreground border-t border-t-input/50 border-l border-l-input border-r border-r-input border-b border-b-input/50 hover:bg-accent/10",
        success:
          "border-transparent bg-gradient-to-b from-green-500/70 to-green-600/80 text-white shadow-sm hover:shadow-md",
        warning:
          "border-transparent bg-gradient-to-b from-yellow-500/70 to-yellow-600/80 text-white shadow-sm hover:shadow-md",
        info:
          "border-transparent bg-gradient-to-b from-blue-500/70 to-blue-600/80 text-white shadow-sm hover:shadow-md",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
