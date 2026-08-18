"use client";

import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { Panel, microCaps } from "@/features/order/components";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";
import { getConditionLabel } from "@/utils/format";
import type { Order } from "@/types/order";

function getAvatar(product: Order["products"][number]["productId"]): string {
  if (!product) return "/images/product-placeholder.svg";
  if (typeof product.avatar === "string" && product.avatar.trim())
    return product.avatar;
  if (
    product.avatar &&
    typeof product.avatar === "object" &&
    "url" in product.avatar
  ) {
    return (
      (product.avatar as { url: string }).url ||
      "/images/product-placeholder.svg"
    );
  }
  const first = product.images?.[0];
  if (first && typeof first === "object" && "url" in first)
    return (first as { url: string }).url;
  return "/images/product-placeholder.svg";
}

interface SellerProductsCardProps {
  order: Order;
}

/**
 * The items in the order. The price breakdown that used to repeat at the bottom
 * of this card now lives once, on the ink panel — it was printed twice on the
 * same screen.
 */
export function SellerProductsCard({ order }: SellerProductsCardProps) {
  const products = order.products ?? [];

  return (
    <Panel
      eyebrow="Trong đơn"
      title={`${products.length} sản phẩm`}
      padding="flush"
    >
      <div className="divide-y divide-luxury-ink/8">
        {products.map((item, idx) => {
          const product = item.productId;
          const name = product?.name || "Sản phẩm";
          const conditionLabel = product?.condition
            ? getConditionLabel(product.condition)
            : null;
          const href = product?._id ? `/products/${product._id}` : null;

          const thumbnail = (
            <Image
              src={getAvatar(product)}
              alt={name}
              fill
              sizes="64px"
              className="object-cover transition-transform duration-700 ease-out group-hover/item:scale-105"
            />
          );
          const thumbClass =
            "relative h-16 w-16 shrink-0 overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-taupe-50";

          return (
            <div
              key={idx}
              className="group/item flex gap-4 px-5 py-4 sm:px-6"
            >
              {href ? (
                <Link
                  href={href}
                  target="_blank"
                  className={cn(
                    thumbClass,
                    "transition-colors duration-300 hover:border-luxury-ink/30",
                  )}
                >
                  {thumbnail}
                </Link>
              ) : (
                <div className={thumbClass}>{thumbnail}</div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <p className="line-clamp-2 text-sm font-medium leading-relaxed text-luxury-ink">
                    {name}
                  </p>
                  {href ? (
                    <Link
                      href={href}
                      target="_blank"
                      className="group/link inline-flex shrink-0 items-center gap-1.5 text-2xs font-bold uppercase tracking-[0.18em] text-luxury-ink transition-colors hover:text-taupe-700"
                    >
                      Xem
                      <IconArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </Link>
                  ) : null}
                </div>

                <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                  <div className="flex items-center gap-2.5">
                    {conditionLabel ? (
                      <span className="inline-flex items-center rounded-[2px] border border-luxury-ink/12 bg-cream-50 px-2 py-0.5 text-2xs font-bold uppercase tracking-[0.18em] text-neutral-600">
                        {conditionLabel}
                      </span>
                    ) : null}
                    <span className={cn(microCaps, "text-neutral-500")}>
                      Số lượng ×{item.quantity}
                    </span>
                  </div>

                  <span className="font-droid-serif tabular-nums text-base text-luxury-ink">
                    {formatPrice(
                      (item.price || product?.price || 0) * (item.quantity || 1),
                    )}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
