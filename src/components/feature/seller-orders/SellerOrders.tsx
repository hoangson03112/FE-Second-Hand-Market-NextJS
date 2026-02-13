"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Package,
  Loader2,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { OrderService } from "@/services/order.service";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import type { Order } from "@/types/order";
import { useToast } from "@/components/ui";

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xử lý",
  delivered: "Đã giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  refund: "Đang hoàn tiền",
  refunded: "Đã hoàn tiền",
};

export default function SellerOrders() {
  const router = useRouter();
  const toast = useToast();
  const { data: account, isLoading: userLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
    status: "delivered" | "cancelled",
    reason?: string
  ) => {
    setUpdatingId(orderId);
    try {
      await OrderService.updateSellerOrder(orderId, status, reason);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status } : o
        )
      );
      toast.success(
        status === "delivered"
          ? "Đã cập nhật đơn hàng đã giao"
          : "Đã hủy đơn hàng"
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể cập nhật đơn hàng"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!account) return null;

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <h1 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
          <Truck className="w-8 h-8" />
          Đơn hàng của tôi (Seller)
        </h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              Chưa có đơn hàng nào
            </p>
            <p className="text-sm text-muted-foreground">
              Đơn hàng sẽ hiển thị khi có người mua sản phẩm của bạn
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const firstProduct = order.products?.[0]?.productId;
              const avatar =
                firstProduct?.avatar?.url ||
                (typeof firstProduct?.avatar === "string"
                  ? firstProduct.avatar
                  : "/placeholder.svg");
              const statusLabel =
                STATUS_LABELS[order.status] || order.status || "Đang xử lý";
              const statusColor =
                order.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : order.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800";
              const canUpdate =
                order.status === "pending" ? true : false;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl border border-border p-4"
                >
                  <Link
                    href={`/orders/${order._id}`}
                    className="block hover:opacity-90"
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                        <Image
                          src={avatar}
                          alt={firstProduct?.name || "Sản phẩm"}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {firstProduct?.name}
                          {order.products && order.products.length > 1
                            ? ` +${order.products.length - 1} sản phẩm khác`
                            : ""}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Người mua: {order.buyerId?.fullName || "—"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold text-primary">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <span
                          className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                    </div>
                  </Link>

                  {canUpdate && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleUpdateStatus(order._id, "delivered");
                        }}
                        disabled={updatingId === order._id}
                        className="flex-1 py-2 px-4 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {updatingId === order._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        Đã giao hàng
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            window.confirm(
                              "Bạn có chắc muốn hủy đơn hàng này?"
                            )
                          ) {
                            handleUpdateStatus(order._id, "cancelled");
                          }
                        }}
                        disabled={updatingId === order._id}
                        className="flex-1 py-2 px-4 border border-red-500 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Hủy đơn
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
