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
    <div className="overflow-hidden border border-luxury-ink/8 bg-white/60" style={{ borderRadius: "2px" }}>
      <div className="border-b border-luxury-ink/8 px-5 py-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600">Chi tiết thanh toán</span>
      </div>
      <div className="space-y-2 px-5 py-4">
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Tiền hàng</span>
          <span>{formatPrice(productAmount || 0)}</span>
        </div>
        <div className="flex justify-between text-sm text-neutral-600">
          <span>Phí vận chuyển</span>
          <span>{isLocalPickup ? "Miễn phí" : formatPrice(shippingFee || 0)}</span>
        </div>
        {!!insuranceFee && insuranceFee > 0 && (
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Phí bảo hiểm</span>
            <span>{formatPrice(insuranceFee)}</span>
          </div>
        )}
        {!!codFee && codFee > 0 && (
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Phí COD</span>
            <span>{formatPrice(codFee)}</span>
          </div>
        )}
        <div className="mt-1 flex items-center justify-between border-t border-luxury-ink/8 pt-3">
          <span className="text-sm font-semibold text-luxury-ink">Tổng cộng</span>
          <span className="text-lg font-semibold text-luxury-ink">{formatPrice(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
}