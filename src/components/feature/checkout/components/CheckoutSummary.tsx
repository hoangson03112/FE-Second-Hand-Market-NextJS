"use client";

import { formatPrice } from "@/utils/format/price";

interface CheckoutSummaryProps {
  subtotal: number;
  shipping: number;
  discount?: number;
}

export default function CheckoutSummary({
  subtotal,
  shipping,
  discount = 0,
}: CheckoutSummaryProps) {
  const total = subtotal + shipping - discount;

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
        <span className="w-1 h-6 bg-primary rounded-full" />
        Tổng Đơn Hàng
      </h3>
      <div className="space-y-3 py-4 border-t border-b border-border">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Sản phẩm</span>
          <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span className="font-semibold text-foreground">
            {shipping === 0 ? "Miễn phí" : formatPrice(shipping)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Giảm giá</span>
            <span className="font-semibold text-green-600">-{formatPrice(discount)}</span>
          </div>
        )}
      </div>
      <div className="py-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-foreground">Tổng cộng</span>
          <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
