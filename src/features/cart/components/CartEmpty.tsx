"use client";

import { IconShoppingBag } from "@tabler/icons-react";
import Link from "next/link";

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gradient-to-br from-white to-cream-50 rounded-2xl border-2 border-border shadow-xl max-w-md mx-auto">
      <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gradient-to-br from-taupe-50 to-taupe-100 rounded-full">
        <IconShoppingBag className="w-16 h-16 text-taupe-400" />
      </div>
      <h3 className="text-lg font-semibold text-taupe-900 mb-2">Giỏ hàng của bạn còn trống</h3>
      <p className="text-taupe-600 text-sm mb-6">Hãy mua sắm ngay để không bỏ lỡ các ưu đãi hấp dẫn!</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center h-11 px-8 bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300"
      >
        Mua Sắm Ngay
      </Link>
    </div>
  );
}
