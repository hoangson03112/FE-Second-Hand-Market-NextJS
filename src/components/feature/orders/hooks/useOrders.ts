"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { OrderService } from "@/services/order.service";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import type { Order } from "@/types/order";

export const ORDER_TABS = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ xác nhận" },
  { key: "processing", label: "Đang xử lý" },
  { key: "shipping", label: "Đang giao" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
] as const;

export function useOrders() {
  const router = useRouter();
  const { data: account, isLoading: userLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const { confirm } = useConfirm();
  const toast = useToast();

  const handleCancel = async (orderId: string) => {
    const ok = await confirm({
      title: "Hủy đơn hàng",
      message: "Bạn có chắc muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.",
      confirmText: "Hủy đơn",
      cancelText: "Giữ lại",
      variant: "danger",
    });
    if (!ok) return;
    setCancellingId(orderId);
    try {
      await OrderService.updateStatus(orderId, "cancelled");
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: "cancelled" } : o)),
      );
      toast.success("Hủy đơn hàng thành công.");
    } catch (err) {
      console.error("Cancel order error:", err);
      toast.error("Hủy đơn thất bại, vui lòng thử lại.");
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    if (!userLoading && !account) {
      router.push("/login");
      return;
    }
    if (!account) return;

    const fetchOrders = async () => {
      try {
        const res = await OrderService.getMyOrders();
        setOrders(res.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [account, userLoading, router]);

  const filteredOrders =
    activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

  return {
    account,
    userLoading,
    orders,
    filteredOrders,
    isLoading,
    activeTab,
    setActiveTab,
    cancellingId,
    handleCancel,
  };
}
