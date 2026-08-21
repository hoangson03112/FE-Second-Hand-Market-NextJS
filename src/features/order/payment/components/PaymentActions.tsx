"use client";

import {
  IconArrowUpRight,
  IconCircleCheck,
  IconLoader2,
} from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface PaymentActionsProps {
  isExpired: boolean;
  isConfirmingPayment: boolean;
  onConfirmPayment: () => void;
  /** Drives the disabled state so the intent is clear before clicking. */
  hasProof?: boolean;
}

export function PaymentActions({
  isExpired,
  isConfirmingPayment,
  onConfirmPayment,
  hasProof = true,
}: PaymentActionsProps) {
  const disabled = isExpired || isConfirmingPayment || !hasProof;

  const hint = isExpired
    ? "Đơn đã hết thời gian thanh toán."
    : !hasProof
      ? "Tải lên ảnh biên lai để bật nút xác nhận."
      : null;

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onConfirmPayment}
        disabled={disabled}
        className={cn(
          "inline-flex h-14 w-full items-center justify-center gap-3 rounded-[2px] px-6",
          "text-[11px] font-bold uppercase tracking-[0.22em] transition-all duration-300",
          disabled
            ? "cursor-not-allowed bg-luxury-ink/25 text-luxury-ivory/70"
            : "bg-luxury-ink text-luxury-ivory hover:bg-charcoal-800",
        )}
      >
        {isConfirmingPayment ? (
          <>
            <IconLoader2 className="h-4 w-4 animate-spin" />
            Đang gửi
          </>
        ) : (
          <>
            <IconCircleCheck className="h-4 w-4" />
            Tôi đã chuyển khoản
          </>
        )}
      </button>

      {hint ? (
        <p className="text-center text-2xs font-bold uppercase tracking-[0.18em] text-neutral-500">
          {hint}
        </p>
      ) : null}

      <Link
        href="/"
        className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] border border-luxury-ink/15 px-6 text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink transition-all duration-300 hover:border-luxury-ink hover:bg-luxury-ink hover:text-luxury-ivory"
      >
        Về trang chủ
        <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
