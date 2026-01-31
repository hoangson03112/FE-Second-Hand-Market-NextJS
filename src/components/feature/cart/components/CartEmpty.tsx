"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

export default function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-card rounded-xl border border-border shadow-sm max-w-sm mx-auto">
      <div className="w-16 h-16 mb-5 rounded-full bg-muted flex items-center justify-center">
        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">Giỏ hàng trống</h3>
      <p className="text-muted-foreground text-sm mb-6">Thêm sản phẩm yêu thích vào giỏ nhé</p>
      <Link
        href="/"
        className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-sm"
      >
        Mua sắm ngay
      </Link>
    </div>
  );
}
