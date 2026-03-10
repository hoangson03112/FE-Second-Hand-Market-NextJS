import { IconCreditCard, IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { formatPrice } from "@/utils/format/price";
import type { Order } from "@/types/order";

interface OrderPaymentSummaryProps {
  order: Order;
}

export function OrderPaymentSummary({ order }: OrderPaymentSummaryProps) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <IconCreditCard className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-neutral-900">Thanh toán</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Tiền hàng</span>
          <span>{formatPrice(order.productAmount || 0)}</span>
        </div>
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Phí vận chuyển</span>
          <span>{formatPrice(order.shippingFee || 0)}</span>
        </div>
        {(order.insuranceFee ?? 0) > 0 && (
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Phí bảo hiểm</span>
            <span>{formatPrice(order.insuranceFee!)}</span>
          </div>
        )}
        {(order.codFee ?? 0) > 0 && (
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Phí COD</span>
            <span>{formatPrice(order.codFee!)}</span>
          </div>
        )}
        <div className="pt-2 border-t border-neutral-200 flex justify-between items-center">
          <span className="font-semibold text-neutral-900">Tổng cộng</span>
          <span className="text-lg font-bold text-primary">{formatPrice(order.totalAmount)}</span>
        </div>
        <div className="flex items-center gap-1.5 pt-1">
          {order.statusPayment ? (
            <>
              <IconCircleCheck className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">Đã thanh toán</span>
            </>
          ) : (
            <>
              <IconCircleX className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground font-medium">Chưa thanh toán</span>
            </>
          )}
          <span className="text-xs text-neutral-500 ml-1">
            ({order.paymentMethod === "cod" ? "COD" : order.paymentMethod === "bank_transfer" ? "Chuyển khoản" : order.paymentMethod})
          </span>
        </div>
      </div>
    </div>
  );
}

