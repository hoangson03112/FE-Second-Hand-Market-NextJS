"use client";

import { IconTruck, IconMapPin, IconCheck } from "@tabler/icons-react";
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
              className={`relative flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer select-none transition-all duration-200 ${
                checked
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-taupe-50/60"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={checked}
                onChange={() => toggle(key)}
              />
              <div
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                  checked ? "border-primary bg-primary" : "border-taupe-300 bg-white"
                }`}
              >
                {checked && <IconCheck className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
              </div>
              <Icon className={`w-4 h-4 shrink-0 ${checked ? "text-primary" : "text-taupe-400"}`} strokeWidth={1.8} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-taupe-900">{label}</p>
                <p className="text-xs text-taupe-500">{description}</p>
              </div>
            </label>
          );
        })}
      </div>

      {!value.localPickup && !value.codShipping && (
        <p className="text-xs text-amber-600 mt-2">
          Vui lòng chọn ít nhất một hình thức giao hàng.
        </p>
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </SectionCard>
  );
}