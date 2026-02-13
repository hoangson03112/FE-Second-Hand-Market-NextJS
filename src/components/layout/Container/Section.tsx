import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  withBorder?: boolean;
  withBackground?: boolean;
}

/**
 * Section wrapper component
 * Provides consistent card-like sections with optional border and background
 * 
 * @example
 * <Section withBorder withBackground>
 *   <YourSectionContent />
 * </Section>
 */
export function Section({
  children,
  className,
  withBorder = false,
  withBackground = false,
}: SectionProps) {
  return (
    <section
      className={cn(
        "rounded-lg",
        withBackground && "bg-card shadow-sm",
        withBorder && "border border-border",
        className
      )}
    >
      {children}
    </section>
  );
}
