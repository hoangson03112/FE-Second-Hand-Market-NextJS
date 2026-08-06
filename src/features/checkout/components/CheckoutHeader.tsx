"use client";

import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface CheckoutHeaderProps {
  onBack: () => void;
}

export default function CheckoutHeader({ onBack }: CheckoutHeaderProps) {
  return (
    <div className="max-w-9xl mx-auto w-full px-4 mb-6 sm:px-6">
      <div className="flex items-center gap-2 text-sm mt-2">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-semibold tracking-wide text-taupe-500 uppercase flex-wrap"
        >
          <button
            type="button"
            onClick={onBack}
            className="group inline-flex items-center gap-1 text-xs font-semibold uppercase transition-colors hover:text-taupe-900 focus:outline-none"
          >
            <IconChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Trở lại</span>
          </button>

          <IconChevronRight className="h-3 w-3 text-taupe-300" />

          <span className="text-primary">Xác nhận đơn hàng</span>
        </nav>
      </div>
    </div>
  );
}