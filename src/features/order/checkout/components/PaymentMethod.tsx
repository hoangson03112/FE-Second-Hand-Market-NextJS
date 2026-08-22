"use client";

import { IconWallet, IconBuilding } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export type PaymentMethodType = "cod" | "bank_transfer";

interface PaymentMethodProps {
  selected: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
  showBankTransfer?: boolean;
  /** Unique name for the radio group — use sellerId to avoid cross-seller collisions */
  radioName?: string;
}

export default function PaymentMethod({
  selected,
  onSelect,
  showBankTransfer = false,
  radioName = "payment",
}: PaymentMethodProps) {
  const allMethods = [
    {
      id: "bank_transfer" as PaymentMethodType,
      name: "Thanh toán qua ngân hàng",
      description: "Chuyển khoản trước, xác nhận nhanh",
      icon: IconBuilding,
      badge: "Khuyến nghị",
    },
    {
      id: "cod" as PaymentMethodType,
      name: "Thanh toán khi nhận hàng (COD)",
      description: "Thanh toán tiền mặt khi nhận hàng",
      icon: IconWallet,
    },
  ];

  const methods = allMethods.filter(
    (m) => m.id !== "bank_transfer" || showBankTransfer,
  );

  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const Icon = method.icon;
        const isSelected = selected === method.id;
        return (
          <label
            key={method.id}
            className={cn(
              "flex cursor-pointer items-center gap-4 rounded-[2px] border px-4 py-4 transition-all duration-300",
              isSelected
                ? "border-luxury-ink bg-cream-50"
                : "border-luxury-ink/15 bg-white hover:border-luxury-ink/40",
            )}
          >
            <input
              type="radio"
              name={radioName}
              checked={isSelected}
              onChange={() => onSelect(method.id)}
              className="sr-only"
            />

            <span
              aria-hidden
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
                isSelected
                  ? "border-luxury-ink bg-luxury-ink"
                  : "border-luxury-ink/30",
              )}
            >
              {isSelected ? (
                <span className="h-1.5 w-1.5 rounded-full bg-luxury-ivory" />
              ) : null}
            </span>

            <span
              aria-hidden
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] border transition-colors duration-300",
                isSelected
                  ? "border-luxury-ink/20 bg-white"
                  : "border-luxury-ink/10 bg-cream-50",
              )}
            >
              <Icon className="h-4 w-4 text-luxury-ink" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-medium text-luxury-ink">
                  {method.name}
                </span>
                {method.badge ? (
                  <span className="rounded-[2px] border border-luxury-champagne/50 bg-cream-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-700">
                    {method.badge}
                  </span>
                ) : null}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-neutral-500">
                {method.description}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
