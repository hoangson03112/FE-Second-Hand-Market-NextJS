import { cn } from "@/lib/utils";


type PaymentStatus = "pending" | "paid" | "refunded" | (string & {});

const CHIP_CLASS: Record<string, string> = {
  paid: "border-accent/35 bg-taupe-50 text-taupe-700",
  refunded: "border-luxury-ink/20 bg-white text-luxury-ink",
  pending: "border-luxury-champagne/50 bg-cream-100 text-neutral-700",
};

const DOT_CLASS: Record<string, string> = {
  paid: "bg-accent",
  refunded: "bg-luxury-ink",
  pending: "bg-luxury-champagne",
};

const FULL_LABEL: Record<string, string> = {
  paid: "Đã thanh toán",
  refunded: "Đã hoàn tiền",
  pending: "Chưa thanh toán",
};


const SHORT_LABEL: Record<string, string> = {
  paid: "Đã TT",
  refunded: "Đã hoàn",
  pending: "Chưa TT",
};

interface PaymentChipProps {
  status?: PaymentStatus;

  variant?: "short" | "full";

  tone?: "light" | "dark";
  className?: string;
}

export default function PaymentChip({
  status,
  variant = "short",
  tone = "light",
  className,
}: PaymentChipProps) {
  const key = status && status in FULL_LABEL ? status : "pending";
  const label =
    variant === "short" ? SHORT_LABEL[key] : FULL_LABEL[key];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-2 rounded-[2px] border px-2.5 py-1 text-2xs font-bold uppercase tracking-[0.18em]",
        tone === "dark"
          ? "border-white/20 bg-white/5 text-cream-50"
          : CHIP_CLASS[key],
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1 w-1 shrink-0 rounded-full",
          tone === "dark"
            ? key === "paid"
              ? "bg-accent"
              : "bg-luxury-champagne"
            : DOT_CLASS[key],
        )}
      />
      {label}
    </span>
  );
}
