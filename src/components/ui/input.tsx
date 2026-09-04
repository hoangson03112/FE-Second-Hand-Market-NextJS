import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-[2px] border border-luxury-ink/20 bg-transparent px-3.5 py-1.5 text-sm text-luxury-ink shadow-xs transition-all outline-none selection:bg-luxury-ink selection:text-luxury-ivory file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-neutral-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-luxury-ink focus-visible:ring-1 focus-visible:ring-luxury-ink",
        "aria-invalid:border-blush-600 aria-invalid:ring-blush-300",
        className
      )}
      {...props}
    />
  )
}

export { Input }
