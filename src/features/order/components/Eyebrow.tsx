import { cn } from "@/lib/utils";

interface EyebrowProps {
  children: React.ReactNode;

  tone?: "light" | "dark";
  className?: string;
}


export function Eyebrow({ children, tone = "light", className }: EyebrowProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        aria-hidden
        className={cn(
          "h-px w-8 shrink-0",
          tone === "dark" ? "bg-luxury-champagne" : "bg-luxury-champagne/80",
        )}
      />
      <p
        className={cn(
          "text-2xs font-medium uppercase tracking-[0.15em]",
          tone === "dark" ? "text-luxury-champagne" : "text-neutral-600",
        )}
      >
        {children}
      </p>
    </div>
  );
}

export default Eyebrow;
