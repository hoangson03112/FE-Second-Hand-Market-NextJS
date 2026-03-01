import React from "react";

type InfoBoxVariant = "info" | "warning" | "success" | "error";

interface InfoBoxProps {
  variant?: InfoBoxVariant;
  title?: string;
  children: React.ReactNode;
}

const variantStyles: Record<InfoBoxVariant, { bg: string; border: string; text: string }> = {
  info: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
  },
  warning: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-800",
  },
  success: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
  },
  error: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
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
