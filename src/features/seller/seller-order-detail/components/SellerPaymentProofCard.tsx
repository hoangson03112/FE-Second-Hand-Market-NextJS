"use client";

import Image from "next/image";
import { useState } from "react";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconClock,
  IconExternalLink,
  IconReceipt,
  IconX,
} from "@tabler/icons-react";
import { ConfirmWithReasonDialog } from "@/components/ui";
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
      <div className="bg-card rounded-2xl border border-border shadow-sm p-5 flex items-center gap-3">
        <span className="w-4 h-4 rounded-full border-2 border-muted border-t-primary animate-spin shrink-0" />
        <p className="text-sm text-muted-foreground">Đang tải biên lai...</p>
      </div>
    );
  }

  // Người mua chưa chuyển khoản — chưa có gì để đối soát.
  if (!proof) {
    return (
      <div className="bg-card rounded-2xl border border-amber-200 shadow-sm p-5 flex items-start gap-3">
        <IconClock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-amber-700">
            Chờ người mua chuyển khoản
          </p>
          <p className="text-xs text-amber-600 mt-0.5">
            Khi người mua tải biên lai lên, bạn sẽ đối soát và xác nhận tại đây.
          </p>
        </div>
      </div>
    );
  }

  const snapshot = proof.sellerBankSnapshot;
  const isPending = proof.status === "pending";

  const statusStyles = {
    pending: {
      wrap: "border-amber-200",
      head: "bg-amber-50 border-amber-100",
      iconWrap: "bg-amber-100",
      icon: "text-amber-600",
      title: "text-amber-800",
      sub: "text-amber-500",
      label: "Chờ bạn đối soát",
      hint: "Kiểm tra tài khoản ngân hàng của bạn rồi xác nhận",
    },
    verified: {
      wrap: "border-emerald-200",
      head: "bg-emerald-50 border-emerald-100",
      iconWrap: "bg-emerald-100",
      icon: "text-emerald-600",
      title: "text-emerald-800",
      sub: "text-emerald-500",
      label: "Đã xác nhận nhận tiền",
      hint: proof.verifiedAt ? `Xác nhận lúc ${format(proof.verifiedAt)}` : "",
    },
    rejected: {
      wrap: "border-rose-200",
      head: "bg-rose-50 border-rose-100",
      iconWrap: "bg-rose-100",
      icon: "text-rose-600",
      title: "text-rose-800",
      sub: "text-rose-500",
      label: "Đã từ chối biên lai",
      hint: "Người mua có thể gửi lại biên lai khác",
    },
  }[proof.status];

  const StatusIcon =
    proof.status === "verified"
      ? IconCircleCheck
      : proof.status === "rejected"
        ? IconX
        : IconClock;

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

      <div
        className={`bg-card rounded-2xl border ${statusStyles.wrap} overflow-hidden shadow-sm`}
      >
        {/* Header */}
        <div
          className={`flex items-center gap-3 px-5 py-4 border-b ${statusStyles.head}`}
        >
          <div
            className={`w-9 h-9 rounded-xl ${statusStyles.iconWrap} flex items-center justify-center shrink-0`}
          >
            <IconReceipt className={`w-4.5 h-4.5 ${statusStyles.icon}`} />
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-bold ${statusStyles.title}`}>
              Biên lai chuyển khoản
            </p>
            <p className={`text-xs ${statusStyles.sub} mt-0.5 truncate`}>
              {statusStyles.label}
              {statusStyles.hint ? ` — ${statusStyles.hint}` : ""}
            </p>
          </div>
          <StatusIcon
            className={`w-5 h-5 ${statusStyles.icon} shrink-0 ml-auto`}
          />
        </div>

        <div className="p-5 space-y-4">
          {/* Số tiền cần đối chiếu */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Số tiền cần nhận
              </p>
              <p className="text-base font-bold text-foreground mt-0.5">
                {formatPrice(amount)}
              </p>
            </div>
            {proof.transferredAt && (
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Người mua báo đã chuyển
                </p>
                <p className="text-sm text-foreground mt-0.5">
                  {format(proof.transferredAt)}
                </p>
              </div>
            )}
          </div>

          {/* Tài khoản người mua đã chuyển tới */}
          {snapshot && (
            <div className="rounded-xl border border-border bg-muted/30 p-3.5 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Chuyển tới tài khoản
              </p>
              <div className="flex justify-between text-sm gap-3">
                <span className="text-muted-foreground shrink-0">Ngân hàng</span>
                <span className="font-medium text-foreground text-right">
                  {snapshot.bankName || "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm gap-3">
                <span className="text-muted-foreground shrink-0">Số tài khoản</span>
                <span className="font-mono font-bold text-foreground text-right">
                  {snapshot.accountNumber || "—"}
                </span>
              </div>
              <div className="flex justify-between text-sm gap-3">
                <span className="text-muted-foreground shrink-0">Chủ tài khoản</span>
                <span className="font-medium text-foreground text-right truncate">
                  {snapshot.accountHolder || "—"}
                </span>
              </div>
            </div>
          )}

          {/* Ảnh biên lai */}
          {proof.proofImage?.url && (
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Ảnh biên lai
              </p>
              <a
                href={proof.proofImage.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block group/proof"
              >
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-border bg-muted">
                  <Image
                    src={proof.proofImage.url}
                    alt={proof.proofImage.originalName ?? "Biên lai chuyển khoản"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-contain"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover/proof:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="flex items-center gap-1.5 text-white text-xs font-bold opacity-0 group-hover/proof:opacity-100 transition-opacity">
                      <IconExternalLink className="w-3.5 h-3.5" />
                      Mở ảnh gốc
                    </span>
                  </div>
                </div>
              </a>
            </div>
          )}

          {/* Lý do từ chối trước đó */}
          {proof.status === "rejected" && proof.rejectReason && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200">
              <IconAlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-rose-700">Lý do từ chối</p>
                <p className="text-xs text-rose-600 mt-0.5 leading-relaxed">
                  {proof.rejectReason}
                </p>
              </div>
            </div>
          )}

          {/* Hành động — chỉ khi còn chờ đối soát */}
          {isPending && (
            <>
              <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
                Chỉ xác nhận khi bạn đã thực sự thấy tiền vào tài khoản. Xác nhận
                sẽ đánh dấu đơn hàng là đã thanh toán.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRejectOpen(true)}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-destructive/40 text-destructive hover:bg-destructive/5 font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IconX className="w-4 h-4" />
                  Chưa nhận được
                </button>
                <button
                  type="button"
                  onClick={onVerify}
                  disabled={submitting}
                  className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IconCircleCheck className="w-4 h-4" />
                  {submitting ? "Đang xử lý..." : "Xác nhận đã nhận tiền"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
