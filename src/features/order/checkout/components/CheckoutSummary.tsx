"use client";

import { IconWallet, IconBuilding } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";
import type { SellerGroup } from "../hooks/useCheckout";
import type { PaymentMethodType } from "./PaymentMethod";
import { Eyebrow, InkSurface } from "@/features/order/components";

interface CheckoutSummaryProps {
  subtotal: number;
  shipping: number;
  discount?: number;
  sellerGroups?: SellerGroup[];
  paymentMethods?: Record<string, PaymentMethodType>;
}

const PAYMENT_LABEL: Record<
  PaymentMethodType,
  { label: string; icon: typeof IconWallet }
> = {
  cod: { label: "COD", icon: IconWallet },
  bank_transfer: { label: "Chuyển khoản", icon: IconBuilding },
};

const serif = { fontFamily: "var(--font-droid-serif), serif" };

function Row({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "blush";
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-xs font-bold uppercase tracking-[0.15em] text-charcoal-800">
        {label}
      </span>
      <span
        style={serif}
        className={cn(
          "tabular-nums text-sm",
          tone === "blush" ? "text-blush-700" : "text-luxury-ink",
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function CheckoutSummary({
  subtotal,
  shipping,
  discount = 0,
  sellerGroups = [],
  paymentMethods = {},
}: CheckoutSummaryProps) {
  const total = subtotal + shipping - discount;
  const isMultiSeller = sellerGroups.length > 1;
  const allLocalPickup =
    sellerGroups.length > 0 && sellerGroups.every((g) => g.isLocalPickup);

  return (
    <section className="overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white">
      <header className="border-b border-luxury-ink/10 px-5 py-5 sm:px-6">
        <Eyebrow>Tổng quan</Eyebrow>
        <h2
          style={serif}
          className="mt-3 text-xl tracking-tight text-luxury-ink"
        >
          Tổng đơn hàng
        </h2>
      </header>

      {/* Per-seller breakdown when multi-seller */}
      {isMultiSeller ? (
        <div className="divide-y divide-luxury-ink/8 border-b border-luxury-ink/10">
          {sellerGroups.map((group) => {
            const method = (paymentMethods[group.sellerId] ??
              "cod") as PaymentMethodType;
            const { label, icon: Icon } = PAYMENT_LABEL[method];
            return (
              <div key={group.sellerId} className="space-y-3 px-5 py-5 sm:px-6">
                <p className="truncate text-sm font-medium text-neutral-700">
                 Người bán: <span className="font-bold text-luxury-ink tracking-tight">{group.sellerName}</span>
                </p>
                <Row
                  label={`Hàng · ${group.items.length} sp`}
                  value={formatPrice(group.subtotal)}
                />
                <Row
                  label="Vận chuyển"
                  value={
                    group.isLocalPickup
                      ? "Miễn phí"
                      : group.shippingFee > 0
                        ? formatPrice(group.shippingFee)
                        : "—"
                  }
                />
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">
                    Thanh toán
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-luxury-ink/10 bg-cream-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-luxury-ink">
                    <Icon className="h-3 w-3" />
                    {group.isLocalPickup ? "Khi gặp mặt" : label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="space-y-3.5 px-5 py-6 sm:px-6">
        <Row label="Tiền hàng" value={formatPrice(subtotal)} />
        <Row
          label="Phí vận chuyển"
          value={
            allLocalPickup
              ? "Miễn phí"
              : shipping === 0
                ? "Đang tính…"
                : formatPrice(shipping)
          }
        />
        {discount > 0 ? (
          <Row
            label="Giảm giá"
            value={`−${formatPrice(discount)}`}
            tone="blush"
          />
        ) : null}
      </div>

      {/* Ink cap — the same dark panel treatment as the homepage CTA */}
      <InkSurface className="px-5 py-6 sm:px-6">
        <Eyebrow tone="dark">Tổng cộng</Eyebrow>
        <p
          style={serif}
          className="mt-3 tabular-nums text-[clamp(1.5rem,2.4vw,2rem)] leading-none text-luxury-ivory"
        >
          {formatPrice(total)}
        </p>
        {isMultiSeller ? (
          <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-ivory/50">
            Cho {sellerGroups.length} đơn từ {sellerGroups.length} người bán
          </p>
        ) : null}
      </InkSurface>
    </section>
  );
}
