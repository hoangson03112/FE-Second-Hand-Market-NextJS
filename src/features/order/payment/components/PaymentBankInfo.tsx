"use client";

import { IconAlertTriangle, IconCheck, IconCopy } from "@tabler/icons-react";
import { Eyebrow } from "@/features/order/components";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";

export interface DisplayBankInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  amount: number;
  content: string;
}

export interface PaymentBankInfoProps {
  bankInfoLoading: boolean;
  bankInfoError: string | null;
  displayBankInfo: DisplayBankInfo;
  onCopy: (text: string, field?: string) => void;
  copiedField?: string | null;
}

const label =
  "text-xs font-medium uppercase tracking-[0.15em] text-neutral-800";

/** Hairline copy affordance that confirms in place instead of silently. */
function CopyButton({
  value,
  field,
  onCopy,
  copied,
}: {
  value: string;
  field: string;
  onCopy: (text: string, field?: string) => void;
  copied: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onCopy(value, field)}
      aria-label={copied ? "Đã sao chép" : `Sao chép ${field}`}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-[2px] border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] transition-all duration-300",
        copied
          ? "border-accent/45 bg-taupe-50 text-taupe-700"
          : "border-luxury-ink/15 text-neutral-600 hover:border-luxury-ink hover:bg-luxury-ink hover:text-luxury-ivory",
      )}
    >
      {copied ? (
        <>
          <IconCheck className="h-3 w-3" />
          Đã copy
        </>
      ) : (
        <>
          <IconCopy className="h-3 w-3" />
          Copy
        </>
      )}
    </button>
  );
}

export function PaymentBankInfo({
  bankInfoLoading,
  bankInfoError,
  displayBankInfo,
  onCopy,
  copiedField,
}: PaymentBankInfoProps) {
  return (
    <section className="overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white">
      <header className="border-b border-luxury-ink/10 px-5 py-5 sm:px-6">
        <Eyebrow>Hoặc chuyển thủ công</Eyebrow>
        <h2 className="mt-3 font-droid-serif text-xl tracking-tight text-luxury-ink">
          Thông tin chuyển khoản
        </h2>
      </header>

      {bankInfoLoading ? (
        <div className="flex items-center gap-4 px-5 py-10 sm:px-6">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border border-luxury-ink/20 border-t-luxury-ink" />
          <span className={label}>Đang tải thông tin ngân hàng</span>
        </div>
      ) : bankInfoError ? (
        <div className="px-5 py-6 sm:px-6">
          <div className="flex items-start gap-3 rounded-[2px] border border-blush-300 bg-blush-50 px-4 py-3.5">
            <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-blush-700" />
            <p className="text-xs leading-relaxed text-blush-800">
              {bankInfoError}
            </p>
          </div>
        </div>
      ) : (
        <>
          <dl className="divide-y divide-luxury-ink/8">
            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <dt className={label}>Ngân hàng</dt>
              <dd className="text-sm font-medium text-luxury-ink uppercase">
                {displayBankInfo.bankName}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <dt className={label}>Số tài khoản</dt>
              <dd className="flex items-center gap-3">
                <span className="font-droid-serif tabular-nums text-base tracking-wide text-luxury-ink">
                  {displayBankInfo.accountNumber}
                </span>
                <CopyButton
                  value={displayBankInfo.accountNumber}
                  field="số tài khoản"
                  onCopy={onCopy}
                  copied={copiedField === "số tài khoản"}
                />
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
              <dt className={label}>Chủ tài khoản</dt>
              <dd className="max-w-[55%] truncate text-right text-sm font-medium uppercase text-luxury-ink">
                {displayBankInfo.accountHolder.toUpperCase()}
              </dd>
            </div>

            <div className="flex items-center justify-between gap-4 bg-cream-50/70 px-5 py-4 sm:px-6">
              <dt className="text-2xs font-bold uppercase tracking-[0.22em] text-luxury-ink">
                Số tiền
              </dt>
              <dd className="flex items-center gap-3">
                <span className="font-droid-serif tabular-nums text-xl text-luxury-ink">
                  {formatPrice(displayBankInfo.amount)}
                </span>
                <CopyButton
                  value={String(Math.round(displayBankInfo.amount))}
                  field="số tiền"
                  onCopy={onCopy}
                  copied={copiedField === "số tiền"}
                />
              </dd>
            </div>

            <div className="px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <dt className={label}>Nội dung chuyển khoản</dt>
                <CopyButton
                  value={displayBankInfo.content}
                  field="nội dung"
                  onCopy={onCopy}
                  copied={copiedField === "nội dung"}
                />
              </div>
              <dd className="mt-3 break-all rounded-[2px] border border-luxury-ink/10 bg-cream-50 px-3.5 py-3 text-xs leading-relaxed text-luxury-ink">
                {displayBankInfo.content}
              </dd>
            </div>
          </dl>

          <p className="border-t border-luxury-ink/8 px-5 py-4 text-xs leading-relaxed text-neutral-600 sm:px-6">
            Giữ nguyên nội dung chuyển khoản để hệ thống đối chiếu đúng đơn của
            bạn.
          </p>
        </>
      )}
    </section>
  );
}
