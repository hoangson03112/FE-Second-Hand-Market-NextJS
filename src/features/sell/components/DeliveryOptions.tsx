"use client";

import { IconTruck, IconMapPin } from "@tabler/icons-react";
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
    icon: IconMapPin,
    label: "Gặp mặt trực tiếp",
    description: "Người mua đến tận nơi lấy hàng. Thanh toán khi gặp mặt.",
  },
  {
    key: "codShipping" as const,
    icon: IconTruck,
    label: "Giao hàng COD",
    description: "Giao tận nhà qua đơn vị vận chuyển, thu tiền khi nhận.",
  },
] as const;

export function DeliveryOptions({
  value,
  onChange,
  error,
}: DeliveryOptionsProps) {
  const toggle = (key: keyof DeliveryOptions) => {
    onChange({ ...value, [key]: !value[key] });
  };

  return (
    <SectionCard icon={IconTruck} title="Hình thức giao hàng">
      <div className="flex flex-col gap-2">
        {OPTIONS.map(({ key, icon: Icon, label, description }) => {
          const checked = value[key];
          return (
            <label
              key={key}
              className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 cursor-pointer select-none hover:bg-muted/40 transition-colors"
            >
              <input
                type="checkbox"
                className="w-4 h-4 accent-primary cursor-pointer"
                checked={checked}
                onChange={() => toggle(key)}
              />
              <Icon className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={1.8} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </label>
          );
        })}
      </div>

      {!value.localPickup && !value.codShipping && (
        <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
          Vui lòng chọn ít nhất một hình thức giao hàng.
        </p>
      )}

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </SectionCard>
  );
}
