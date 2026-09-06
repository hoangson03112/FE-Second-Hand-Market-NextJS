import { cn } from "@/lib/utils";

interface InkSurfaceProps {
  children: React.ReactNode;
  className?: string;
}


export function InkSurface({ children, className }: InkSurfaceProps) {
  return (
    <div className={cn("relative overflow-hidden bg-luxury-ink", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_80%_60%_at_85%_15%,color-mix(in_srgb,var(--accent)_22%,transparent)_0%,transparent_60%),radial-gradient(ellipse_60%_50%_at_10%_90%,color-mix(in_srgb,var(--luxury-champagne)_16%,transparent)_0%,transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-noise-texture"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default InkSurface;
