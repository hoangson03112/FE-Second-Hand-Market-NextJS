"use client";

import { useState } from "react";
import {
  IconLoader2,
  IconCash,
  IconClock,
  IconCoins,
  IconBuildingStore,
  IconQrcode,
  IconCopy,
  IconCheck,
  IconX,
  IconSearch,
  IconChecklist,
  IconAlertTriangle,
  IconUser,
  IconCreditCard,
} from "@tabler/icons-react";
import { useToast, useConfirm } from "@/components/ui";
import Pagination from "@/components/ui/Pagination";
import { format } from "@/utils/format/date";
import { formatPrice } from "@/utils/format/price";
import { generateBuyerRefundVietQRImageUrl } from "@/constants/payment";
import { useAdminPayouts } from "./hooks/useAdminPayouts";
import type { AdminOrder } from "@/types/admin";
import { PageHeader, NoData, ErrorState } from "@/features/admin/components";
import StatCard from "@/features/admin/dashboard/components/StatCard";

interface SellerBankDetails {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

function extractSellerBank(order: AdminOrder): SellerBankDetails | null {
  if (
    order.sellerBankInfo &&
    order.sellerBankInfo.bankName &&
    order.sellerBankInfo.accountNumber
  ) {
    return {
      bankName: order.sellerBankInfo.bankName,
      accountNumber: order.sellerBankInfo.accountNumber,
      accountHolder: order.sellerBankInfo.accountHolder || "",
    };
  }
  const seller = order.sellerId as
    | { bankInfo?: { bankName?: string; accountNumber?: string; accountHolder?: string } }
    | null;
  if (seller?.bankInfo && seller.bankInfo.bankName && seller.bankInfo.accountNumber) {
    return {
      bankName: seller.bankInfo.bankName,
      accountNumber: seller.bankInfo.accountNumber,
      accountHolder: seller.bankInfo.accountHolder || "",
    };
  }
  return null;
}

function extractSellerName(order: AdminOrder): { name: string; email: string; phone: string } {
  const seller = order.sellerId as
    | { fullName?: string; email?: string; phoneNumber?: string; businessName?: string }
    | null;
  const name = seller?.fullName || seller?.businessName || "Người bán";
  const email = seller?.email || "";
  const phone = seller?.phoneNumber || "";
  return { name, email, phone };
}

export default function AdminPayouts() {
  const {
    orders,
    pagination,
    isLoading,
    error,
    page,
    setPage,
    payoutStatusFilter,
    setPayoutStatusFilter,
    search,
    setSearch,
    confirmPayout,
    isConfirming,
    confirmingId,
  } = useAdminPayouts();

  const toast = useToast();
  const { confirm } = useConfirm();
  const [selectedQrOrder, setSelectedQrOrder] = useState<AdminOrder | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`Đã sao chép: ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleConfirmPayout = async (order: AdminOrder) => {
    const bank = extractSellerBank(order);
    const seller = extractSellerName(order);

    const ok = await confirm({
      title: "Xác nhận đã chuyển tiền cho người bán",
      message: `Bạn xác nhận đã chuyển số tiền ${formatPrice(order.totalAmount)} tới tài khoản ${
        bank ? `${bank.bankName} - ${bank.accountNumber} (${bank.accountHolder})` : seller.name
      }? Hệ thống sẽ cập nhật trạng thái đã giải ngân và gửi thông báo cho người bán.`,
      confirmText: "Xác nhận đã chuyển",
      cancelText: "Hủy",
      variant: "info",
    });

    if (!ok) return;

    try {
      await confirmPayout(order._id);
      toast.success("Đã xác nhận thanh toán cho người bán thành công!");
      if (selectedQrOrder?._id === order._id) {
        setSelectedQrOrder(null);
      }
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Không thể xác nhận thanh toán. Vui lòng thử lại sau."
      );
    }
  };

  const pendingOrders = orders.filter((o) => o.payoutStatus !== "paid");
  const totalPendingAmount = pendingOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const paidOrdersCount = orders.filter((o) => o.payoutStatus === "paid").length;

  if (isLoading && orders.length === 0) {
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

  const qrBank = selectedQrOrder ? extractSellerBank(selectedQrOrder) : null;
  const qrTransferContent = selectedQrOrder
    ? `THANHTOAN DON HANG ${selectedQrOrder._id.slice(-8).toUpperCase()}`
    : "";

  const qrUrl =
    selectedQrOrder && qrBank
      ? generateBuyerRefundVietQRImageUrl({
          bankName: qrBank.bankName,
          accountNumber: qrBank.accountNumber,
          accountHolder: qrBank.accountHolder,
          amountVnd: selectedQrOrder.totalAmount || 0,
          transferContent: qrTransferContent,
        })
      : null;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tài chính sàn"
        title="Thanh toán cho Người bán (Payouts)"
        description="Đối soát và giải ngân tiền bán hàng trực tiếp về tài khoản ngân hàng của người bán sau khi đơn hàng hoàn thành."
        badge={
          pendingOrders.length > 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.16em] bg-cream-50 text-luxury-ink border border-luxury-ink/10">
              {pendingOrders.length} đơn chờ giải ngân
            </span>
          ) : null
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Đơn chờ giải ngân"
          value={pendingOrders.length.toLocaleString("vi-VN")}
          sub="Đơn hàng đã giao thành công"
          icon={IconClock}
        />
        <StatCard
          title="Tổng tiền chờ giải ngân"
          value={formatPrice(totalPendingAmount)}
          sub="Số tiền cần chuyển khoản cho Seller"
          icon={IconCoins}
        />
        <StatCard
          title="Đã giải ngân trong trang"
          value={paidOrdersCount.toLocaleString("vi-VN")}
          sub="Đơn hàng đã chuyển khoản thành công"
          icon={IconChecklist}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-taupe-100/60 rounded-[2px] border border-luxury-ink/10 w-fit">
          <button
            onClick={() => {
              setPayoutStatusFilter("pending");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] transition-all ${
              payoutStatusFilter === "pending"
                ? "bg-luxury-ink text-luxury-ivory shadow-xs"
                : "text-neutral-600 hover:text-luxury-ink"
            }`}
          >
            Chờ giải ngân ({pendingOrders.length})
          </button>
          <button
            onClick={() => {
              setPayoutStatusFilter("paid");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] transition-all ${
              payoutStatusFilter === "paid"
                ? "bg-luxury-ink text-luxury-ivory shadow-xs"
                : "text-neutral-600 hover:text-luxury-ink"
            }`}
          >
            Đã giải ngân
          </button>
          <button
            onClick={() => {
              setPayoutStatusFilter("all");
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] transition-all ${
              payoutStatusFilter === "all"
                ? "bg-luxury-ink text-luxury-ivory shadow-xs"
                : "text-neutral-600 hover:text-luxury-ink"
            }`}
          >
            Tất cả
          </button>
        </div>

        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc người bán..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full h-9 pl-9 pr-3 text-xs bg-white border border-luxury-ink/15 rounded-[2px] outline-none focus:border-luxury-ink transition-colors placeholder:text-neutral-400"
          />
          <IconSearch className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {orders.length > 0 ? (
        <section className="space-y-4">
          <div className="rounded-[2px] border border-luxury-ink/10 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-luxury-ink/10 bg-cream-50/70">
                    <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Người bán
                    </th>
                    <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Mã đơn / Ngày đặt
                    </th>
                    <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Số tiền nhận
                    </th>
                    <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Thông tin ngân hàng
                    </th>
                    <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Trạng thái
                    </th>
                    <th className="text-right px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const seller = extractSellerName(order);
                    const bank = extractSellerBank(order);
                    const isPaid = order.payoutStatus === "paid";
                    const isRowConfirming = isConfirming && confirmingId === order._id;

                    return (
                      <tr
                        key={order._id}
                        className="border-b border-luxury-ink/6 last:border-0 hover:bg-taupe-50/40 transition-colors"
                      >
                        <td className="px-4 py-3.5">
                          <div className="flex items-start gap-2.5">
                            <div className="w-7 h-7 rounded-[2px] bg-taupe-100 flex items-center justify-center text-luxury-ink font-bold text-xs shrink-0 mt-0.5">
                              <IconUser className="w-4 h-4 text-luxury-ink/70" />
                            </div>
                            <div>
                              <p className="font-semibold text-luxury-ink text-xs leading-snug">
                                {seller.name}
                              </p>
                              {seller.email && (
                                <p className="text-xs text-neutral-500">{seller.email}</p>
                              )}
                              {seller.phone && (
                                <p className="text-xs font-mono text-neutral-400">
                                  {seller.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5">
                          <span className="font-mono text-xs font-semibold text-luxury-ink">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {order.createdAt ? format(order.createdAt) : "—"}
                          </p>
                        </td>

                        <td className="px-4 py-3.5 font-droid-serif font-bold text-luxury-ink tabular-nums text-sm">
                          {formatPrice(order.totalAmount)}
                        </td>

                        <td className="px-4 py-3.5">
                          {bank ? (
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-luxury-ink text-xs">
                                  {bank.bankName}
                                </span>
                                <button
                                  onClick={() => handleCopy(bank.accountNumber, `bank-${order._id}`)}
                                  className="text-neutral-400 hover:text-luxury-ink transition-colors p-0.5"
                                  title="Sao chép số tài khoản"
                                >
                                  {copiedKey === `bank-${order._id}` ? (
                                    <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <IconCopy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </div>
                              <p className="font-mono text-xs font-medium text-neutral-700">
                                {bank.accountNumber}
                              </p>
                              <p className="text-xs uppercase tracking-wider text-neutral-500">
                                {bank.accountHolder}
                              </p>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-amber-50 text-amber-800 border border-amber-200 text-2xs font-semibold">
                              <IconAlertTriangle className="w-3 h-3 text-amber-600" />
                              Chưa có tài khoản Bank
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5">
                          {isPaid ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[2px] bg-emerald-50 text-emerald-800 border border-emerald-200 text-2xs font-bold uppercase tracking-[0.1em]">
                                <IconCheck className="w-3 h-3 text-emerald-700" />
                                Đã thanh toán
                              </span>
                              {order.payoutAt && (
                                <p className="text-[10px] text-neutral-400">
                                  {format(order.payoutAt)}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[2px] bg-amber-50 text-amber-800 border border-amber-200 text-2xs font-bold uppercase tracking-[0.1em]">
                              <IconClock className="w-3 h-3 text-amber-700" />
                              Chờ giải ngân
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {bank && (
                              <button
                                onClick={() => setSelectedQrOrder(order)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-luxury-ink/20 text-luxury-ink rounded-[2px] text-2xs font-bold uppercase tracking-[0.1em] hover:bg-taupe-100 transition-all"
                                title="Mở mã VietQR chuyển khoản"
                              >
                                <IconQrcode className="w-3.5 h-3.5" />
                                <span className="hidden md:inline">VietQR</span>
                              </button>
                            )}

                            {!isPaid && (
                              <button
                                onClick={() => handleConfirmPayout(order)}
                                disabled={isRowConfirming}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-luxury-ink text-luxury-ivory rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-charcoal-800 disabled:opacity-50 transition-all"
                              >
                                {isRowConfirming ? (
                                  <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <IconCash className="w-3.5 h-3.5" />
                                )}
                                Xác nhận
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {pagination.totalPages > 1 && (
            <div className="pt-4 flex justify-center">
              <Pagination
                variant="luxury"
                currentPage={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </section>
      ) : (
        <NoData
          icon={<IconCash className="w-10 h-10 text-neutral-400" />}
          title="Không tìm thấy đơn hàng cần giải ngân"
          description="Các giao dịch hoàn tất sẽ tự động xuất hiện tại đây để Ban Quản Trị đối soát và thanh toán cho người bán."
        />
      )}

      {selectedQrOrder && qrBank && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-ink/60 backdrop-blur-xs">
          <div className="bg-white border border-luxury-ink/15 rounded-[2px] shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-luxury-ink/10 flex items-center justify-between bg-cream-50/70">
              <div>
                <h3 className="font-droid-serif font-bold text-base text-luxury-ink flex items-center gap-2">
                  <IconQrcode className="w-5 h-5 text-luxury-ink" />
                  Mã VietQR chuyển khoản
                </h3>
                <p className="text-2xs uppercase tracking-[0.15em] text-neutral-500 font-semibold mt-0.5">
                  Đơn #{selectedQrOrder._id.slice(-8).toUpperCase()}
                </p>
              </div>
              <button
                onClick={() => setSelectedQrOrder(null)}
                className="text-neutral-400 hover:text-luxury-ink transition-colors p-1"
              >
                <IconX className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {qrUrl && (
                <div className="flex flex-col items-center justify-center p-3 bg-taupe-50/60 rounded-[2px] border border-luxury-ink/10">
                  <img
                    src={qrUrl}
                    alt="VietQR Payout"
                    className="w-56 h-auto rounded-[2px] object-contain shadow-xs"
                  />
                  <p className="text-xs text-neutral-500 mt-2 font-medium">
                    Quét bằng app ngân hàng bất kỳ để tự động điền thông tin
                  </p>
                </div>
              )}

              <div className="space-y-2.5 text-xs bg-cream-50/50 p-4 rounded-[2px] border border-luxury-ink/10">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Ngân hàng:</span>
                  <span className="font-bold text-luxury-ink">{qrBank.bankName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Số tài khoản:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-luxury-ink">{qrBank.accountNumber}</span>
                    <button
                      onClick={() => handleCopy(qrBank.accountNumber, "modal-stk")}
                      className="text-neutral-400 hover:text-luxury-ink"
                    >
                      {copiedKey === "modal-stk" ? (
                        <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <IconCopy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Chủ tài khoản:</span>
                  <span className="font-bold uppercase text-luxury-ink">{qrBank.accountHolder}</span>
                </div>
                <div className="flex items-center justify-between border-t border-luxury-ink/10 pt-2">
                  <span className="text-neutral-500">Số tiền cần chuyển:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-droid-serif font-bold text-sm text-luxury-ink">
                      {formatPrice(selectedQrOrder.totalAmount)}
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(String(selectedQrOrder.totalAmount), "modal-amount")
                      }
                      className="text-neutral-400 hover:text-luxury-ink"
                    >
                      {copiedKey === "modal-amount" ? (
                        <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <IconCopy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-luxury-ink/10 pt-2">
                  <span className="text-neutral-500">Nội dung CK:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-2xs text-luxury-ink">{qrTransferContent}</span>
                    <button
                      onClick={() => handleCopy(qrTransferContent, "modal-content")}
                      className="text-neutral-400 hover:text-luxury-ink"
                    >
                      {copiedKey === "modal-content" ? (
                        <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <IconCopy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedQrOrder(null)}
                  className="px-4 py-2 border border-luxury-ink/20 text-luxury-ink rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-taupe-100 transition-all"
                >
                  Đóng
                </button>
                {selectedQrOrder.payoutStatus !== "paid" && (
                  <button
                    onClick={() => handleConfirmPayout(selectedQrOrder)}
                    disabled={isConfirming}
                    className="px-4 py-2 bg-luxury-ink text-luxury-ivory rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-charcoal-800 disabled:opacity-50 transition-all flex items-center gap-1.5"
                  >
                    {isConfirming ? (
                      <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <IconCheck className="w-3.5 h-3.5" />
                    )}
                    Đã chuyển tiền xong
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
