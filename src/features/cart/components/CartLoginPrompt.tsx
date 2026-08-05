"use client";

import { IconLogin } from "@tabler/icons-react";
import Link from "next/link";

export default function CartLoginPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-white rounded-[2px] border border-luxury-ink/10 max-w-lg mx-auto">
      <div className="w-20 h-20 mb-6 flex items-center justify-center bg-taupe-50/50 rounded-[2px] border border-luxury-ink/10">
        <IconLogin className="w-10 h-10 text-luxury-ink" />
      </div>
      <h3 className="text-2xl text-luxury-ink mb-3" style={{ fontFamily: "var(--font-droid-serif), serif" }}>Đăng nhập để xem giỏ hàng</h3>
      <p className="text-taupe-600 text-sm mb-8 leading-relaxed">Quản lý giỏ hàng và đơn hàng của bạn một cách dễ dàng và tận hưởng trải nghiệm mua sắm đẳng cấp.</p>
      <Link
        href="/login"
        className="inline-flex items-center justify-center h-12 px-10 bg-luxury-ink text-white uppercase tracking-[0.2em] text-[11px] font-semibold rounded-[2px] hover:bg-luxury-ink/90 transition-colors duration-300"
      >
        Đăng Nhập
      </Link>
    </div>
  );
}
