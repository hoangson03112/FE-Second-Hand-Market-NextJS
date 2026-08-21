"use client";

import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

interface AllProductsHeaderProps {
  total?: number;
}

export default function AllProductsHeader({ total }: AllProductsHeaderProps) {
  return (
    <header className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-luxury-ink pb-8">
        <div className="space-y-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-charcoal-400 uppercase flex-wrap"
          >
            <Link href="/" className="hover:text-luxury-ink transition-colors">
              Trang chủ
            </Link>
            <IconChevronRight className="h-3 w-3 text-charcoal-300" />
            <span className="text-luxury-ink">Bộ sưu tập</span>
          </nav>
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-normal text-luxury-ink font-droid-serif">
            Tất cả sản phẩm.
          </h1>
        </div>
        {typeof total === "number" && (
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal-400">
            {total} sản phẩm
          </p>
        )}
      </div>
    </header>
  );
}
