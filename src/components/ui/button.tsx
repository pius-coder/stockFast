import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary - Main call-to-action (use sparingly - 15% of buttons)
        default:
          "bg-gradient-to-b from-primary/70 to-primary/80 text-primary-foreground border-t border-t-primary border-l border-r border-r-primary border-l-primary border-b-2 border-b-primary ring-1 ring-primary/10 shadow-sm hover:shadow-lg hover:ring-primary/20 hover:border-b-[3px] active:shadow-sm shadow-primary/50 active:border-b-2",

        // Destructive - Critical actions only (use sparingly - 5% of buttons)
        destructive:
          "bg-gradient-to-b from-destructive/70 to-destructive/80 text-destructive-foreground border-t border-t-destructive border-l border-r border-r-destructive border-l-destructive border-b-2 border-b-destructive shadow-destructive ring-1 ring-destructive/10 shadow-sm hover:shadow-lg hover:ring-destructive/20 hover:border-b-[3px] active:shadow-sm active:border-b-2",

        // Secondary - Supporting actions (use sparingly - 15% of buttons)
        secondary:
          "bg-gradient-to-b from-secondary/70 to-secondary/80 text-secondary-foreground border-t border-t-secondary border-l border-r border-r-secondary border-l-secondary border-b-2 shadow-secondary/80 border-b-secondary ring-1 ring-secondary/10 shadow-sm hover:shadow-lg hover:ring-secondary/20 hover:border-b-[3px] active:shadow-sm active:border-b-2",

        // Outline - Neutral backgrounds (dominant - 40% of buttons)
        outline:
          "bg-gradient-to-b from-background to-background/95 text-primary border-t border-t-primary/50 border-l border-r border-r-primary border-l-zinc-400 border-b-2 border-b-zinc-400 ring-1 ring-zinc-400/10 shadow-sm hover:shadow-lg hover:bg-accent/10 hover:text-black/80 hover:border-b-[3px] active:shadow-sm active:border-b-2",

        // Ghost - Most subtle (dominant - 20% of buttons)
        ghost:
          "bg-gradient-to-b from-accent/50 to-accent/60 text-accent-foreground border-t border-t-accent/30 border-l border-r border-r-accent/50 shadow-accent/80 border-l-accent/30 border-b-2 hover:border-b-[3px] border-b-accent ring-1 ring-accent/10 hover:shadow-lg hover:ring-accent/20 transition-all",

        // Link - Text-only (use for navigation - 5% of buttons)
        link: "cursor-pointer text-foreground underline-offset-4 hover:underline hover:text-primary",

        // Google - Special variant
        google:
          "bg-background text-foreground border border-input shadow-sm hover:text-accent relative overflow-hidden after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:content-[''] after:bg-[linear-gradient(to_right,#4285F4_25%,#EA4335_25%_50%,#FBBC05_50%_75%,#34A853_75%)]",

        // Social Interaction Variants
        // Inactive (Neutral Outline based on Outline structure, but with specific hover colors)
        like: "bg-gradient-to-b from-background to-background/95 text-muted-foreground border-t border-t-zinc-300 border-l border-r border-r-zinc-300 border-l-zinc-300 border-b-2 border-b-zinc-300 ring-1 ring-zinc-400/10 shadow-sm hover:shadow-lg hover:bg-like/10 hover:text-like/70 hover:border-like/50 hover:border-b-[3px] active:shadow-sm active:border-b-2",
        comment: "bg-gradient-to-b from-background to-background/95 text-muted-foreground border-t border-t-zinc-300 border-l border-r border-r-zinc-300 border-l-zinc-300 border-b-2 border-b-zinc-300 ring-1 ring-zinc-400/10 shadow-sm hover:shadow-lg hover:bg-comment/10 hover:text-comment/70 hover:border-comment/50 hover:border-b-[3px] active:shadow-sm active:border-b-2",
        reshare: "bg-gradient-to-b from-background to-background/95 text-muted-foreground border-t border-t-zinc-300 border-l border-r border-r-zinc-300 border-l-zinc-300 border-b-2 border-b-zinc-300 ring-1 ring-zinc-400/10 shadow-sm hover:shadow-lg hover:bg-reshare/10 hover:text-reshare/70 hover:border-reshare/50 hover:border-b-[3px] active:shadow-sm active:border-b-2",
        share: "bg-gradient-to-b from-background to-background/95 text-muted-foreground border-t border-t-zinc-300 border-l border-r border-r-zinc-300 border-l-zinc-300 border-b-2 border-b-zinc-300 ring-1 ring-zinc-400/10 shadow-sm hover:shadow-lg hover:bg-share/10 hover:text-share/70 hover:border-share/50 hover:border-b-[3px] active:shadow-sm active:border-b-2",

        // Active (Rich Gradient based on Destructive structure)
        "like-active": "bg-gradient-to-b from-like/70 to-like/80 text-white border-t border-t-like border-l border-r border-r-like border-l-like border-b-2 border-b-like shadow-like ring-1 ring-like/10 shadow-sm hover:shadow-lg hover:ring-like/20 hover:border-b-[3px] active:shadow-sm active:border-b-2",
        "comment-active": "bg-gradient-to-b from-comment/70 to-comment/80 text-white border-t border-t-comment border-l border-r border-r-comment border-l-comment border-b-2 border-b-comment shadow-comment ring-1 ring-comment/10 shadow-sm hover:shadow-lg hover:ring-comment/20 hover:border-b-[3px] active:shadow-sm active:border-b-2",
        "reshare-active": "bg-gradient-to-b from-reshare/70 to-reshare/80 text-white border-t border-t-reshare border-l border-r border-r-reshare border-l-reshare border-b-2 border-b-reshare shadow-reshare ring-1 ring-reshare/10 shadow-sm hover:shadow-lg hover:ring-reshare/20 hover:border-b-[3px] active:shadow-sm active:border-b-2",
        "share-active": "bg-gradient-to-b from-share/70 to-share/80 text-white border-t border-t-share border-l border-r border-r-share border-l-share border-b-2 border-b-share shadow-share ring-1 ring-share/10 shadow-sm hover:shadow-lg hover:ring-share/20 hover:border-b-[3px] active:shadow-sm active:border-b-2",

        // Ecommerce Variants
        "buy": "bg-gradient-to-b from-buy/70 to-buy/80 text-white border-t border-t-buy border-l border-r border-r-buy border-l-buy border-b-2 border-b-buy shadow-buy ring-1 ring-buy/10 shadow-sm hover:shadow-lg hover:ring-buy/20 hover:border-b-[3px] active:shadow-sm active:border-b-2",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
