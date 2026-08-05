"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

interface CheckoutHeaderProps {
  onBack: () => void;
}

export default function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
  return (
    <div className="max-w-9xl mx-auto w-full px-4 mb-6 sm:px-6">
      <div className="flex items-center gap-2 text-sm mt-2 text-muted-foreground">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-charcoal-400 uppercase flex-wrap"
        >
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-1 text-xs font-semibold uppercase transition-colors hover:text-luxury-ink focus:outline-none"
          >
            <IconChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Trở lại</span>
          </button>

          <IconChevronRight className="h-3 w-3 text-taupe-300" />

          <span className="text-luxury-ink">Xác nhận đơn hàng</span>
        </nav>
      </div>
    </div>
  );
}
