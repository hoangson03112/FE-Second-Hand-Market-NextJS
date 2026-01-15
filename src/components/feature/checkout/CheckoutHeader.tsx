"use client";

import { ArrowLeft, ShoppingBag } from "lucide-react";

interface CheckoutHeaderProps {
  onBack: () => void;
}

export default function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
  return (
    <>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </button>

      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <ShoppingBag className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Xác Nhận Đơn Hàng</h1>
          <p className="text-muted-foreground">Kiểm tra thông tin trước khi thanh toán</p>
        </div>
      </div>
    </>
  );
}
