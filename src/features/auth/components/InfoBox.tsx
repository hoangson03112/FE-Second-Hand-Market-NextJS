import React from "react";

type InfoBoxVariant = "info" | "warning" | "success" | "error";

interface InfoBoxProps {
  variant?: InfoBoxVariant;
  title?: string;
  children: React.ReactNode;
}

const variantStyles: Record<InfoBoxVariant, { bg: string; border: string; text: string; titleColor: string }> = {
  info: {
    bg: "bg-cream-50/70",
    border: "border-luxury-ink/10",
    text: "text-neutral-600",
    titleColor: "text-luxury-ink",
  },
  warning: {
    bg: "bg-amber-50/60",
    border: "border-amber-200/80",
    text: "text-amber-900/90",
    titleColor: "text-amber-950",
  },
  success: {
    bg: "bg-emerald-50/60",
    border: "border-emerald-200/80",
    text: "text-emerald-900/90",
    titleColor: "text-emerald-950",
  },
  error: {
    bg: "bg-blush-50/60",
    border: "border-blush-200/80",
    text: "text-blush-900/90",
    titleColor: "text-blush-950",
  },
};

export default function InfoBox({ variant = "info", title, children }: InfoBoxProps) {
  const styles = variantStyles[variant];

  return (
    <div className={`${styles.bg} border ${styles.border} rounded-[2px] p-4 text-xs`}>
      {title && (
        <p className={`text-2xs font-bold uppercase tracking-[0.14em] ${styles.titleColor} mb-1`}>
          {title}
        </p>
      )}
      <div className={`${styles.text} leading-relaxed font-sans`}>
        {children}
      </div>
    </div>
  );
}
