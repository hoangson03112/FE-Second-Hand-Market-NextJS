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
        className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Trở lại
      </button>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <ShoppingBag className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-medium text-gray-900">Xác Nhận Đơn Hàng</h1>
          <p className="text-sm text-gray-600">Kiểm tra thông tin trước khi thanh toán</p>
        </div>
      </div>
    </>
  );
}
