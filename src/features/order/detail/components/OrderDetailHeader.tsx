"use client";

import { IconArrowLeft } from "@tabler/icons-react";
import { OrderStatusChip } from "@/features/order/components";

interface OrderDetailHeaderProps {
  orderId: string;
  status: string;
  onBack: () => void;
}

const serif = { fontFamily: "var(--font-droid-serif), serif" };

/**
 * Mirrors `CheckoutHeader` — same height, same back affordance, same serif
 * title — so moving from checkout to an order reads as one continuous flow.
 */
export function OrderDetailHeader({
  orderId,
  status,
  onBack,
}: OrderDetailHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-luxury-ink/10 bg-luxury-ivory/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-9xl items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          aria-label="Quay lại"
          className="-ml-2 shrink-0 rounded-[2px] p-2 text-luxury-ink transition-colors hover:bg-taupe-50"
        >
          <IconArrowLeft className="h-5 w-5" />
        </button>

        <h1
          style={serif}
          className="min-w-0 flex-1 truncate text-xl tracking-tight text-luxury-ink sm:text-2xl"
        >
          Chi Tiết Đơn Hàng
        </h1>

        <div className="hidden shrink-0 text-right sm:block">
          <p className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
            Mã đơn
          </p>
          <p className="mt-1 font-mono text-sm leading-none text-luxury-ink">
            #{orderId.slice(-10).toUpperCase()}
          </p>
        </div>

        <span aria-hidden className="hidden h-8 w-px bg-luxury-ink/10 sm:block" />

        <OrderStatusChip status={status} />
      </div>
    </header>
  );
}
