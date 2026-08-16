import { formatPrice } from "@/utils/format/price";
import { Eyebrow, InkSurface, Panel } from "@/features/order/components";

interface OrderPriceSummaryProps {
  productAmount: number;
  shippingFee: number;
  insuranceFee?: number;
  codFee?: number;
  totalAmount: number;
  isLocalPickup: boolean;
}

const serif = { fontFamily: "var(--font-droid-serif), serif" };

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-2xs font-bold uppercase tracking-[0.15em] text-charcoal-800">
        {label}
      </span>
      <span style={serif} className="tabular-nums text-sm text-luxury-ink">
        {value}
      </span>
    </div>
  );
}

/** Same rows and same ink cap as `CheckoutSummary` — the paid order should read
 *  as the receipt of the basket the buyer confirmed, not a different document. */
export function OrderPriceSummary({
  productAmount,
  shippingFee,
  insuranceFee = 0,
  codFee = 0,
  totalAmount,
  isLocalPickup,
}: OrderPriceSummaryProps) {
  return (
    <Panel eyebrow="Tổng quan" title="Chi tiết thanh toán" padding="flush">
      <div className="space-y-3.5 px-5 py-6 sm:px-6">
        <Row label="Tiền hàng" value={formatPrice(productAmount || 0)} />
        <Row
          label="Phí vận chuyển"
          value={isLocalPickup ? "Miễn phí" : formatPrice(shippingFee || 0)}
        />
        {insuranceFee > 0 && (
          <Row label="Phí bảo hiểm" value={formatPrice(insuranceFee)} />
        )}
        {codFee > 0 && <Row label="Phí COD" value={formatPrice(codFee)} />}
      </div>

      <InkSurface className="px-5 py-6 sm:px-6">
        <Eyebrow tone="dark">Tổng cộng</Eyebrow>
        <p
          style={serif}
          className="mt-3 tabular-nums text-[clamp(1.5rem,2.4vw,2rem)] leading-none text-luxury-ivory"
        >
          {formatPrice(totalAmount)}
        </p>
      </InkSurface>
    </Panel>
  );
}
