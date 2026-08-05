import { formatPrice } from "@/utils/format/price";

interface OrderPriceSummaryProps {
  productAmount: number;
  shippingFee: number;
  insuranceFee?: number;
  codFee?: number;
  totalAmount: number;
  isLocalPickup: boolean;
}

export function OrderPriceSummary({
  productAmount,
  shippingFee,
  insuranceFee = 0,
  codFee = 0,
  totalAmount,
  isLocalPickup,
}: OrderPriceSummaryProps) {
  return (
    <div className="bg-gradient-to-br from-cream-50 to-white border-2 border-border rounded-2xl overflow-hidden shadow-md">
      <div className="px-5 py-3 border-b-2 border-border">
        <span className="text-sm font-semibold text-taupe-900 uppercase tracking-wider">Chi tiết thanh toán</span>
      </div>
      <div className="px-5 py-4 space-y-2">
        <div className="flex justify-between text-sm text-taupe-600">
          <span>Tiền hàng</span>
          <span>{formatPrice(productAmount || 0)}</span>
        </div>
        <div className="flex justify-between text-sm text-taupe-600">
          <span>Phí vận chuyển</span>
          <span>{isLocalPickup ? "Miễn phí" : formatPrice(shippingFee || 0)}</span>
        </div>
        {!!insuranceFee && insuranceFee > 0 && (
          <div className="flex justify-between text-sm text-taupe-600">
            <span>Phí bảo hiểm</span>
            <span>{formatPrice(insuranceFee)}</span>
          </div>
        )}
        {!!codFee && codFee > 0 && (
          <div className="flex justify-between text-sm text-taupe-600">
            <span>Phí COD</span>
            <span>{formatPrice(codFee)}</span>
          </div>
        )}
        <div className="pt-2 mt-1 border-t-2 border-border flex justify-between items-center">
          <span className="text-sm font-semibold text-taupe-900">Tổng cộng</span>
          <span className="text-lg font-bold text-primary">{formatPrice(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}