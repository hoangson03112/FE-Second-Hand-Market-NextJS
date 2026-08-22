"use client";

import Image from "next/image";
import { Eyebrow } from "@/features/order/components";
import { formatPrice } from "@/utils/format/price";
import type { Order } from "@/types/order";

interface OrderItemsPanelProps {
  order: Order;
}

function resolveImage(product: Order["products"][number]["productId"]) {
  const avatar =
    typeof product?.avatar === "string" ? product.avatar : product?.avatar?.url;
  return (
    avatar || product?.images?.[0]?.url || "/images/product-placeholder.svg"
  );
}

export default function OrderItemsPanel({ order }: OrderItemsPanelProps) {
  const items = order.products ?? [];

  return (
    <section className="rounded-[2px] border border-luxury-ink/10 bg-white">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-luxury-ink/10 px-5 py-5 sm:px-6">
        <div>
          <Eyebrow>Đã đặt</Eyebrow>
          <h2

            className="font-droid-serif mt-3 text-lg tracking-tight text-luxury-ink"
          >
            Sản phẩm trong đơn
          </h2>
        </div>
        <span className="text-2xs font-bold uppercase tracking-[0.22em] text-neutral-500">
          {items.length} sản phẩm
        </span>
      </header>

      <div className="divide-y divide-luxury-ink/8 px-5 sm:px-6">
        {items.map((item, index) => {
          const product = item.productId;
          return (
            <div key={index} className="flex gap-4 py-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-taupe-50">
                <Image
                  src={resolveImage(product)}
                  alt={product?.name ?? "Sản phẩm"}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-medium leading-relaxed text-luxury-ink">
                  {product?.name ?? "Sản phẩm"}
                </p>
                <div className="mt-3 flex items-baseline justify-between gap-4">
                  <span className="text-2xs font-bold uppercase tracking-[0.22em] text-neutral-500">
                    Số lượng ×{item.quantity}
                  </span>
                  <span

                    className="font-droid-serif tabular-nums text-base text-luxury-ink"
                  >
                    {formatPrice(item.price ?? product?.price ?? 0)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
