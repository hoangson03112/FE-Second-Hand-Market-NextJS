"use client";

import { Wallet, Building2 } from "lucide-react";

export type PaymentMethodType = "cod" | "bank_transfer";

interface PaymentMethodProps {
  selected: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
}

export default function PaymentMethod({ selected, onSelect }: PaymentMethodProps) {
  const methods = [
    {
      id: "bank_transfer" as PaymentMethodType,
      name: "Thanh toán trước qua ngân hàng",
      description: "Chuyển khoản trước, xác nhận nhanh",
      icon: Building2,
      badge: "Khuyến nghị",
      color: "primary",
    },
    {
      id: "cod" as PaymentMethodType,
      name: "Thanh toán khi nhận hàng (COD)",
      description: "Thanh toán tiền mặt khi nhận hàng",
      icon: Wallet,
      color: "secondary",
    },
  ];

  return (
    <div className="space-y-3">
      {methods.map((method) => {
        const Icon = method.icon;
        const isSelected = selected === method.id;
        return (
          <label
            key={method.id}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
              isSelected ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-neutral-200/60 hover:border-primary/30 hover:bg-cream-50/50 hover:shadow-md"
            }`}
          >
            <input
              type="radio"
              name="payment"
              checked={isSelected}
              onChange={() => onSelect(method.id)}
              className="sr-only"
            />
            <div className="flex-shrink-0">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected ? "border-primary bg-primary" : "border-neutral-400"
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-cream-100" />}
              </div>
            </div>
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
              isSelected ? "bg-primary/10" : "bg-cream-50"
            }`}>
              <Icon className={`h-5 w-5 ${
                isSelected ? "text-primary" : "text-neutral-600"
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-neutral-900">{method.name}</h4>
                {method.badge && (
                  <span className="px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
                    {method.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-600 mt-0.5">{method.description}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
