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
    <div className="p-5 space-y-3">
      <h3 className="text-lg font-medium text-gray-900 pb-3 border-b border-gray-200">
        Tổng Đơn Hàng
      </h3>
      <div className="space-y-2.5 py-3 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Sản phẩm</span>
          <span className="text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="text-gray-900">
            {shipping === 0 ? "Miễn phí" : formatPrice(shipping)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Giảm giá</span>
            <span className="text-green-600">-{formatPrice(discount)}</span>
          </div>
        )}
      </div>
      <div className="pt-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-900">Tổng cộng</span>
          <span className="text-xl font-medium text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
