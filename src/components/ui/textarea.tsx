import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-[2px] border border-luxury-ink/20 bg-transparent px-3.5 py-2 text-sm text-luxury-ink shadow-xs transition-all outline-none placeholder:text-neutral-400 focus-visible:border-luxury-ink focus-visible:ring-1 focus-visible:ring-luxury-ink disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-blush-600 aria-invalid:ring-blush-300",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
