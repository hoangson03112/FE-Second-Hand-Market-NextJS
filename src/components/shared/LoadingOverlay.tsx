import * as React from "react";

import { Loading } from "./Loading";
import { cn } from "@/lib/utils";

export interface LoadingOverlayProps {
  show?: boolean;
  label?: React.ReactNode;
  className?: string;
  /** Use `fixed` positioning (full viewport) instead of `absolute`. */
  fixed?: boolean;
  blur?: boolean;
}

/**
 * LoadingOverlay — a translucent overlay with a spinner. Place inside a
 * `relative` container (default) or use `fixed` to cover the viewport.
 */
export function LoadingOverlay({
  show = true,
  label,
  className,
  fixed,
  blur = true,
}: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "inset-0 z-50 flex items-center justify-center bg-background/60",
        fixed ? "fixed" : "absolute",
        blur && "backdrop-blur-sm",
        className
      )}
    >
      <Loading label={label} />
    </div>
  );
}
