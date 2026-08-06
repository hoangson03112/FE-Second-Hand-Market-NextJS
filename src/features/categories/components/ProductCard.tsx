"use client";

import Link from "next/link";
import Image from "next/image";
import {
  IconMapPin,
  IconArrowUpRight,
  IconSparkles,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";
import type { IProduct } from "@/types/product";
import { getProvinceName } from "@/utils";

interface ProductCardProps {
  product: IProduct;
  className?: string;
}
export default function ProductCard({
  product,
  className,
}: ProductCardProps) {
  const imageUrl = product.avatar?.url ?? product.images?.[0]?.url;
  
  return (
    <Link
      href={`/products/${product._id}/${product.slug ?? "san-pham"}`}
      className={cn(
        "group flex flex-col overflow-hidden border border-luxury-ink/8 bg-white p-3 transition-all duration-700 ease-out hover:-translate-y-1 hover:border-luxury-ink/15 hover:shadow-[0_20px_40px_color-mix(in_srgb,var(--luxury-ink)_8%,transparent)]",
        className,
      )}
      style={{ borderRadius: "2px" }}
    >
      <div
        className="relative aspect-square w-full overflow-hidden bg-cream-100"
        style={{ borderRadius: "1px" }}
      >
        {imageUrl ? (
          <>
            <Image
              src={imageUrl}
              alt=""
              fill
              className="object-cover opacity-30 blur-lg scale-125"
              aria-hidden="true"
            />

            <div className="absolute inset-0 p-2">
              <div className="relative h-full w-full">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-xs transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 20vw"
                />
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-neutral-400">
            <IconSparkles className="h-8 w-8 opacity-40" />
          </div>
        )}

        <span className="absolute left-2 top-2 z-10 bg-luxury-ink/75 px-2 py-0.5 text-xs font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md">
          {product.category?.name ?? "Mới"}
        </span>
      </div>

      <div className="mt-2.5 flex flex-1 flex-col justify-between px-0.5 pb-0.5">
        <div>
          <div className="flex items-center gap-1 text-xs font-medium text-charcoal-500 uppercase tracking-[0.14em]">
            <IconMapPin className="h-3 w-3 text-blush-500 shrink-0" />
            <span className="line-clamp-1"> {getProvinceName(product!.address!.provinceId)}</span>
          </div>

          <h3 className="mt-1.5 line-clamp-2 text-xs font-medium text-foreground leading-snug transition-colors group-hover:text-primary md:text-sm">
            {product.name}
          </h3>
        </div>

        {/* Giá và nút bấm (Action)[cite: 15] */}
        <div className="mt-3 flex items-center justify-between border-t border-luxury-ink/6 pt-3">
          <span className="text-sm font-normal tracking-tight text-primary md:text-base group-hover:text-blush-600">
            {formatPrice(product.price)}
          </span>
          <div
            className="flex h-7 w-7 items-center justify-center border border-luxury-ink/10 text-luxury-ink transition-all duration-300 group-hover:border-luxury-ink group-hover:bg-luxury-ink group-hover:text-white"
            style={{ borderRadius: "999px" }}
          >
            <IconArrowUpRight className="h-3.5 w-3.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
