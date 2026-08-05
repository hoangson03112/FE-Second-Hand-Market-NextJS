"use client";


import { IconArrowLeft, IconShoppingBag } from "@tabler/icons-react";
interface CheckoutHeaderProps {
  onBack: () => void;
}

export default function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
  return (
    <>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-taupe-600 hover:text-luxury-ink mb-8 text-[11px] uppercase tracking-[0.2em] font-semibold transition-colors"
      >
        <IconArrowLeft className="h-4 w-4" />
        Trở lại
      </button>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-[2px] bg-taupe-50/50 border border-luxury-ink/10 flex items-center justify-center">
          <IconShoppingBag className="h-5 w-5 text-luxury-ink" />
        </div>
        <div>
          <h1 className="text-3xl text-luxury-ink mb-1" style={{ fontFamily: "var(--font-droid-serif), serif" }}>Xác Nhận Đơn Hàng</h1>
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-taupe-500 mt-2">Kiểm tra thông tin trước khi thanh toán</p>
        </div>
      </div>
    </>
  );
}
