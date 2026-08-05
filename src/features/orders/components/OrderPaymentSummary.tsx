import { IconCreditCard, IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { formatPrice } from "@/utils/format/price";
import type { Order } from "@/types/order";

interface OrderPaymentSummaryProps {
  order: Order;
}

export function OrderPaymentSummary({ order }: OrderPaymentSummaryProps) {
  return (
    <div className="bg-gradient-to-br from-cream-50 to-white border-2 border-border rounded-2xl p-5 shadow-md">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-border">
        <IconCreditCard className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-taupe-900 uppercase tracking-wider">Thanh toán</h3>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-taupe-600">
          <span>Tiền hàng</span>
          <span>{formatPrice(order.productAmount || 0)}</span>
        </div>
        <div className="flex justify-between text-sm text-taupe-600">
          <span>Phí vận chuyển</span>
          <span>{formatPrice(order.shippingFee || 0)}</span>
        </div>
        {(order.insuranceFee ?? 0) > 0 && (
          <div className="flex justify-between text-sm text-taupe-600">
            <span>Phí bảo hiểm</span>
            <span>{formatPrice(order.insuranceFee!)}</span>
          </div>
        )}
        {(order.codFee ?? 0) > 0 && (
          <div className="flex justify-between text-sm text-taupe-600">
            <span>Phí COD</span>
            <span>{formatPrice(order.codFee!)}</span>
          </div>
        )}
        <div className="pt-2 border-t-2 border-border flex justify-between items-center">
          <span className="font-semibold text-taupe-900">Tổng cộng</span>
          <span className="text-lg font-bold text-primary">{formatPrice(order.totalAmount)}</span>
        </div>
        <div className="flex items-center gap-1.5 pt-1">
          {order.statusPayment ? (
            <>
              <IconCircleCheck className="w-4 h-4 text-primary" />
              <span className="text-sm text-taupe-900 font-medium">Đã thanh toán</span>
            </>
          ) : (
            <>
              <IconCircleX className="w-4 h-4 text-taupe-400" />
              <span className="text-sm text-taupe-500 font-medium">Chưa thanh toán</span>
            </>
          )}
          <span className="text-xs text-taupe-500 ml-1">
            ({order.paymentMethod === "cod" ? "COD" : order.paymentMethod === "bank_transfer" ? "Chuyển khoản" : order.paymentMethod})
          </span>
        </div>
      </div>
    </div>
  );
}