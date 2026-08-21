import { Eyebrow } from "@/features/order/components";
import { formatPrice } from "@/utils/format/price";

export interface PaymentOrderSummaryProps {
  totalAmount: number;
}

export function PaymentOrderSummary({ totalAmount }: PaymentOrderSummaryProps) {
  return (
    <section className="overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white">
      <header className="border-b border-luxury-ink/10 px-5 py-5 sm:px-6">
        <Eyebrow>Số tiền cần chuyển</Eyebrow>
      </header>

      <div className="px-5 py-6 sm:px-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-2xs font-bold uppercase tracking-[0.22em] text-neutral-500">
            Tổng tiền hàng
          </span>
          <span className="font-droid-serif tabular-nums text-sm text-luxury-ink">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-4 border-t border-luxury-ink/10 bg-cream-50/70 px-5 py-5 sm:px-6">
        <span className="text-2xs font-bold uppercase tracking-[0.22em] text-luxury-ink">
          Tổng thanh toán
        </span>
        <span className="font-droid-serif tabular-nums text-2xl leading-none text-luxury-ink">
          {formatPrice(totalAmount)}
        </span>
      </div>
    </section>
  );
}
