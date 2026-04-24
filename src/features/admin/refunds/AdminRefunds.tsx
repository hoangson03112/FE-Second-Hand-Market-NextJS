"use client";

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
import { useToast } from "@/components/shared";
import { format } from "@/utils/format/date";
import { StatusBadge } from "@/components/shared";
import { useAdminRefunds, useRefundDetail } from "./hooks/useAdminRefunds";
import { AdminDisputeDetailModal } from "./components/AdminDisputeDetailModal";
import type { RefundRequest } from "@/types/order";
import { ADMIN_MESSAGES } from "@/constants/messages";
import { Pagination } from "@/components/shared";

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
  const [approveModal, setApproveModal] = useState<{ refundId: string } | null>(null);
  const [approveComment, setApproveComment] = useState("");
  const [rejectModal, setRejectModal] = useState<{ refundId: string } | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [completeRefundModal, setCompleteRefundModal] = useState<{ orderId: string } | null>(null);
  const [selectedRefundId, setSelectedRefundId] = useState<string | null>(null);

  const { refund: selectedRefund, isLoading: isLoadingDetail } = useRefundDetail(selectedRefundId);

  const tabs: Array<{ value: string; label: string; icon: React.ElementType }> = [
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
      await approveDispute({ refundId: approveModal.refundId, comment: approveComment.trim() || undefined });
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
      await rejectDispute({ refundId: rejectModal.refundId, adminNote: rejectNote });
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
        <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        Không tải được danh sách hoàn tiền.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Quản lý hoàn tiền & khiếu nại</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Khiếu nại → sau khi seller nhận hàng hoàn, buyer gửi STK → tại đây admin xác nhận đã chuyển khoản
          (POST complete-refund).
        </p>
      </div>

      {/* Filters */}
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
                  ? "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold border border-primary shrink-0"
                  : "inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-card text-foreground text-xs font-semibold border border-border hover:bg-muted shrink-0"
              }
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium">Đơn hàng</th>
                <th className="text-left px-4 py-3 font-medium">Người mua</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Người bán</th>
                <th className="text-left px-4 py-3 font-medium">Trạng thái</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Lý do</th>
                <th className="text-right px-4 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((refund: RefundRequest) => (
                <tr key={refund._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-muted-foreground">#{getOrderId(refund)}</span>
                    <br />
                    <span className="text-xs text-muted-foreground">{format(refund.createdAt)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-foreground">{getBuyerName(refund)}</span>
                    <br />
                    <span className="text-xs text-muted-foreground">
                      {(refund.buyerId as { email?: string })?.email ?? ""}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-foreground">{getSellerName(refund)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      status={
                        refund.status === "completed"
                          ? "refunded"
                          : refund.status === "rejected"
                            ? "cancelled"
                            : refund.status
                      }
                    />
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground max-w-[240px]">
                    <div className="line-clamp-2">
                      {REASON_LABELS[refund.reason] ?? refund.reason}
                      {refund.description ? ` — ${refund.description}` : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedRefundId(refund._id)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-border text-foreground rounded-lg text-xs font-semibold hover:bg-muted disabled:opacity-50 transition-colors"
                      >
                        <IconEye className="w-3.5 h-3.5" />
                        Chi tiết
                      </button>

                      {refund.status === "disputed" && (
                        <>
                          <button
                            onClick={() => setApproveModal({ refundId: refund._id })}
                            disabled={processingId === refund._id || isApprovingDispute || isRejectingDispute}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                          >
                            {(processingId === refund._id && isApprovingDispute) ? (
                              <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <IconCircleCheck className="w-3.5 h-3.5" />
                            )}
                            Duyệt
                          </button>
                          <button
                            onClick={() => setRejectModal({ refundId: refund._id })}
                            disabled={processingId === refund._id || isApprovingDispute || isRejectingDispute}
                            className="flex items-center gap-1 px-3 py-1.5 border border-destructive/30 text-destructive rounded-lg text-xs font-semibold hover:bg-destructive/5 disabled:opacity-50 transition-colors"
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
                              typeof refund.orderId === "object" && refund.orderId
                                ? (refund.orderId as { _id?: string })._id ?? ""
                                : typeof refund.orderId === "string"
                                  ? refund.orderId
                                  : "";
                            if (!orderId) return;
                            setCompleteRefundModal({ orderId });
                          }}
                          disabled={isApprovingRefund}
                          className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                          <IconCircleCheck className="w-3.5 h-3.5" />
                          Đã chuyển khoản
                        </button>
                      )}
                      {refund.status === "returned" && (
                        <span className="text-[11px] text-muted-foreground max-w-[140px] text-right">
                          Chờ buyer gửi STK
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {refunds.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Dispute detail modal — xem bằng chứng, thông tin đơn, chat với buyer/seller */}
      <AdminDisputeDetailModal
        open={!!selectedRefundId}
        refund={selectedRefund}
        isLoading={isLoadingDetail}
        onClose={() => setSelectedRefundId(null)}
        onApprove={handleOpenApproveFromDetail}
        onReject={handleOpenRejectFromDetail}
        isProcessing={!!processingId}
      />

      {/* Approve dispute modal */}
      {approveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-foreground mb-4">Duyệt khiếu nại & hoàn tiền</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Bạn sẽ chấp thuận khiếu nại và đồng ý hoàn tiền cho người mua. Người bán sẽ không nhận tiền.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Ghi chú <span className="text-muted-foreground text-xs">(tùy chọn)</span>
              </label>
              <textarea
                value={approveComment}
                onChange={(e) => setApproveComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-foreground resize-none"
                placeholder="VD: Bằng chứng ảnh rõ ràng hàng hỏng, chấp thuận hoàn tiền"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setApproveModal(null);
                  setApproveComment("");
                }}
                className="flex-1 py-2 px-4 border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmApprove}
                disabled={processingId !== null}
                className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
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

      {/* Complete refund (đã chuyển khoản) */}
      {completeRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-foreground mb-4">Xác nhận đã chuyển khoản</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Bạn đã chuyển hoàn tiền cho người mua theo STK họ gửi? Hệ thống sẽ đóng yêu cầu hoàn.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCompleteRefundModal(null)}
                disabled={processingId !== null}
                className="flex-1 py-2 px-4 border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmCompleteRefund}
                disabled={processingId !== null}
                className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
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

      {/* Reject dispute modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-foreground mb-4">Bác bỏ khiếu nại</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Bạn sẽ đồng ý với quyết định từ chối của người bán. Người mua sẽ không được hoàn tiền.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Lý do <span className="text-destructive">*</span>
              </label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-foreground resize-none"
                placeholder="Nhập lý do bác bỏ khiếu nại..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setRejectModal(null);
                  setRejectNote("");
                }}
                className="flex-1 py-2 px-4 border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleRejectDispute}
                disabled={!rejectNote.trim() || processingId !== null}
                className="flex-1 py-2 px-4 bg-destructive text-destructive-foreground rounded-xl text-sm font-semibold hover:bg-destructive/90 disabled:opacity-50 transition-colors"
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
