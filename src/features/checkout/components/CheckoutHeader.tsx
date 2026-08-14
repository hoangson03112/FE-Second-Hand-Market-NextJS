"use client";

import { IconArrowLeft } from "@tabler/icons-react";

interface CheckoutHeaderProps {
  onBack: () => void;
  isEmpty: boolean;
  itemCount: number;
  sellerCount: number;
}

const serif = { fontFamily: "var(--font-droid-serif), serif" };

export default function CheckoutHeader({
  onBack,
  isEmpty,
  itemCount,
  sellerCount,
}: CheckoutHeaderProps) {
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
          Xác Nhận Đơn Hàng
        </h1>

        {!isEmpty ? (
          <dl className="hidden shrink-0 items-center gap-6 sm:flex md:gap-8">
            <div className="text-right">
              <dt className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Sản phẩm
              </dt>
              <dd
                style={serif}
                className="mt-1 text-xl leading-none tabular-nums text-luxury-ink"
              >
                {itemCount}
              </dd>
            </div>

            <span aria-hidden className="h-8 w-px bg-luxury-ink/10" />

            <div className="text-right">
              <dt className="text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500">
                Người bán
              </dt>
              <dd
                style={serif}
                className="mt-1 text-xl leading-none tabular-nums text-luxury-ink"
              >
                {sellerCount}
              </dd>
            </div>
          </dl>
        ) : null}
      </div>
    </header>
  );
}
