"use client";

import {
  IconAlertTriangle,
  IconCircleCheck,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { Eyebrow } from "@/features/order/components";
import { cn } from "@/lib/utils";

export interface PaymentProofUploadProps {
  proofPreviewUrl: string | null;
  isExpired: boolean;
  isConfirmingPayment: boolean;
  paymentError: string | null;
  paymentSuccess: string | null;
  onFileChange: (file: File | null) => void;
}

export function PaymentProofUpload({
  proofPreviewUrl,
  isExpired,
  isConfirmingPayment,
  paymentError,
  paymentSuccess,
  onFileChange,
}: PaymentProofUploadProps) {
  const disabled = isExpired || isConfirmingPayment;

  return (
    <section className="rounded-[2px] border border-luxury-ink/10 bg-white px-5 py-6 sm:px-6">
      <Eyebrow>Bước cuối</Eyebrow>
      <h2
        className="font-droid-serif mt-3 text-lg tracking-tight text-luxury-ink"
      >
        Gửi biên lai chuyển khoản
      </h2>
      <p className="mt-2.5 text-xs leading-relaxed text-neutral-600">
        Tải lên ảnh chụp màn hình giao dịch để admin đối chiếu và xác nhận đơn.
      </p>

      <div className="mt-6 space-y-4">
        <label
          className={cn(
            "relative flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-[2px] border border-dashed transition-all duration-300",
            disabled
              ? "cursor-not-allowed border-luxury-ink/10 bg-cream-100/60"
              : proofPreviewUrl
                ? "border-luxury-ink/25 bg-cream-50"
                : "border-luxury-ink/20 bg-cream-50/60 hover:border-luxury-ink/45 hover:bg-cream-50",
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e.target.files?.[0] || null)}
            className="hidden"
            disabled={disabled}
          />

          {proofPreviewUrl ? (
            <div className="group relative flex h-full w-full items-center justify-center p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proofPreviewUrl}
                alt="Biên lai đã chọn"
                className="max-h-full max-w-full rounded-[2px] object-contain"
              />
              {!disabled ? (
                <span className="absolute inset-0 flex items-center justify-center bg-luxury-ink/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-ivory">
                    Chọn ảnh khác
                  </span>
                </span>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col items-center px-6 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-white">
                <IconUpload className="h-4 w-4 text-luxury-ink" />
              </span>
              <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-ink">
                Chọn ảnh biên lai
              </p>
              <p className="mt-2 text-xs text-neutral-500">
                PNG, JPG hoặc WEBP — tối đa 10MB
              </p>
            </div>
          )}
        </label>

        {proofPreviewUrl && !disabled ? (
          <button
            type="button"
            onClick={() => onFileChange(null)}
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 transition-colors hover:text-blush-700"
          >
            <IconX className="h-3.5 w-3.5" />
            Bỏ ảnh đã chọn
          </button>
        ) : null}

        {paymentError ? (
          <div className="flex items-start gap-3 rounded-[2px] border border-blush-300 bg-blush-50 px-4 py-3.5">
            <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-blush-700" />
            <p className="text-xs leading-relaxed text-blush-800">
              {paymentError}
            </p>
          </div>
        ) : null}

        {paymentSuccess ? (
          <div className="flex items-start gap-3 rounded-[2px] border border-accent/40 bg-taupe-50 px-4 py-3.5">
            <IconCircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <p className="text-xs leading-relaxed text-taupe-800">
              {paymentSuccess}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
