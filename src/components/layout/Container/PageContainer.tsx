import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  withBackground?: boolean;
  fullHeight?: boolean;
}

/**
 * Page-level container wrapper
 * Provides consistent page background and min-height
 * 
 * @example
 * <PageContainer>
 *   <YourPageContent />
 * </PageContainer>
 */
export function PageContainer({
  children,
  className,
  withBackground = true,
  fullHeight = true,
}: PageContainerProps) {
  return (
    <div
      className={cn(
        fullHeight && "min-h-screen",
        withBackground && "bg-muted/30",
        className
      )}
    >
      {children}
    </div>
  );
}
