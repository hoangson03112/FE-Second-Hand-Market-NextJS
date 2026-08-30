"use client";

import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";

interface AllProductsHeaderProps {
  total?: number;
  title?: string;
  breadcrumbLabel?: string;
  totalLabel?: string;
}

export default function AllProductsHeader({
  total,
  title = "Tất cả sản phẩm.",
  breadcrumbLabel = "Bộ sưu tập",
  totalLabel = "sản phẩm",
}: AllProductsHeaderProps) {
  return (
    <header className="px-4 py-8 sm:px-8 lg:px-12">
      <div className="flex flex-col justify-between gap-12 border-b border-luxury-ink pb-8 md:flex-row md:items-end">
        <div className="space-y-4">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-charcoal-400"
          >
            <Link href="/" className="transition-colors hover:text-luxury-ink">
              Trang chủ
            </Link>
            <IconChevronRight className="h-3 w-3 text-charcoal-300" />
            <span className="text-luxury-ink">{breadcrumbLabel}</span>
          </nav>
          <h1 className="font-droid-serif text-3xl font-normal text-luxury-ink sm:text-3xl md:text-4xl">
            {title}
          </h1>
        </div>
        {typeof total === "number" && (
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-charcoal-400">
            {total} {totalLabel}
          </p>
        )}
      </div>
    </header>
  );
}
