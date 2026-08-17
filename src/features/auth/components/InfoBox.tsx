import React from "react";

type InfoBoxVariant = "info" | "warning" | "success" | "error";

interface InfoBoxProps {
  variant?: InfoBoxVariant;
  title?: string;
  children: React.ReactNode;
}

const variantStyles: Record<InfoBoxVariant, { bg: string; border: string; text: string }> = {
  info: {
    bg: "bg-muted/60",
    border: "border-border",
    text: "text-foreground/80",
  },
  warning: {
    bg: "bg-primary/8",
    border: "border-primary/20",
    text: "text-primary/90",
  },
  success: {
    bg: "bg-secondary/60",
    border: "border-border",
    text: "text-foreground/80",
  },
  error: {
    bg: "bg-destructive/8",
    border: "border-destructive/20",
    text: "text-destructive",
  },
};

export default function InfoBox({ variant = "info", title, children }: InfoBoxProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`${styles.bg} border ${styles.border} rounded-xl p-4`}>
      <p className={`text-sm ${styles.text} leading-relaxed`}>
        {title && <strong>{title} </strong>}
        {children}
      </p>
    </div>
  );
}
