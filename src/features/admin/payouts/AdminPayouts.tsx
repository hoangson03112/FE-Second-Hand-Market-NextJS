"use client";

import { useState } from "react";
import { IconLoader2, IconCash, IconClock, IconCoins, IconBuildingStore } from "@tabler/icons-react";
import { useToast } from "@/components/ui";
import { format } from "@/utils/format/date";
import { formatPrice } from "@/utils/format/price";
import { useAdminPayouts } from "./hooks/useAdminPayouts";
import type { SellerPayout } from "@/types/order";
import { ADMIN_MESSAGES } from "@/constants/messages";
import { PageHeader, NoData, ErrorState } from "@/features/admin/components";
import StatCard from "@/features/admin/dashboard/components/StatCard";

export default function AdminPayouts() {
  const { payouts, isLoading, error, triggerPayout, isTriggering } =
    useAdminPayouts();
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
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <IconLoader2 className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Đang tải danh sách thanh toán...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Không tải được danh sách thanh toán"
        description="Vui lòng kiểm tra quyền truy cập và thử lại."
      />
    );
  }

  const totalPending = payouts.reduce(
    (sum: number, p: SellerPayout) => sum + (p.totalAmount || 0),
    0,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Quản lý thanh toán Seller"
        description="Theo dõi và giải ngân tự động/thủ công cho người bán sau khi đơn hàng hoàn tất thành công."
        badge={
          payouts.length > 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              {payouts.length} khoản chờ giải ngân
            </span>
          ) : null
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Giao dịch chờ thanh toán"
          value={payouts.length.toLocaleString("vi-VN")}
          sub="Đơn hàng đã giao thành công"
          icon={IconClock}
          tone="amber"
        />
        <StatCard
          title="Tổng số tiền chờ giải ngân"
          value={formatPrice(totalPending)}
          sub="Số dư cần kích hoạt chuyển cho seller"
          icon={IconCoins}
          tone="emerald"
        />
      </div>

      {/* Pending payouts table */}
      {payouts.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <IconBuildingStore className="w-4 h-4 text-primary" />
            Danh sách giao dịch chờ giải ngân ({payouts.length})
          </h2>
          <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/80 bg-muted/40">
                    <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                      Seller
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 hidden md:table-cell">
                      Mã đơn
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                      Số tiền
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 hidden sm:table-cell">
                      Hình thức
                    </th>
                    <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80 hidden sm:table-cell">
                      Hoàn thành lúc
                    </th>
                    <th className="text-right px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(payouts as SellerPayout[]).map((payout) => (
                    <tr
                      key={payout._id}
                      className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-foreground">
                          {payout.sellerId?.fullName ??
                            payout.sellerId?.businessName ??
                            "—"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payout.sellerId?.email ?? ""}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="font-mono text-xs text-muted-foreground">
                          #{payout._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-foreground tabular-nums">
                        {formatPrice(payout.totalAmount)}
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell text-xs text-muted-foreground capitalize">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-muted text-foreground font-medium text-[11px]">
                          {payout.paymentMethod ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell text-xs text-muted-foreground">
                        {payout.completedAt ? format(payout.completedAt) : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleTrigger(payout._id)}
                          disabled={processingId === payout._id || isTriggering}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:bg-primary/90 disabled:opacity-50 transition-all shadow-2xs ml-auto"
                        >
                          {processingId === payout._id ? (
                            <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <IconCash className="w-3.5 h-3.5" />
                          )}
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
        <NoData
          icon={<IconCash className="w-10 h-10 text-muted-foreground" />}
          title="Không có giao dịch thanh toán chờ xử lý"
          description="Các khoản payout sẽ tự động xuất hiện tại đây khi đơn hàng được người mua hoàn tất."
        />
      )}
    </div>
  );
}
