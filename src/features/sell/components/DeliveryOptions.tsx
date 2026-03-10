"use client";

import { IconTruck } from "@tabler/icons-react";
import type { DeliveryOptions } from "@/types/sell";
import { SectionCard } from "./SectionCard";

interface DeliveryOptionsProps {
  value: DeliveryOptions;
  onChange: (value: DeliveryOptions) => void;
  error?: string;
}

const OPTIONS = [
  {
    key: "localPickup" as const,
    label: "Tự lấy hàng",
    description: "Người mua đến địa chỉ bạn để lấy hàng trực tiếp",
  },
  {
    key: "codShipping" as const,
    label: "Giao hàng COD",
    description: "Giao hàng tận nơi, thu tiền khi nhận hàng",
  },
] as const;

export function DeliveryOptions({ value, onChange, error }: DeliveryOptionsProps) {
  const toggle = (key: keyof DeliveryOptions) => {
    onChange({ ...value, [key]: !value[key] });
  };

  return (
    <SectionCard icon={IconTruck} title="Hình thức giao hàng">
      <div className="space-y-2">
        {OPTIONS.map(({ key, label, description }) => {
          const checked = value[key];
          return (
            <label
              key={key}
              className={`flex items-start gap-3 rounded-lg border-2 p-3 cursor-pointer transition-all ${
                checked
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-muted-foreground/30"
              }`}
            >
              <div
                className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center border-2 transition-colors ${
                  checked ? "bg-primary border-primary" : "border-border"
                }`}
              >
                {checked && (
                  <svg
                    viewBox="0 0 10 8"
                    className="w-2.5 h-2 fill-none stroke-white stroke-2"
                  >
                    <polyline points="1,4 4,7 9,1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => toggle(key)}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">{label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
              </div>
            </label>
          );
        })}
      </div>

      {error && (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      )}
    </SectionCard>
  );
}
