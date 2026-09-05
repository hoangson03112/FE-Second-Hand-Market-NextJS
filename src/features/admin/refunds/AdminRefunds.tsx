"use client";

import { OrderStatusBadge } from "@/features/order/components";
import { useState } from "react";
import {
  IconLoader2,
  IconCircleCheck,
  IconCircleX,
  IconShield,
  IconClock,
  IconEye,
  IconTruck,
} from "@tabler/icons-react";
import { useToast } from "@/components/ui";
import { format } from "@/utils/format/date";
import { useAdminRefunds, useRefundDetail } from "./hooks/useAdminRefunds";
import { AdminDisputeDetailModal } from "./components/AdminDisputeDetailModal";
import type { RefundRequest } from "@/types/order";
import { ADMIN_MESSAGES } from "@/constants/messages";
import { Pagination } from "@/components/ui";
import { PageHeader } from "@/features/admin/components";

const REASON_LABELS: Record<string, string> = {
  damaged: "Hàng bị hỏng",
  wrong_item: "Giao sai hàng",
  not_as_described: "Không đúng mô tả",
  missing_parts: "Thiếu phụ kiện",
  quality_issue: "Chất lượng kém",
  other: "Lý do khác",
};

function getBuyerName(r: RefundRequest): string {
  const b = r.buyerId;
  if (typeof b === "object" && b?.fullName) return b.fullName;
  return "—";
}

function getSellerName(r: RefundRequest): string {
  const s = r.sellerId;
  if (typeof s === "object" && s?.fullName) return s.fullName;
  return "—";
}

function getOrderId(r: RefundRequest): string {
  const o = r.orderId;
  if (typeof o === "object" && o?._id) return o._id.slice(-8).toUpperCase();
  return "—";
}

export default function AdminRefunds() {
  const {
    refunds,
    page,
    setPage,
    totalPages,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    approveDispute,
    rejectDispute,
    approveRefund,
    isApprovingDispute,
    isRejectingDispute,
    isApprovingRefund,
  } = useAdminRefunds();
  const toast = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [approveModal, setApproveModal] = useState<{ refundId: string } | null>(
    null,
  );
  const [approveComment, setApproveComment] = useState("");
  const [rejectModal, setRejectModal] = useState<{ refundId: string } | null>(
    null,
  );
  const [rejectNote, setRejectNote] = useState("");
  const [completeRefundModal, setCompleteRefundModal] = useState<{
    orderId: string;
  } | null>(null);
  const [selectedRefundId, setSelectedRefundId] = useState<string | null>(null);

  const { refund: selectedRefund, isLoading: isLoadingDetail } =
    useRefundDetail(selectedRefundId);

  const tabs: Array<{ value: string; label: string; icon: React.ElementType }> =
    [
      { value: "", label: "Tất cả", icon: IconEye },
      { value: "disputed", label: "Khiếu nại", icon: IconShield },
      { value: "pending", label: "Chờ seller", icon: IconClock },
      { value: "return_shipping", label: "Hoàn GHN", icon: IconTruck },
      { value: "returned", label: "Chờ STK buyer", icon: IconClock },
      { value: "processing", label: "Chờ CK admin", icon: IconCircleCheck },
      { value: "completed", label: "Đã xử lý", icon: IconCircleX },
    ];

  const handleConfirmApprove = async () => {
    if (!approveModal) return;
    setProcessingId(approveModal.refundId);
    try {
      await approveDispute({
        refundId: approveModal.refundId,
        comment: approveComment.trim() || undefined,
      });
      toast.success("Đã chấp thuận khiếu nại, hoàn tiền cho người mua.");
      setApproveModal(null);
      setApproveComment("");
      setSelectedRefundId(null);
    } catch {
      toast.error(ADMIN_MESSAGES.REFUND_APPROVE_ERROR);
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectDispute = async () => {
    if (!rejectModal || !rejectNote.trim()) return;
    setProcessingId(rejectModal.refundId);
    try {
      await rejectDispute({
        refundId: rejectModal.refundId,
        adminNote: rejectNote,
      });
      toast.success(ADMIN_MESSAGES.REFUND_REJECT_SUCCESS);
      setRejectModal(null);
      setRejectNote("");
      setSelectedRefundId(null);
    } catch {
      toast.error(ADMIN_MESSAGES.REFUND_REJECT_ERROR);
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenApproveFromDetail = () => {
    if (selectedRefundId) {
      setSelectedRefundId(null);
      setApproveModal({ refundId: selectedRefundId });
    }
  };

  const handleOpenRejectFromDetail = () => {
    if (selectedRefundId) {
      setSelectedRefundId(null);
      setRejectModal({ refundId: selectedRefundId });
    }
  };

  const handleConfirmCompleteRefund = async () => {
    if (!completeRefundModal) return;
    const { orderId } = completeRefundModal;
    setProcessingId(orderId);
    try {
      await approveRefund({ orderId });
      toast.success(ADMIN_MESSAGES.REFUND_APPROVE_SUCCESS);
      setCompleteRefundModal(null);
    } catch {
      toast.error(ADMIN_MESSAGES.REFUND_APPROVE_ERROR);
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <IconLoader2 className="h-8 w-8 animate-spin text-luxury-ink" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2px] border border-rose-200 bg-white px-4 py-3 text-sm text-rose-800">
        Không tải được danh sách hoàn tiền.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Khiếu nại & Tranh chấp"
        title="Quản lý hoàn tiền & khiếu nại"
        description="Xử lý tranh chấp, duyệt khiếu nại và xác nhận chuyển khoản hoàn tiền sau khi người mua gửi STK."
        badge={
          refunds.length > 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-[2px] text-2xs font-bold uppercase tracking-[0.16em] bg-cream-50 text-luxury-ink border border-luxury-ink/10">
              {refunds.length} yêu cầu
            </span>
          ) : null
        }
      />

      {/* Filter Tabs: Quiet Luxury */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = statusFilter === t.value;
          return (
            <button
              key={t.value || "all"}
              type="button"
              onClick={() => setStatusFilter(t.value)}
              className={
                active
                  ? "inline-flex items-center gap-2 px-3.5 py-2 rounded-[2px] bg-luxury-ink text-luxury-ivory text-2xs font-bold uppercase tracking-[0.14em] shrink-0"
                  : "inline-flex items-center gap-2 px-3.5 py-2 rounded-[2px] bg-white text-neutral-600 text-2xs font-bold uppercase tracking-[0.14em] border border-luxury-ink/10 hover:bg-taupe-50 hover:text-luxury-ink shrink-0"
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-[2px] border border-luxury-ink/10 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-luxury-ink/10 bg-cream-50/70">
                <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                  Đơn hàng
                </th>
                <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                  Người mua
                </th>
                <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden md:table-cell">
                  Người bán
                </th>
                <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                  Trạng thái
                </th>
                <th className="text-left px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 hidden lg:table-cell">
                  Lý do
                </th>
                <th className="text-right px-4 py-3.5 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((refund: RefundRequest) => (
                <tr
                  key={refund._id}
                  className="border-b border-luxury-ink/6 last:border-0 hover:bg-taupe-50/40 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-neutral-500">
                      #{getOrderId(refund)}
                    </span>
                    <br />
                    <span className="text-xs text-neutral-500">
                      {format(refund.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-luxury-ink font-medium text-xs">
                      {getBuyerName(refund)}
                    </span>
                    <br />
                    <span className="text-xs text-neutral-500">
                      {(refund.buyerId as { email?: string })?.email ?? ""}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-luxury-ink text-xs font-medium">
                      {getSellerName(refund)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <OrderStatusBadge
                      status={
                        refund.status === "completed"
                          ? "refunded"
                          : refund.status === "rejected"
                            ? "cancelled"
                            : refund.status
                      }
                    />
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell text-xs text-neutral-500 max-w-[240px]">
                    <div className="line-clamp-2">
                      {REASON_LABELS[refund.reason] ?? refund.reason}
                      {refund.description ? ` — ${refund.description}` : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex justify-end gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedRefundId(refund._id)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-luxury-ink/15 text-luxury-ink rounded-[2px] text-2xs font-bold uppercase tracking-[0.1em] hover:bg-taupe-50 disabled:opacity-50 transition-colors"
                      >
                        <IconEye className="w-3.5 h-3.5" />
                        Chi tiết
                      </button>

                      {refund.status === "disputed" && (
                        <>
                          <button
                            onClick={() =>
                              setApproveModal({ refundId: refund._id })
                            }
                            disabled={
                              processingId === refund._id ||
                              isApprovingDispute ||
                              isRejectingDispute
                            }
                            className="flex items-center gap-1 px-3 py-1.5 bg-accent text-white rounded-[2px] text-2xs font-bold uppercase tracking-[0.1em] hover:opacity-90 disabled:opacity-50 transition-colors"
                          >
                            {processingId === refund._id &&
                            isApprovingDispute ? (
                              <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <IconCircleCheck className="w-3.5 h-3.5" />
                            )}
                            Duyệt
                          </button>
                          <button
                            onClick={() =>
                              setRejectModal({ refundId: refund._id })
                            }
                            disabled={
                              processingId === refund._id ||
                              isApprovingDispute ||
                              isRejectingDispute
                            }
                            className="flex items-center gap-1 px-3 py-1.5 border border-rose-300 text-rose-700 rounded-[2px] text-2xs font-bold uppercase tracking-[0.1em] hover:bg-rose-50 disabled:opacity-50 transition-colors"
                          >
                            <IconCircleX className="w-3.5 h-3.5" />
                            Bác bỏ
                          </button>
                        </>
                      )}

                      {refund.status === "processing" && (
                        <button
                          onClick={() => {
                            const orderId =
                              typeof refund.orderId === "object" &&
                              refund.orderId
                                ? ((refund.orderId as { _id?: string })._id ??
                                  "")
                                : typeof refund.orderId === "string"
                                  ? refund.orderId
                                  : "";
                            if (!orderId) return;
                            setCompleteRefundModal({ orderId });
                          }}
                          disabled={isApprovingRefund}
                          className="flex items-center gap-1 px-3.5 py-1.5 bg-luxury-ink text-luxury-ivory rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-charcoal-800 disabled:opacity-50 transition-colors"
                        >
                          <IconCircleCheck className="w-3.5 h-3.5" />
                          Đã chuyển khoản
                        </button>
                      )}
                      {refund.status === "returned" && (
                        <span className="text-xs text-neutral-500 max-w-[140px] text-right">
                          Chờ buyer gửi STK
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {refunds.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-xs text-neutral-500"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <AdminDisputeDetailModal
        open={!!selectedRefundId}
        refund={selectedRefund}
        isLoading={isLoadingDetail}
        onClose={() => setSelectedRefundId(null)}
        onApprove={handleOpenApproveFromDetail}
        onReject={handleOpenRejectFromDetail}
        isProcessing={!!processingId}
      />

      {approveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-ink/60 backdrop-blur-xs">
          <div className="bg-white rounded-[2px] border border-luxury-ink/10 shadow-2xl max-w-md w-full p-6">
            <h3 className="font-droid-serif text-lg font-bold text-luxury-ink mb-2">
              Duyệt khiếu nại & hoàn tiền
            </h3>
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
              Bạn sẽ chấp thuận khiếu nại và đồng ý hoàn tiền cho người mua.
              Người bán sẽ không nhận tiền.
            </p>
            <div className="mb-4">
              <label className="block text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 mb-2">
                Ghi chú <span className="text-neutral-400 lowercase font-normal">(tùy chọn)</span>
              </label>
              <textarea
                value={approveComment}
                onChange={(e) => setApproveComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-[2px] border border-luxury-ink/15 bg-cream-50/50 focus:border-luxury-ink focus:outline-none text-xs text-luxury-ink resize-none"
                placeholder="VD: Bằng chứng ảnh rõ ràng hàng hỏng, chấp thuận hoàn tiền"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setApproveModal(null);
                  setApproveComment("");
                }}
                className="flex-1 py-2 px-4 border border-luxury-ink/15 text-luxury-ink rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-taupe-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmApprove}
                disabled={processingId !== null}
                className="flex-1 py-2 px-4 bg-luxury-ink text-luxury-ivory rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-charcoal-800 disabled:opacity-50 transition-colors"
              >
                {processingId ? (
                  <IconLoader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Chấp thuận"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {completeRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-ink/60 backdrop-blur-xs">
          <div className="bg-white rounded-[2px] border border-luxury-ink/10 shadow-2xl max-w-md w-full p-6">
            <h3 className="font-droid-serif text-lg font-bold text-luxury-ink mb-2">
              Xác nhận đã chuyển khoản
            </h3>
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
              Bạn đã chuyển hoàn tiền cho người mua theo STK họ gửi? Hệ thống sẽ
              đóng yêu cầu hoàn.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCompleteRefundModal(null)}
                disabled={processingId !== null}
                className="flex-1 py-2 px-4 border border-luxury-ink/15 text-luxury-ink rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-taupe-50 transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmCompleteRefund}
                disabled={processingId !== null}
                className="flex-1 py-2 px-4 bg-luxury-ink text-luxury-ivory rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-charcoal-800 disabled:opacity-50 transition-colors"
              >
                {processingId === completeRefundModal.orderId ? (
                  <IconLoader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Xác nhận"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-luxury-ink/60 backdrop-blur-xs">
          <div className="bg-white rounded-[2px] border border-luxury-ink/10 shadow-2xl max-w-md w-full p-6">
            <h3 className="font-droid-serif text-lg font-bold text-luxury-ink mb-2">
              Bác bỏ khiếu nại
            </h3>
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
              Bạn sẽ đồng ý với quyết định từ chối của người bán. Người mua sẽ
              không được hoàn tiền.
            </p>
            <div className="mb-4">
              <label className="block text-2xs font-bold uppercase tracking-[0.15em] text-neutral-600 mb-2">
                Lý do <span className="text-rose-600">*</span>
              </label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-[2px] border border-luxury-ink/15 bg-cream-50/50 focus:border-luxury-ink focus:outline-none text-xs text-luxury-ink resize-none"
                placeholder="Nhập lý do bác bỏ khiếu nại..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRejectModal(null);
                  setRejectNote("");
                }}
                className="flex-1 py-2 px-4 border border-luxury-ink/15 text-luxury-ink rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-taupe-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleRejectDispute}
                disabled={!rejectNote.trim() || processingId !== null}
                className="flex-1 py-2 px-4 bg-rose-700 text-white rounded-[2px] text-2xs font-bold uppercase tracking-[0.12em] hover:bg-rose-800 disabled:opacity-50 transition-colors"
              >
                {processingId ? (
                  <IconLoader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Bác bỏ"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
