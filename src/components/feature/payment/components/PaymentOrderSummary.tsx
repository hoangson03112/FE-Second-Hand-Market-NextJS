import { formatPrice } from "@/utils/format/price";

export interface PaymentOrderSummaryProps {
  totalAmount: number;
}

export function PaymentOrderSummary({ totalAmount }: PaymentOrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg border border-border p-6">
      <h2 className="font-semibold text-foreground mb-4">
        Thông tin đơn hàng
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tổng tiền hàng:</span>
          <span className="font-medium">{formatPrice(totalAmount)}</span>
        </div>
        <div className="flex justify-between pt-3 border-t">
          <span className="text-lg font-semibold">Tổng thanh toán:</span>
          <span className="text-xl font-bold text-primary">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
