import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight, IconPackage } from "@tabler/icons-react";
import { formatPrice } from "@/utils/format/price";

interface ProductMessageCardProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  productSlug?: string;
}

export default function ProductMessageCard({
  productId,
  productName,
  productPrice,
  productImage,
  productSlug,
}: ProductMessageCardProps) {
  const productUrl = `/products/${productId}/${productSlug || "product"}`;

  return (
    <Link
      href={productUrl}
      className="group block max-w-sm rounded-[2px] border border-luxury-ink/10 bg-white p-3 transition-all duration-300 hover:border-luxury-ink/30"
    >
      <div className="flex gap-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-taupe-50">
          {productImage ? (
            <Image
              src={productImage}
              alt={productName}
              fill
              sizes="80px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <IconPackage className="h-6 w-6 text-taupe-300" />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <p className="line-clamp-2 text-sm font-medium leading-relaxed text-luxury-ink">
            {productName}
          </p>
          <p className="font-droid-serif mt-1.5 tabular-nums text-base text-luxury-ink">
            {formatPrice(productPrice)}
          </p>
          <span className="mt-auto flex items-center gap-1.5 pt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-neutral-500 transition-colors group-hover:text-luxury-ink">
            Xem chi tiết
            <IconArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
