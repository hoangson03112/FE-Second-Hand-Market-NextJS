"use client";

import { useState } from "react";
import {
  IconLoader2,
  IconCircleCheck,
  IconCircleX,
  IconAlertCircle,
  IconShield,
  IconClock,
  IconEye,
} from "@tabler/icons-react";
import { useToast } from "@/components/ui/Toast";
import { format } from "@/utils/format/date";
import { formatPrice } from "@/utils/format/price";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAdminRefunds, useRefundDetail } from "./hooks/useAdminRefunds";
import { AdminDisputeDetailModal } from "./components/AdminDisputeDetailModal";
import type { RefundRequest } from "@/types/order";
import { ADMIN_MESSAGES } from "@/constants/messages";

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

function getOrderTotal(r: RefundRequest): number {
  const o = r.orderId;
  if (typeof o === "object") return (o as { totalPrice?: number; totalAmount?: number }).totalPrice ?? (o as { totalAmount?: number }).totalAmount ?? 0;
  return 0;
}

export default function AdminRefunds() {
  const {
    refunds,
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
  const [selectedRefundId, setSelectedRefundId] = useState<string | null>(null);

  const { refund: selectedRefund, isLoading: isLoadingDetail } = useRefundDetail(selectedRefundId);

  const disputes = refunds.filter((r: RefundRequest) => r.status === "disputed");
  const pending = refunds.filter((r: RefundRequest) => r.status === "pending");
  const approved = refunds.filter((r: RefundRequest) => r.status === "approved");
  const processed = refunds.filter((r: RefundRequest) =>
    ["rejected", "completed"].includes(r.status)
  );

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

  const handleCompleteRefund = async (orderId: string) => {
    if (!window.confirm("Xác nhận hoàn tiền cho đơn hàng này?")) return;
    setProcessingId(orderId);
    try {
      await approveRefund({ orderId });
      toast.success(ADMIN_MESSAGES.REFUND_APPROVE_SUCCESS);
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
          Xử lý khiếu nại từ người mua (seller từ chối) và duyệt hoàn tiền
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 text-center">
          <p className="text-2xl font-bold text-purple-700">{disputes.length}</p>
          <p className="text-xs text-purple-600 mt-1">Khiếu nại cần xử lý</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{pending.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Chờ người bán</p>
        </div>
        <div className="rounded-xl border border-primary/20 bg-primary/8 p-4 text-center">
          <p className="text-2xl font-bold text-primary">{approved.length}</p>
          <p className="text-xs text-primary/70 mt-1">Đã duyệt, chờ hoàn</p>
        </div>
        <div className="rounded-xl border border-border bg-secondary/60 p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{processed.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Đã xử lý</p>
        </div>
      </div>

      {/* Disputes — buyer escalated, admin must handle */}
      {disputes.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <IconShield className="w-4 h-4 text-purple-600" />
            Khiếu nại cần xử lý ({disputes.length})
          </h2>
          <p className="text-xs text-muted-foreground mb-3">
            Người mua không đồng ý với quyết định từ chối của người bán. Admin xem xét và quyết định cuối.
          </p>
          <div className="rounded-xl border border-purple-200 bg-purple-50/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-purple-200 bg-purple-100/50">
                    <th className="text-left px-4 py-3 font-medium">Đơn hàng</th>
                    <th className="text-left px-4 py-3 font-medium">Người mua</th>
                    <th className="text-left px-4 py-3 font-medium">Người bán</th>
                    <th className="text-left px-4 py-3 font-medium">Lý do / Mô tả</th>
                    <th className="text-left px-4 py-3 font-medium">Số tiền</th>
                    <th className="text-right px-4 py-3 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {disputes.map((refund: RefundRequest) => (
                    <tr key={refund._id} className="border-b border-purple-100 last:border-0 hover:bg-purple-50/50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          #{getOrderId(refund)}
                        </span>
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
                      <td className="px-4 py-3">
                        <span className="text-foreground">{getSellerName(refund)}</span>
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        <p className="text-xs font-medium text-foreground">
                          {REASON_LABELS[refund.reason] ?? refund.reason}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                          {refund.description}
                        </p>
                        {refund.sellerResponse?.comment && (
                          <p className="text-xs text-red-600 mt-1 line-clamp-2">
                            Seller: &ldquo;{refund.sellerResponse.comment}&rdquo;
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {formatPrice(refund.refundAmount ?? getOrderTotal(refund))}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2 flex-wrap">
                          <button
                            onClick={() => setSelectedRefundId(refund._id)}
                            className="flex items-center gap-1 px-3 py-1.5 border border-border text-foreground rounded-lg text-xs font-semibold hover:bg-muted disabled:opacity-50 transition-colors"
                          >
                            <IconEye className="w-3.5 h-3.5" />
                            Xem chi tiết
                          </button>
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
                            Duyệt hoàn tiền
                          </button>
                          <button
                            onClick={() => setRejectModal({ refundId: refund._id })}
                            disabled={processingId === refund._id || isApprovingDispute || isRejectingDispute}
                            className="flex items-center gap-1 px-3 py-1.5 border border-destructive/30 text-destructive rounded-lg text-xs font-semibold hover:bg-destructive/5 disabled:opacity-50 transition-colors"
                          >
                            <IconCircleX className="w-3.5 h-3.5" />
                            Bác bỏ khiếu nại
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Pending — waiting for seller */}
      {pending.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <IconClock className="w-4 h-4 text-amber-600" />
            Chờ người bán xử lý ({pending.length})
          </h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium">Đơn hàng</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Người mua</th>
                    <th className="text-left px-4 py-3 font-medium">Lý do</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((refund: RefundRequest) => (
                    <tr key={refund._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-muted-foreground">#{getOrderId(refund)}</span>
                        <br />
                        <span className="text-xs text-muted-foreground">{format(refund.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">{getBuyerName(refund)}</td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-sm text-foreground line-clamp-2">{refund.reason}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell font-medium text-foreground">
                        {formatPrice(refund.refundAmount ?? getOrderTotal(refund))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Approved — ready to complete refund */}
      {approved.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <IconAlertCircle className="w-4 h-4 text-primary" />
            Đã duyệt, chờ hoàn tiền ({approved.length})
          </h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium">Đơn hàng</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Người mua</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Số tiền</th>
                    <th className="text-right px-4 py-3 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {approved.map((refund: RefundRequest) => {
                    const orderId =
                      typeof refund.orderId === "object" && refund.orderId
                        ? (refund.orderId as { _id?: string })._id ?? ""
                        : typeof refund.orderId === "string"
                          ? refund.orderId
                          : "";
                    return (
                      <tr key={refund._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-muted-foreground">#{getOrderId(refund)}</span>
                          <br />
                          <span className="text-xs text-muted-foreground">{format(refund.updatedAt)}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">{getBuyerName(refund)}</td>
                        <td className="px-4 py-3 hidden sm:table-cell font-medium text-foreground">
                          {formatPrice(refund.refundAmount ?? getOrderTotal(refund))}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleCompleteRefund(orderId)}
                            disabled={processingId === orderId || isApprovingRefund}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                          >
                            {processingId === orderId ? (
                              <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <IconCircleCheck className="w-3.5 h-3.5" />
                            )}
                            Hoàn tiền
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Processed */}
      {processed.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">Đã xử lý ({processed.length})</h2>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium">Đơn hàng</th>
                    <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Người mua</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Số tiền</th>
                    <th className="text-left px-4 py-3 font-medium">Trạng thái</th>
                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {processed.map((refund: RefundRequest) => (
                    <tr key={refund._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-muted-foreground">#{getOrderId(refund)}</span>
                        <br />
                        <span className="text-xs text-muted-foreground">{format(refund.updatedAt)}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-foreground">
                        {getBuyerName(refund)}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell font-medium text-foreground">
                        {formatPrice(refund.refundAmount ?? getOrderTotal(refund))}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={
                            refund.status === "completed"
                              ? "refund_approved"
                              : "cancelled"
                          }
                        />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                        {refund.adminIntervention?.comment ??
                          refund.adminNote ??
                          "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {refunds.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <IconCircleCheck className="w-10 h-10 text-primary mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">Không có yêu cầu hoàn tiền</p>
          <p className="text-xs text-muted-foreground mt-1">Tất cả yêu cầu đã được xử lý</p>
        </div>
      )}

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
