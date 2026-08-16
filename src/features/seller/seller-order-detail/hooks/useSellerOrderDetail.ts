"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/features/auth/hooks/useUser";
import { useToast } from "@/components/ui";
import { useConfirm } from "@/components/ui";
import { OrderService } from "@/services/order.service";
import type { ReturnInspectionPayload } from "@/features/seller/components";
import type { Order, PaymentProof } from "@/types/order";

export function useSellerOrderDetail(orderId: string) {
  const router = useRouter();
  const toast = useToast();
  const { confirm } = useConfirm();
  const { data: account, isLoading: userLoading } = useUser();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);

  const [paymentProof, setPaymentProof] = useState<PaymentProof | null>(null);
  const [proofLoading, setProofLoading] = useState(false);
  const [verifyingProof, setVerifyingProof] = useState(false);

  useEffect(() => {
    if (!account) return;
    const load = async () => {
      try {
        const res = await OrderService.getById(orderId);
        setOrder(res.order ?? null);
      } catch {
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [account, orderId]);

  // Chỉ đơn chuyển khoản mới có biên lai. 404 ở đây là trạng thái bình thường
  // (người mua chưa gửi), không phải lỗi — card sẽ hiện "chờ chuyển khoản".
  const isBankTransfer = order?.paymentMethod === "bank_transfer";

  useEffect(() => {
    if (!isBankTransfer) return;
    let cancelled = false;

    const loadProof = async () => {
      setProofLoading(true);
      try {
        const res = await OrderService.getPaymentProof(orderId);
        if (!cancelled) setPaymentProof(res.bankInfo ?? null);
      } catch {
        if (!cancelled) setPaymentProof(null);
      } finally {
        if (!cancelled) setProofLoading(false);
      }
    };
    loadProof();

    return () => {
      cancelled = true;
    };
  }, [isBankTransfer, orderId]);

  // ── Seller confirms order (pending → confirmed) ──────────────────────────
  const handleConfirm = async () => {
    if (!order) return;
    const ok = await confirm({
      title: "Xác nhận đơn hàng",
      message: "Xác nhận và bắt đầu chuẩn bị hàng cho đơn này?",
      confirmText: "Xác nhận",
      cancelText: "Để sau",
      variant: "info",
    });
    if (!ok) return;
    setUpdatingStatus(true);
    try {
      await OrderService.updateSellerOrder(order._id, "confirmed");
      setOrder((prev) => prev ? { ...prev, status: "confirmed" } : null);
      toast.success("Đã xác nhận đơn hàng");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không thể xác nhận đơn");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ── Seller cancels order ─────────────────────────────────────────────────
  const handleCancel = async (reason: string) => {
    if (!order) return;
    setUpdatingStatus(true);
    try {
      await OrderService.updateSellerOrder(order._id, "cancelled", reason);
      setOrder((prev) => prev ? { ...prev, status: "cancelled" } : null);
      setCancelOpen(false);
      toast.success("Đã hủy đơn hàng");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không thể hủy đơn");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ── Seller approves refund ────────────────────────────────────────────────
  const handleApproveRefund = async (note?: string) => {
    if (!order) return;
    setApproveOpen(false);
    setUpdatingStatus(true);
    try {
      await OrderService.approveRefund(order._id, note);
      // Server keeps order.status at "refund" and advances the Refund doc to
      // "return_shipping" (POST /orders/:id/approve-refund). Mirror that shape
      // so the UI does not disagree with the next refetch.
      setOrder((prev) =>
        prev && prev.refundRequestId
          ? {
              ...prev,
              refundRequestId: {
                ...prev.refundRequestId,
                status: "return_shipping",
              },
            }
          : prev,
      );
      toast.success("Đã chấp thuận yêu cầu hoàn tiền");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không thể duyệt hoàn tiền");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ── Seller rejects refund ─────────────────────────────────────────────────
  const handleRejectRefund = async (reason: string) => {
    if (!order) return;
    setRejectOpen(false);
    setUpdatingStatus(true);
    try {
      await OrderService.rejectRefund(order._id, reason);
      // Order status stays refund_requested; only the Refund doc status changes
      setOrder((prev) =>
        prev && prev.refundRequestId
          ? { ...prev, refundRequestId: { ...prev.refundRequestId, status: "rejected" } }
          : prev
      );
      toast.success("Đã từ chối yêu cầu hoàn tiền");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không thể từ chối hoàn tiền");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ── Seller confirms return item received ──────────────────────────────────
  // The inspection result decides where the refund goes: intact goods oblige
  // the seller to transfer the money, anything else hands the case to an admin.
  const handleConfirmReturnReceived = async (inspection?: ReturnInspectionPayload) => {
    if (!order) return;
    setUpdatingStatus(true);
    try {
      await OrderService.confirmReturnReceived(order._id, inspection);
      const isIntact = (inspection?.condition ?? "intact") === "intact";
      // Same shape as approve: only the Refund doc advances.
      setOrder((prev) =>
        prev && prev.refundRequestId
          ? {
              ...prev,
              refundRequestId: {
                ...prev.refundRequestId,
                status: isIntact ? "returned" : "disputed",
              },
            }
          : prev,
      );
      toast.success(
        isIntact
          ? "Đã xác nhận nhận hàng hoàn. Người mua sẽ gửi số tài khoản để bạn chuyển lại tiền."
          : "Đã ghi nhận hàng không nguyên vẹn. Quản trị viên sẽ phân xử.",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không thể xác nhận nhận hàng");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ── Seller đối soát biên lai chuyển khoản ─────────────────────────────────
  // Tiền vào thẳng tài khoản người bán nên chính họ xác nhận. Server duyệt
  // biên lai và đánh dấu đơn "đã thanh toán" trong cùng một lời gọi.
  const handleVerifyProof = async () => {
    if (!order) return;
    const ok = await confirm({
      title: "Xác nhận đã nhận tiền",
      message:
        "Bạn đã kiểm tra và thấy tiền vào tài khoản? Đơn hàng sẽ được đánh dấu là đã thanh toán.",
      confirmText: "Đã nhận tiền",
      cancelText: "Để kiểm tra lại",
      variant: "info",
    });
    if (!ok) return;
    setVerifyingProof(true);
    try {
      const res = await OrderService.verifyPaymentProof(order._id, "verified");
      setPaymentProof(res.bankInfo ?? null);
      setOrder((prev) => (prev ? { ...prev, paymentStatus: "paid" } : null));
      toast.success("Đã xác nhận thanh toán cho đơn hàng");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Không thể xác nhận thanh toán",
      );
    } finally {
      setVerifyingProof(false);
    }
  };

  const handleRejectProof = async (reason: string) => {
    if (!order) return;
    setVerifyingProof(true);
    try {
      const res = await OrderService.verifyPaymentProof(
        order._id,
        "rejected",
        reason,
      );
      setPaymentProof(res.bankInfo ?? null);
      toast.success("Đã từ chối biên lai. Người mua sẽ được thông báo.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không thể từ chối biên lai");
    } finally {
      setVerifyingProof(false);
    }
  };

  // ── Seller marks local_pickup order as delivered ───────────────────────────
  const handleMarkDelivered = async () => {
    if (!order) return;
    const ok = await confirm({
      title: "Xác nhận đã giao hàng",
      message: "Xác nhận người mua đã nhận hàng trực tiếp?",
      confirmText: "Xác nhận",
      cancelText: "Hủy",
      variant: "info",
    });
    if (!ok) return;
    setUpdatingStatus(true);
    try {
      await OrderService.updateSellerOrder(order._id, "delivered");
      setOrder((prev) => prev ? { ...prev, status: "delivered" } : null);
      toast.success("Đã cập nhật trạng thái giao hàng");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không thể cập nhật trạng thái");
    } finally {
      setUpdatingStatus(false);
    }
  };

  return {
    router,
    account,
    userLoading,
    order,
    isLoading,
    updatingStatus,
    cancelOpen,
    setCancelOpen,
    rejectOpen,
    setRejectOpen,
    approveOpen,
    setApproveOpen,
    isBankTransfer,
    paymentProof,
    proofLoading,
    verifyingProof,
    handleConfirm,
    handleCancel,
    handleApproveRefund,
    handleRejectRefund,
    handleConfirmReturnReceived,
    handleMarkDelivered,
    handleVerifyProof,
    handleRejectProof,
  };
}
