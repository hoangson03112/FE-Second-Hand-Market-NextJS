import { cn } from "@/lib/utils";

interface InkSurfaceProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * The dark ink ground used for the one figure on a screen that should carry
 * weight — the checkout total, the order total. Champagne/accent glow plus the
 * fractal-noise grain lifted from the homepage CTA panel, so the transactional
 * screens read as the same publication.
 */
export function InkSurface({ children, className }: InkSurfaceProps) {
  return (
    <div className={cn("relative overflow-hidden bg-luxury-ink", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 85% 15%, color-mix(in srgb, var(--accent) 22%, transparent) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 10% 90%, color-mix(in srgb, var(--luxury-champagne) 16%, transparent) 0%, transparent 55%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default InkSurface;
