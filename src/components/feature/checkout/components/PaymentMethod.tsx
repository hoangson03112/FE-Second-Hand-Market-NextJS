"use client";


import { IconWallet, IconBuilding } from "@tabler/icons-react";
export type PaymentMethodType = "cod" | "bank_transfer";

interface PaymentMethodProps {
  selected: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
  showBankTransfer?: boolean;
}

export default function PaymentMethod({ selected, onSelect, showBankTransfer = false }: PaymentMethodProps) {
  const allMethods = [
    {
      id: "bank_transfer" as PaymentMethodType,
      name: "Thanh toán trước qua ngân hàng",
      description: "Chuyển khoản trước, xác nhận nhanh",
      icon: IconBuilding,
      badge: "Khuyến nghị",
      color: "primary",
    },
    {
      id: "cod" as PaymentMethodType,
      name: "Thanh toán khi nhận hàng (COD)",
      description: "Thanh toán tiền mặt khi nhận hàng",
      icon: IconWallet,
      color: "secondary",
    },
  ];

  const methods = allMethods.filter(
    (m) => m.id !== "bank_transfer" || showBankTransfer
  );

  return (
    <div className="space-y-2.5">
      {methods.map((method) => {
        const Icon = method.icon;
        const isSelected = selected === method.id;
        return (
          <label
            key={method.id}
            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
              isSelected ? "border-primary bg-primary/5" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition ${
                  isSelected ? "border-primary bg-primary" : "border-gray-400"
                }`}
              >
                {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
              isSelected ? "bg-primary/10" : "bg-gray-100"
            }`}>
              <Icon className={`h-4 w-4 ${
                isSelected ? "text-primary" : "text-gray-600"
              }`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-900">{method.name}</h4>
                {method.badge && (
                  <span className="px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-md">
                    {method.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 mt-0.5">{method.description}</p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
