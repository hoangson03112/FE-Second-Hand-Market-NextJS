import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { OrderService } from "@/services/order.service";
import { useToast } from "@/components/ui/Toast";
import type { Order } from "@/types/order";

export function useSellerOrders() {
  const router = useRouter();
  const toast = useToast();
  const { data: account, isLoading: userLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!userLoading && !account) {
      router.push("/login");
      return;
    }
    if (!account) return;

    const fetchOrders = async () => {
      try {
        const res = await OrderService.getSellerOrders();
        setOrders(res.orders || []);
      } catch (error) {
        console.error("Error fetching seller orders:", error);
        toast.error("Không thể tải đơn hàng");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [account, userLoading, router, toast]);

  const handleUpdateStatus = async (
    orderId: string,
    status: "confirmed" | "cancelled",
    reason?: string
  ) => {
    setUpdatingId(orderId);
    try {
      const { order: updatedOrder } = await OrderService.updateSellerOrder(
        orderId,
        status,
        reason
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, ...(updatedOrder || { status }) } : o
        )
      );
      if (status === "confirmed") {
        toast.success(
          updatedOrder?.ghnOrderCode
            ? "Đã xác nhận đơn hàng và tạo đơn GHN"
            : "Đã xác nhận đơn hàng (chưa tạo được đơn GHN)"
        );
      } else {
        toast.success("Đã hủy đơn hàng");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể cập nhật đơn hàng"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleImageError = (orderId: string) => {
    setImageErrorMap((prev) =>
      prev[orderId] ? prev : { ...prev, [orderId]: true }
    );
  };

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  return {
    account,
    userLoading,
    orders,
    isLoading,
    updatingId,
    activeTab,
    setActiveTab,
    imageErrorMap,
    handleImageError,
    handleUpdateStatus,
    filteredOrders,
  };
}
