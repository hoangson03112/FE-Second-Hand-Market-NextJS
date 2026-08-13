import { formatPrice } from "@/utils/format/price";

export interface PaymentOrderSummaryProps {
  totalAmount: number;
}

export function PaymentOrderSummary({ totalAmount }: PaymentOrderSummaryProps) {
  return (
    <div className="bg-gradient-to-br from-cream-50 to-white rounded-2xl border-2 border-border p-6 shadow-md">
      <h2 className="font-semibold text-taupe-900 mb-4 uppercase tracking-wide text-sm">
        Thông tin đơn hàng
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-taupe-500">Tổng tiền hàng:</span>
          <span className="font-medium text-taupe-900">{formatPrice(totalAmount)}</span>
        </div>
        <div className="flex justify-between pt-3 border-t-2 border-border">
          <span className="text-base font-semibold text-taupe-900">Tổng thanh toán:</span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}