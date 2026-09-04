import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-[2px] text-xs font-bold uppercase tracking-[0.1em] whitespace-nowrap transition-all outline-none focus-visible:ring-1 focus-visible:ring-luxury-ink disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-luxury-ink text-luxury-ivory hover:bg-charcoal-800 shadow-xs",
        destructive:
          "bg-blush-600 text-white hover:bg-blush-700 focus-visible:ring-blush-300",
        outline:
          "border border-luxury-ink/20 bg-transparent text-luxury-ink shadow-xs hover:bg-taupe-50 hover:border-luxury-ink",
        secondary:
          "bg-cream-100 text-luxury-ink hover:bg-cream-200 border border-luxury-ink/10",
        ghost: "hover:bg-taupe-50 hover:text-luxury-ink",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-[2px] px-2 text-[10px] tracking-wider has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-[2px] px-3 text-2xs tracking-wider has-[>svg]:px-2.5",
        lg: "h-11 rounded-[2px] px-6 text-xs tracking-[0.12em] has-[>svg]:px-4",
        icon: "size-9 rounded-[2px]",
        "icon-xs": "size-6 rounded-[2px] [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-[2px]",
        "icon-lg": "size-10 rounded-[2px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
