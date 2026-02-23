"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-lg border border-gray-200 shadow-md max-w-md mx-auto">
      <div className="w-24 h-24 mb-4 flex items-center justify-center">
        <ShoppingBag className="w-16 h-16 text-gray-300" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Giỏ hàng của bạn còn trống</h3>
      <p className="text-gray-500 text-sm mb-6">Hãy mua sắm ngay để không bỏ lỡ các ưu đãi hấp dẫn!</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center h-10 px-8 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
      >
        Mua Sắm Ngay
      </Link>
    </div>
  );
}
