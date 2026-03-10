"use client";

import { useState } from "react";
import { IconLoader2, IconCircleCheck, IconCircleX, IconAlertCircle } from "@tabler/icons-react";
import { useToast } from "@/components/ui/Toast";
import { format } from "@/utils/format/date";
import { formatPrice } from "@/utils/format/price";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAdminRefunds } from "./hooks/useAdminRefunds";
import type { RefundRequest } from "@/types/order";
import { ADMIN_MESSAGES } from "@/constants/messages";

export default function AdminRefunds() {
  const { refunds, isLoading, error, approveRefund, rejectRefund } = useAdminRefunds();
  const toast = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [rejectModal, setRejectModal] = useState<{ refundId: string } | null>(null);
  const [rejectNote, setRejectNote] = useState("");

  const handleApprove = async (orderId: string) => {
    if (!window.confirm("Xác nhận duyệt hoàn tiền cho đơn hàng này?")) return;
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

  const handleReject = async () => {
    if (!rejectModal || !rejectNote.trim()) return;
    setProcessingId(rejectModal.refundId);
    try {
      await rejectRefund({ refundId: rejectModal.refundId, adminNote: rejectNote });
      toast.success(ADMIN_MESSAGES.REFUND_REJECT_SUCCESS);
      setRejectModal(null);
      setRejectNote("");
    } catch {
      toast.error(ADMIN_MESSAGES.REFUND_REJECT_ERROR);
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

  const pending = refunds.filter((r: RefundRequest) => r.status === "pending");
  const processed = refunds.filter((r: RefundRequest) => r.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-foreground">Quản lý hoàn tiền</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Duyệt hoặc từ chối yêu cầu hoàn tiền từ người mua
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{refunds.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Tổng yêu cầu</p>
        </div>
        <div className="rounded-xl border border-primary/20 bg-primary/8 p-4 text-center">
          <p className="text-2xl font-bold text-primary">{pending.length}</p>
          <p className="text-xs text-primary/70 mt-1">Chờ xử lý</p>
        </div>
        <div className="rounded-xl border border-border bg-secondary/60 p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{processed.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Đã xử lý</p>
        </div>
      </div>

      {/* Pending refunds */}
      {pending.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <IconAlertCircle className="w-4 h-4 text-primary" />
            Chờ xử lý ({pending.length})
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
                    <th className="text-right px-4 py-3 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((refund: RefundRequest) => (
                    <tr key={refund._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          #{refund.orderId?._id?.slice(-8).toUpperCase() ?? "—"}
                        </span>
                        <br />
                        <span className="text-xs text-muted-foreground">{format(refund.createdAt)}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-foreground">{refund.orderId?.buyerId?.fullName ?? "—"}</span>
                        <br />
                        <span className="text-xs text-muted-foreground">{refund.orderId?.buyerId?.email ?? ""}</span>
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <p className="text-sm text-foreground line-clamp-2">{refund.reason}</p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell font-medium text-foreground">
                        {formatPrice(refund.orderId?.totalAmount ?? 0)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleApprove(refund.orderId._id)}
                            disabled={processingId === refund.orderId._id}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                          >
                            {processingId === refund.orderId._id
                              ? <IconLoader2 className="w-3.5 h-3.5 animate-spin" />
                              : <IconCircleCheck className="w-3.5 h-3.5" />}
                            Duyệt
                          </button>
                          <button
                            onClick={() => setRejectModal({ refundId: refund._id })}
                            disabled={processingId === refund.orderId._id}
                            className="flex items-center gap-1 px-3 py-1.5 border border-destructive/30 text-destructive rounded-lg text-xs font-semibold hover:bg-destructive/5 disabled:opacity-50 transition-colors"
                          >
                            <IconCircleX className="w-3.5 h-3.5" />
                            Từ chối
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

      {/* Processed refunds */}
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
                    <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Ghi chú admin</th>
                  </tr>
                </thead>
                <tbody>
                  {processed.map((refund: RefundRequest) => (
                    <tr key={refund._id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-muted-foreground">
                          #{refund.orderId?._id?.slice(-8).toUpperCase() ?? "—"}
                        </span>
                        <br />
                        <span className="text-xs text-muted-foreground">{format(refund.updatedAt)}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-foreground">
                        {refund.orderId?.buyerId?.fullName ?? "—"}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell font-medium text-foreground">
                        {formatPrice(refund.orderId?.totalAmount ?? 0)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={refund.status === "approved" ? "refund_approved" : "cancelled"}
                        />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                        {refund.adminNote ?? "—"}
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

      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-base font-bold text-foreground mb-4">Từ chối hoàn tiền</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Lý do từ chối <span className="text-destructive">*</span>
              </label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 rounded-xl border border-border bg-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-foreground resize-none"
                placeholder="Nhập lý do từ chối yêu cầu hoàn tiền..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setRejectModal(null); setRejectNote(""); }}
                className="flex-1 py-2 px-4 border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectNote.trim() || processingId !== null}
                className="flex-1 py-2 px-4 bg-destructive text-destructive-foreground rounded-xl text-sm font-semibold hover:bg-destructive/90 disabled:opacity-50 transition-colors"
              >
                {processingId ? <IconLoader2 className="w-4 h-4 animate-spin mx-auto" /> : "Từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
