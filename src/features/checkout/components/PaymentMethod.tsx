"use client";

import { IconWallet, IconBuilding } from "@tabler/icons-react";
export type PaymentMethodType = "cod" | "bank_transfer";

interface PaymentMethodProps {
  selected: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
  showBankTransfer?: boolean;
  /** Unique name for the radio group — use sellerId to avoid cross-seller collisions */
  radioName?: string;
}

export default function PaymentMethod({ selected, onSelect, showBankTransfer = false, radioName = "payment" }: PaymentMethodProps) {
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
    (m) => m.id !== "bank_transfer" || showBankTransfer
  );

  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const Icon = method.icon;
        const isSelected = selected === method.id;
        return (
          <label
            key={method.id}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-taupe-50/60 bg-white"
            }`}
          >
            <input
              type="radio"
              name={radioName}
              checked={isSelected}
              onChange={() => onSelect(method.id)}
              className="sr-only"
            />
            <div className="flex-shrink-0">
              <div
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "border-primary bg-primary" : "border-taupe-300"
                }`}
              >
                {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
            </div>
            <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border-2 bg-white ${
              isSelected ? "border-primary" : "border-border"
            }`}>
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h4 className="text-sm font-semibold text-taupe-900">{method.name}</h4>
                {method.badge && (
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-wide font-semibold rounded-full">
                    {method.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-taupe-500 mt-1">{method.description}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
}