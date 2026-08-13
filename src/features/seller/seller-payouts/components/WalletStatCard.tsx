import type { ComponentType } from "react";
import { formatPrice } from "@/utils/format/price";

export type WalletStatTone = "primary" | "success" | "warning" | "neutral";

const TONE_CLASSES: Record<WalletStatTone, { card: string; icon: string }> = {
  primary: { card: "bg-primary/5 border-primary/20", icon: "text-primary" },
  success: { card: "bg-emerald-50 border-emerald-200", icon: "text-emerald-600" },
  warning: { card: "bg-amber-50 border-amber-200", icon: "text-amber-600" },
  neutral: { card: "bg-taupe-50/60 border-border", icon: "text-taupe-500" },
};

interface WalletStatCardProps {
  icon: ComponentType<{ className?: string }>;
  amount: number;
  label: string;
  tone: WalletStatTone;
}

export function WalletStatCard({ icon: Icon, amount, label, tone }: WalletStatCardProps) {
  const cls = TONE_CLASSES[tone];
  return (
    <div className={`rounded-2xl border-2 p-4 ${cls.card}`}>
      <Icon className={`w-5 h-5 mb-2 ${cls.icon}`} />
      <div className="font-bold text-taupe-900 tabular-nums">{formatPrice(amount)}</div>
      <div className="text-xs text-taupe-500 mt-0.5">{label}</div>
    </div>
  );
}