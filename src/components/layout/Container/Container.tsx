import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
type Padding = "none" | "sm" | "md" | "lg";

interface ContainerProps {
  children: ReactNode;
  maxWidth?: MaxWidth;
  paddingX?: Padding;
  paddingY?: Padding;
  className?: string;
  as?: "div" | "main" | "section" | "article" | "aside";
}

const maxWidthClasses: Record<MaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
};

const paddingXClasses: Record<Padding, string> = {
  none: "",
  sm: "px-2 sm:px-3",
  md: "px-4 sm:px-6",
  lg: "px-6 sm:px-8 lg:px-10",
};

const paddingYClasses: Record<Padding, string> = {
  none: "",
  sm: "py-2 sm:py-3",
  md: "py-4 sm:py-6",
  lg: "py-6 sm:py-8",
};

/**
 * Container component with configurable max-width and padding
 * Provides consistent spacing and centering across the app
 * 
 * @example
 * <Container maxWidth="7xl" paddingX="md" paddingY="lg">
 *   <YourContent />
 * </Container>
 */
export function Container({
  children,
  maxWidth = "7xl",
  paddingX = "md",
  paddingY = "lg",
  className,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full",
        maxWidthClasses[maxWidth],
        paddingXClasses[paddingX],
        paddingYClasses[paddingY],
        className
      )}
    >
      {children}
    </Component>
  );
}
