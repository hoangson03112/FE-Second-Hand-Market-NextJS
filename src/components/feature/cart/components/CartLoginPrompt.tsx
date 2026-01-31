"use client";

import Link from "next/link";

export default function CartLoginPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-card rounded-xl border border-border shadow-sm max-w-sm mx-auto">
      <p className="text-foreground font-medium mb-1">Đăng nhập để xem giỏ hàng</p>
      <p className="text-muted-foreground text-sm mb-6">Quản lý sản phẩm và thanh toán dễ dàng hơn</p>
      <Link
        href="/login"
        className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
      >
        Đăng nhập
      </Link>
    </div>
  );
}
