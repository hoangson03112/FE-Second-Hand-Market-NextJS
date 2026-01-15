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
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/30 hover:bg-muted/30"
            }`}
          >
            <input
              type="radio"
              name="payment"
              checked={isSelected}
              onChange={() => onSelect(method.id)}
              className="sr-only"
            />
            
            {/* Radio Button */}
            <div className="flex-shrink-0">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                }`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
            </div>

            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
              isSelected ? "bg-primary/10" : "bg-muted"
            }`}>
              <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-foreground">{method.name}</h4>
                {method.badge && (
                  <span className="px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
                    {method.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{method.description}</p>
            </div>
          </label>
        );
      })}
      </div>


  );
}



