"use client";

import { useState } from "react";
import {
  IconLoader2,
  IconCash,
  IconClock,
} from "@tabler/icons-react";
import { useToast } from "@/components/ui/Toast";
import { format } from "@/utils/format/date";
import { formatPrice } from "@/utils/format/price";
import { useAdminPayouts } from "./hooks/useAdminPayouts";
import type { SellerPayout } from "@/types/order";
import { ADMIN_MESSAGES } from "@/constants/messages";

export default function AdminPayouts() {
  const { payouts, isLoading, error, triggerPayout, isTriggering } = useAdminPayouts();
  const toast = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleTrigger = async (orderId: string) => {
    if (!window.confirm("Xác nhận kích hoạt thanh toán cho seller?")) return;
    setProcessingId(orderId);
    try {
      await triggerPayout(orderId);
      toast.success(ADMIN_MESSAGES.PAYOUT_ACTIVATE_SUCCESS);
    } catch {
      toast.error(ADMIN_MESSAGES.PAYOUT_ACTIVATE_ERROR);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Không tải được danh sách thanh toán.
      </div>
    );
  }

  const totalPending = payouts.reduce((sum: number, p: SellerPayout) => sum + (p.totalAmount || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Quản lý thanh toán Seller</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Kích hoạt payouts cho seller sau khi đơn hàng hoàn thành
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-primary/20 bg-primary/8 p-4 text-center">
          <p className="text-2xl font-bold text-primary">{payouts.length}</p>
          <p className="text-xs text-primary/70 mt-1">Chờ thanh toán</p>
        </div>
        <div className="rounded-xl border border-primary/20 bg-primary/8 p-4 text-center">
          <p className="text-sm font-bold text-primary">{formatPrice(totalPending)}</p>
          <p className="text-xs text-primary/70 mt-1">Tổng số tiền chờ</p>
        </div>
      </div>

      {/* Pending payouts */}
      {payouts.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <IconClock className="w-4 h-4 text-primary" />
            Chờ thanh toán ({payouts.length})
          </h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium">Seller</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Đơn hàng #</th>
                    <th className="text-left px-4 py-3 font-medium">Số tiền</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Hình thức</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Hoàn thành</th>
                    <th className="text-right px-4 py-3 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {(payouts as SellerPayout[]).map((payout) => (
                    <tr key={payout._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{payout.sellerId?.fullName ?? payout.sellerId?.businessName ?? "—"}</p>
                        <p className="text-xs text-muted-foreground">{payout.sellerId?.email ?? ""}</p>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-mono text-xs text-muted-foreground">
                          #{payout._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-foreground">
                        {formatPrice(payout.totalAmount)}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted-foreground capitalize">
                        {payout.paymentMethod ?? "—"}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell text-xs text-muted-foreground">
                        {payout.completedAt ? format(payout.completedAt) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleTrigger(payout._id)}
                          disabled={processingId === payout._id || isTriggering}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors ml-auto"
                        >
                          {processingId === payout._id
                            ? <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
                            : <IconCash className="w-3.5 h-3.5" />}
                          Thanh toán
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <IconCash className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Không có giao dịch thanh toán chờ xử lý</p>
          <p className="text-xs text-muted-foreground mt-1">Payouts sẽ xuất hiện khi đơn hàng hoàn thành</p>
        </div>
      )}
    </div>
  );
}