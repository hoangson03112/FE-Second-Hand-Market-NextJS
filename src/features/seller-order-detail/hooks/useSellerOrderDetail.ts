"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { OrderService } from "@/services/order.service";
import type { Order } from "@/types/order";

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
      setOrder((prev) => prev ? { ...prev, status: "return_shipping" } : null);
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
  const handleConfirmReturnReceived = async () => {
    if (!order) return;
    setUpdatingStatus(true);
    try {
      await OrderService.confirmReturnReceived(order._id);
      setOrder((prev) => prev ? { ...prev, status: "returned" } : prev);
      toast.success("Đã xác nhận nhận hàng hoàn. Admin sẽ xử lý hoàn tiền cho người mua.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Không thể xác nhận nhận hàng");
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
    handleConfirm,
    handleCancel,
    handleApproveRefund,
    handleRejectRefund,
    handleConfirmReturnReceived,
  };
}
