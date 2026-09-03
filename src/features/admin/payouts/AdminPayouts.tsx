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
          <IconLoader2 className="h-9 w-9 animate-spin text-luxury-ink" />
          <p className="text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
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
      <PageHeader
        eyebrow="Tài chính sàn"
        title="Quản lý thanh toán Seller"
        description="Theo dõi và giải ngân tự động/thủ công cho người bán sau khi đơn hàng hoàn tất thành công."
        badge={
          payouts.length > 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.16em] bg-cream-50 text-luxury-ink border border-luxury-ink/10">
              {payouts.length} khoản chờ giải ngân
            </span>
          ) : null
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Giao dịch chờ thanh toán"
          value={payouts.length.toLocaleString("vi-VN")}
          sub="Đơn hàng đã giao thành công"
          icon={IconClock}
        />
        <StatCard
          title="Tổng số tiền chờ giải ngân"
          value={formatPrice(totalPending)}
          sub="Số dư cần kích hoạt chuyển cho seller"
          icon={IconCoins}
        />
      </div>

      {payouts.length > 0 ? (
        <section className="space-y-3">
          <h2 className="font-droid-serif text-base font-bold text-luxury-ink flex items-center gap-2">
            <IconBuildingStore className="w-4 h-4 text-luxury-ink" />
            Danh sách giao dịch chờ giải ngân ({payouts.length})
          </h2>
          <div className="rounded-[2px] border border-luxury-ink/10 bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-luxury-ink/10 bg-cream-50/70">
                    <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Seller
                    </th>
                    <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden md:table-cell">
                      Mã đơn
                    </th>
                    <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Số tiền
                    </th>
                    <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden sm:table-cell">
                      Hình thức
                    </th>
                    <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden sm:table-cell">
                      Hoàn thành lúc
                    </th>
                    <th className="text-right px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(payouts as SellerPayout[]).map((payout) => (
                    <tr
                      key={payout._id}
                      className="border-b border-luxury-ink/6 last:border-0 hover:bg-taupe-50/40 transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-luxury-ink text-xs">
                          {payout.sellerId?.fullName ??
                            payout.sellerId?.businessName ??
                            "—"}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {payout.sellerId?.email ?? ""}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="font-mono text-xs text-neutral-500">
                          #{payout._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-droid-serif font-bold text-luxury-ink tabular-nums text-sm">
                        {formatPrice(payout.totalAmount)}
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell text-xs text-neutral-500 capitalize">
                        <span className="inline-block px-2 py-0.5 rounded-[2px] bg-cream-50 text-luxury-ink border border-luxury-ink/8 font-medium text-[11px]">
                          {payout.paymentMethod ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell text-xs text-neutral-500">
                        {payout.completedAt ? format(payout.completedAt) : "—"}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleTrigger(payout._id)}
                          disabled={processingId === payout._id || isTriggering}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-luxury-ink text-luxury-ivory rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-charcoal-800 disabled:opacity-50 transition-all ml-auto"
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
          icon={<IconCash className="w-10 h-10 text-neutral-400" />}
          title="Không có giao dịch thanh toán chờ xử lý"
          description="Các khoản payout sẽ tự động xuất hiện tại đây khi đơn hàng được người mua hoàn tất."
        />
      )}
    </div>
  );
}
