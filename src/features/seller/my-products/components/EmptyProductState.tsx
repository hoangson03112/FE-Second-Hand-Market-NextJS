import { IconArrowUpRight, IconPackage } from "@tabler/icons-react";
import Link from "next/link";
import { PRODUCT_MESSAGES } from "@/constants";

export function EmptyProductState() {
  return (
    <div className="rounded-[2px] border border-dashed border-luxury-ink/15 bg-white px-6 py-20 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-cream-50">
        <IconPackage className="h-6 w-6 text-luxury-ink" />
      </span>

      <h2 className="font-droid-serif mt-7 text-xl tracking-tight text-luxury-ink">
        {PRODUCT_MESSAGES.NO_PRODUCTS}
      </h2>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
        {PRODUCT_MESSAGES.NO_PRODUCTS_DESC}
      </p>

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/sell"
          className="group inline-flex items-center gap-2 rounded-[2px] bg-luxury-ink px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800"
        >
          Đăng sản phẩm
          <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-[2px] border border-luxury-ink/15 px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-ink transition-all duration-300 hover:border-luxury-ink hover:bg-luxury-ink hover:text-luxury-ivory"
        >
          Khám phá chợ
        </Link>
      </div>
    </div>
  );
}
