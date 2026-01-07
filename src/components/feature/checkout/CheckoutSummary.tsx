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
    <div className="bg-muted/50 rounded-xl p-6 space-y-4">
      <h3 className="text-lg font-bold text-foreground">Tóm Tắt Đơn Hàng</h3>

      <div className="space-y-3 pt-3 border-t border-border">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tạm tính</span>
          <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Phí vận chuyển</span>
          <span className="font-medium text-foreground">
            {shipping === 0 ? "Miễn phí" : formatPrice(shipping)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Giảm giá</span>
            <span className="font-medium text-green-600">-{formatPrice(discount)}</span>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-border">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-foreground">Tổng cộng</span>
          <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
        </div>
      </div>

      <div className="pt-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>Thanh toán an toàn & bảo mật</span>
        </div>
      </div>
    </div>
  );
}


