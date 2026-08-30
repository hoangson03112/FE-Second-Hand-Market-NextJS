import type { ComponentType } from "react";
import { formatPrice } from "@/utils/format/price";

export type WalletStatTone = "primary" | "success" | "warning" | "neutral";

const TONE_CLASSES: Record<WalletStatTone, { card: string; icon: string }> = {
  primary: { card: "bg-white/80 border-taupe-200/80", icon: "text-luxury-ink" },
  success: { card: "bg-[#f7f2eb] border-[#eadcc6]", icon: "text-charcoal-700" },
  warning: { card: "bg-[#f8f3ee] border-taupe-200/80", icon: "text-charcoal-600" },
  neutral: { card: "bg-white/80 border-taupe-200/80", icon: "text-charcoal-500" },
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
    <div className={`rounded-[26px] border p-5 shadow-[0_12px_30px_rgba(28,27,24,0.03)] ${cls.card}`}>
      <div className="flex items-center justify-between gap-3">
        <Icon className={`h-5 w-5 ${cls.icon}`} />
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-charcoal-400">
          {label}
        </span>
      </div>
      <div className="mt-6 text-2xl font-medium text-luxury-ink tabular-nums">
        {formatPrice(amount)}
      </div>
    </div>
  );
}