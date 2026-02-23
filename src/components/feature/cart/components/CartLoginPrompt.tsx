"use client";

import Link from "next/link";
import { LogIn } from "lucide-react";

export default function CartLoginPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-lg border border-gray-200 shadow-md max-w-md mx-auto">
      <div className="w-24 h-24 mb-4 flex items-center justify-center">
        <LogIn className="w-16 h-16 text-gray-300" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Đăng nhập để xem giỏ hàng</h3>
      <p className="text-gray-500 text-sm mb-6">Quản lý giỏ hàng và đơn hàng của bạn một cách dễ dàng</p>
      <Link
        href="/login"
        className="inline-flex items-center justify-center h-10 px-8 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
      >
        Đăng Nhập
      </Link>
    </div>
  );
}
