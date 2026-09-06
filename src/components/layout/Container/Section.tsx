import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  withBorder?: boolean;
  withBackground?: boolean;
}


export function Section({
  children,
  className,
  withBorder = false,
  withBackground = false,
}: SectionProps) {
  return (
    <section
      className={cn(
        "rounded-[2px]",
        withBackground && "bg-luxury-ivory shadow-sm",
        withBorder && "border border-luxury-ink/10",
        className
      )}
    >
      {children}
    </section>
  );
}
