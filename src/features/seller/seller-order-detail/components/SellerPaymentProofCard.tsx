"use client";

import Image from "next/image";
import { useState } from "react";
import {
  IconAlertTriangle,
  IconArrowUpRight,
  IconCircleCheck,
  IconClock,
  IconX,
} from "@tabler/icons-react";
import { ConfirmWithReasonDialog } from "@/components/ui";
import {
  Panel,
  dangerAction,
  microCaps,
  primaryAction,
} from "@/features/order/components";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import type { PaymentProof } from "@/types/order";

interface SellerPaymentProofCardProps {
  proof: PaymentProof | null;
  loading: boolean;
  /** Số tiền đơn hàng, để người bán đối chiếu với ảnh biên lai. */
  amount: number;
  submitting: boolean;
  onVerify: () => void;
  onReject: (reason: string) => void;
}

/** Same three tones as `OrderStatusChip`: settled, attention, failed. */
const STATUS_TONE = {
  pending: {
    chip: "border-luxury-champagne/50 bg-cream-100 text-neutral-700",
    dot: "bg-luxury-champagne",
    label: "Chờ bạn đối soát",
    Icon: IconClock,
  },
  verified: {
    chip: "border-accent/35 bg-taupe-50 text-taupe-700",
    dot: "bg-accent",
    label: "Đã nhận tiền",
    Icon: IconCircleCheck,
  },
  rejected: {
    chip: "border-blush-300 bg-blush-50 text-blush-800",
    dot: "bg-blush-600",
    label: "Đã từ chối",
    Icon: IconX,
  },
} as const;

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className={cn(microCaps, "shrink-0 text-neutral-500")}>
        {label}
      </span>
      <span className="min-w-0 truncate text-right text-sm text-luxury-ink">
        {value}
      </span>
    </div>
  );
}

export function SellerPaymentProofCard({
  proof,
  loading,
  amount,
  submitting,
  onVerify,
  onReject,
}: SellerPaymentProofCardProps) {
  const [rejectOpen, setRejectOpen] = useState(false);

  if (loading) {
    return (
      <Panel eyebrow="Thanh toán" title="Biên lai chuyển khoản">
        <div className="flex items-center gap-3">
          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border border-luxury-ink/20 border-t-luxury-ink" />
          <p className={cn(microCaps, "text-neutral-500")}>
            Đang tải biên lai
          </p>
        </div>
      </Panel>
    );
  }

  // Người mua chưa chuyển khoản — chưa có gì để đối soát.
  if (!proof) {
    return (
      <Panel eyebrow="Thanh toán" title="Biên lai chuyển khoản">
        <div className="flex gap-4 rounded-[2px] border border-luxury-champagne/45 bg-cream-100/70 px-4 py-3.5">
          <IconClock className="mt-0.5 h-4 w-4 shrink-0 text-luxury-champagne" />
          <div>
            <p className="text-xs font-bold text-luxury-ink">
              Chờ người mua chuyển khoản
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
              Khi người mua tải biên lai lên, bạn sẽ đối soát và xác nhận tại
              đây.
            </p>
          </div>
        </div>
      </Panel>
    );
  }

  const tone = STATUS_TONE[proof.status];
  const snapshot = proof.sellerBankSnapshot;
  const isPending = proof.status === "pending";

  return (
    <>
      <ConfirmWithReasonDialog
        isOpen={rejectOpen}
        title="Từ chối biên lai"
        description="Người mua sẽ được yêu cầu gửi lại biên lai khác."
        reasonLabel="Lý do từ chối"
        reasonPlaceholder="Ví dụ: chưa thấy tiền vào tài khoản, sai số tiền, ảnh không đọc được..."
        reasonHint="Người mua sẽ nhận được lý do này."
        confirmText="Xác nhận từ chối"
        variant="danger"
        onConfirm={(reason) => {
          setRejectOpen(false);
          onReject(reason);
        }}
        onCancel={() => setRejectOpen(false)}
        isLoading={submitting}
      />

      <Panel
        eyebrow="Thanh toán"
        title="Biên lai chuyển khoản"
        aside={
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-[2px] border px-2.5 py-1 text-2xs font-bold uppercase tracking-[0.18em]",
              tone.chip,
            )}
          >
            <span
              aria-hidden
              className={cn("h-1 w-1 shrink-0 rounded-full", tone.dot)}
            />
            {tone.label}
          </span>
        }
      >
        {/* Số tiền cần đối chiếu */}
        <div className="flex flex-wrap items-end justify-between gap-4 rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 px-4 py-3.5">
          <div>
            <p className={cn(microCaps, "text-neutral-500")}>
              Số tiền cần nhận
            </p>
            <p className="font-droid-serif mt-1.5 text-lg leading-none tabular-nums text-luxury-ink">
              {formatPrice(amount)}
            </p>
          </div>
          {proof.transferredAt ? (
            <div className="text-right">
              <p className={cn(microCaps, "text-neutral-500")}>
                Người mua báo đã chuyển
              </p>
              <p className="mt-1.5 text-xs tabular-nums text-luxury-ink">
                {format(proof.transferredAt)}
              </p>
            </div>
          ) : null}
        </div>

        {/* Tài khoản người mua đã chuyển tới */}
        {snapshot ? (
          <div className="mt-4 space-y-3 border-t border-luxury-ink/8 pt-4">
            <p className={cn(microCaps, "text-neutral-500")}>
              Chuyển tới tài khoản
            </p>
            <MetaRow label="Ngân hàng" value={snapshot.bankName || "—"} />
            <MetaRow
              label="Số tài khoản"
              value={snapshot.accountNumber || "—"}
            />
            <MetaRow
              label="Chủ tài khoản"
              value={snapshot.accountHolder || "—"}
            />
          </div>
        ) : null}

        {/* Ảnh biên lai */}
        {proof.proofImage?.url ? (
          <div className="mt-4 border-t border-luxury-ink/8 pt-4">
            <p className={cn(microCaps, "text-neutral-500")}>Ảnh biên lai</p>
            <a
              href={proof.proofImage.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/proof relative mt-2.5 block aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-cream-50 transition-colors duration-300 hover:border-luxury-ink/30"
            >
              <Image
                src={proof.proofImage.url}
                alt={proof.proofImage.originalName ?? "Biên lai chuyển khoản"}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-contain"
              />
              <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-luxury-ink/0 text-2xs font-bold uppercase tracking-[0.18em] text-transparent transition-all duration-300 group-hover/proof:bg-luxury-ink/50 group-hover/proof:text-cream-50">
                Mở ảnh gốc
                <IconArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </a>
          </div>
        ) : null}

        {/* Lý do từ chối trước đó */}
        {proof.status === "rejected" && proof.rejectReason ? (
          <div className="mt-4 flex gap-3 rounded-[2px] border border-blush-300 bg-blush-50 px-4 py-3.5">
            <IconAlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-blush-600" />
            <div>
              <p className="text-xs font-bold text-blush-800">Lý do từ chối</p>
              <p className="mt-1.5 text-xs leading-relaxed text-blush-800/80">
                {proof.rejectReason}
              </p>
            </div>
          </div>
        ) : null}

        {proof.status === "verified" && proof.verifiedAt ? (
          <p className={cn(microCaps, "mt-4 text-neutral-500")}>
            Xác nhận lúc{" "}
            <span className="text-luxury-ink">{format(proof.verifiedAt)}</span>
          </p>
        ) : null}

        {/* Hành động — chỉ khi còn chờ đối soát */}
        {isPending ? (
          <div className="mt-5 border-t border-luxury-ink/8 pt-5">
            <p className="text-xs leading-relaxed text-neutral-600">
              Chỉ xác nhận khi bạn đã thực sự thấy tiền vào tài khoản. Xác nhận
              sẽ đánh dấu đơn hàng là đã thanh toán.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onVerify}
                disabled={submitting}
                className={cn(primaryAction, "flex-1")}
              >
                <IconCircleCheck className="h-4 w-4" />
                {submitting ? "Đang xử lý…" : "Đã nhận tiền"}
              </button>
              <button
                type="button"
                onClick={() => setRejectOpen(true)}
                disabled={submitting}
                className={dangerAction}
              >
                <IconX className="h-4 w-4" />
                Chưa nhận được
              </button>
            </div>
          </div>
        ) : null}
      </Panel>
    </>
  );
}
