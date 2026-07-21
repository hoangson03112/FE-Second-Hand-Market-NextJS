"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CopyButtonProps {
  /** Text to copy to the clipboard. */
  value: string;
  label?: React.ReactNode;
  size?: React.ComponentProps<typeof Button>["size"];
  variant?: React.ComponentProps<typeof Button>["variant"];
  /** How long (ms) to show the "copied" state. */
  timeout?: number;
  className?: string;
}

/**
 * CopyButton — copies `value` to the clipboard and briefly shows a check icon.
 * Wraps shadcn `Button`.
 */
export function CopyButton({
  value,
  label,
  size,
  variant = "ghost",
  timeout = 1500,
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — silently ignore.
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size ?? (label ? "sm" : "icon")}
      onClick={copy}
      aria-label="Sao chép"
      className={className}
    >
      {copied ? (
        <Check className={cn("size-4 text-emerald-500")} />
      ) : (
        <Copy className="size-4" />
      )}
      {label}
    </Button>
  );
}
