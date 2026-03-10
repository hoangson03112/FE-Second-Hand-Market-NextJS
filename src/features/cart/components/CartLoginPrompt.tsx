"use client";

import { IconLogin } from "@tabler/icons-react";
import Link from "next/link";

export default function CartLoginPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gradient-to-br from-white to-cream-50 rounded-2xl border-2 border-border shadow-xl max-w-md mx-auto">
      <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gradient-to-br from-taupe-50 to-taupe-100 rounded-full">
        <IconLogin className="w-16 h-16 text-taupe-400" />
      </div>
      <h3 className="text-lg font-semibold text-taupe-900 mb-2">Đăng nhập để xem giỏ hàng</h3>
      <p className="text-taupe-600 text-sm mb-6">Quản lý giỏ hàng và đơn hàng của bạn một cách dễ dàng</p>
      <Link
        href="/login"
        className="inline-flex items-center justify-center h-11 px-8 bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
      >
        Đăng Nhập
      </Link>
    </div>
  );
}
