"use client";

import { useState } from "react";
import { Wallet, CreditCard, Building2, Check } from "lucide-react";

export type PaymentMethodType = "cod" | "bank_transfer" | "momo" | "vnpay";

interface PaymentMethodProps {
  selected: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
}

export default function PaymentMethod({ selected, onSelect }: PaymentMethodProps) {
  const methods = [
    {
      id: "cod" as PaymentMethodType,
      name: "Thanh toán khi nhận hàng (COD)",
      description: "Thanh toán tiền mặt khi nhận hàng",
      icon: Wallet,
    },
    {
      id: "bank_transfer" as PaymentMethodType,
      name: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản trực tiếp qua ngân hàng",
      icon: Building2,
    },
    {
      id: "momo" as PaymentMethodType,
      name: "Ví MoMo",
      description: "Thanh toán qua ví điện tử MoMo",
      icon: Wallet,
      badge: "Khuyến nghị",
    },
    {
      id: "vnpay" as PaymentMethodType,
      name: "VNPay",
      description: "Thanh toán qua cổng VNPay",
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-foreground mb-4">Phương Thức Thanh Toán</h3>

      <div className="space-y-3">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selected === method.id;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onSelect(method.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-background hover:border-primary/50"
              }`}
            >
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  isSelected ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
              </div>

              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-foreground">{method.name}</h4>
                  {method.badge && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {method.badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{method.description}</p>
              </div>

              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? "border-primary bg-primary" : "border-border"
                }`}
              >
                {isSelected && <Check className="h-4 w-4 text-white" />}
              </div>
            </button>
          );
        })}
      </div>

      {selected === "bank_transfer" && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Thông tin chuyển khoản</h4>
          <div className="space-y-1 text-sm text-blue-800">
            <p>
              <strong>Ngân hàng:</strong> Vietcombank
            </p>
            <p>
              <strong>Số tài khoản:</strong> 1234567890
            </p>
            <p>
              <strong>Chủ tài khoản:</strong> CÔNG TY ECO
            </p>
            <p>
              <strong>Nội dung:</strong> ECO [Mã đơn hàng]
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


