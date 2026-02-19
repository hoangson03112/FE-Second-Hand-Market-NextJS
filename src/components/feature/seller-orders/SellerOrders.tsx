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
  User,
  Phone,
  Clock,
} from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { OrderService } from "@/services/order.service";
import { formatPrice } from "@/utils/format/price";
import { format } from "@/utils/format/date";
import type { Order } from "@/types/order";
import { useToast } from "@/components/ui";

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  picked_up: "Đã lấy hàng",
  shipping: "Đang vận chuyển",
  out_for_delivery: "Đang giao hàng",
  delivered: "Đã giao",
  completed: "Hoàn thành",
  failed: "Giao thất bại",
  returned: "Đã hoàn hàng",
  cancelled: "Đã hủy",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-300",
  confirmed: "bg-blue-100 text-blue-800 border-blue-300",
  picked_up: "bg-cyan-100 text-cyan-800 border-cyan-300",
  shipping: "bg-purple-100 text-purple-800 border-purple-300",
  out_for_delivery: "bg-indigo-100 text-indigo-800 border-indigo-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  completed: "bg-green-100 text-green-800 border-green-300",
  failed: "bg-red-100 text-red-800 border-red-300",
  returned: "bg-orange-100 text-orange-800 border-orange-300",
  cancelled: "bg-neutral-100 text-neutral-800 border-neutral-300",
};

export default function SellerOrders() {
  const router = useRouter();
  const toast = useToast();
  const { data: account, isLoading: userLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

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
      await OrderService.updateSellerOrder(orderId, status, reason);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status } : o
        )
      );
      const messages: Record<string, string> = {
        confirmed: "Đã xác nhận đơn hàng và tạo đơn GHN",
        cancelled: "Đã hủy đơn hàng",
      };
      toast.success(messages[status] || "Đã cập nhật trạng thái");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể cập nhật đơn hàng"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(o => o.status === activeTab);

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!account) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Truck className="w-8 h-8 text-primary" />
            Quản lý đơn hàng (Seller)
          </h1>
          <p className="text-muted-foreground">
            Xem và cập nhật trạng thái đơn hàng của bạn
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-cream-50 rounded-2xl border border-border p-1 mb-6 flex gap-1 overflow-x-auto">
          {[
            { key: "all", label: "Tất cả" },
            { key: "pending", label: "Chờ xác nhận" },
            { key: "confirmed", label: "Đã xác nhận" },
            { key: "picked_up", label: "Đã lấy hàng" },
            { key: "shipping", label: "Đang vận chuyển" },
            { key: "out_for_delivery", label: "Đang giao" },
            { key: "delivered", label: "Đã giao" },
            { key: "completed", label: "Hoàn thành" },
          ].map((tab) => {
            const count = tab.key === "all" 
              ? orders.length 
              : orders.filter(o => o.status === tab.key).length;
            
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key 
                      ? "bg-cream-100/30" 
                      : "bg-primary/10 text-primary"
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Đang tải đơn hàng...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-cream-50 rounded-2xl border border-border p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {activeTab === "all" ? "Chưa có đơn hàng nào" : `Không có đơn hàng ${STATUS_LABELS[activeTab]?.toLowerCase()}`}
            </h3>
            <p className="text-sm text-muted-foreground">
              {activeTab === "all" 
                ? "Đơn hàng sẽ hiển thị khi có người mua sản phẩm của bạn" 
                : "Không tìm thấy đơn hàng nào trong trạng thái này"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const firstProduct = order.products?.[0]?.productId;
              const avatar = typeof firstProduct?.avatar === "string"
                ? firstProduct.avatar
                : firstProduct?.avatar?.url || "/placeholder.svg";
              const statusLabel =
                STATUS_LABELS[order.status] || order.status || "Đang xử lý";
              const statusColor = STATUS_COLORS[order.status] || "bg-neutral-100 text-neutral-800 border-neutral-300";

              return (
                <div
                  key={order._id}
                  className="bg-cream-50 rounded-2xl border-2 border-border hover:border-primary/30 p-5 transition-all hover:shadow-lg"
                >
                  <div className="flex gap-4 mb-4">
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0 ring-2 ring-border">
                      <Image
                        src={avatar}
                        alt={firstProduct?.name || "Sản phẩm"}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/orders/${order._id}`}
                        className="font-semibold text-foreground hover:text-primary line-clamp-2 mb-2 block"
                      >
                        {firstProduct?.name}
                        {order.products && order.products.length > 1
                          ? ` +${order.products.length - 1} sản phẩm`
                          : ""}
                      </Link>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>Người mua: <span className="font-medium text-foreground">{order.buyerId?.fullName || "—"}</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{order.buyerId?.phoneNumber || "—"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{format(order.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl font-bold text-primary mb-2">
                        {formatPrice(order.totalAmount)}
                      </p>
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons based on status */}
                  {/* Chỉ hiển thị nút hành động cho đơn PENDING */}
                  {order.status === "pending" && (
                    <div className="flex gap-2 pt-4 border-t border-border">
                      <button
                        onClick={() => handleUpdateStatus(order._id, "confirmed")}
                        disabled={updatingId === order._id}
                        className="flex-1 py-2.5 px-4 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                      >
                        {updatingId === order._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        Xác nhận & tạo đơn GHN
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) {
                            handleUpdateStatus(order._id, "cancelled");
                          }
                        }}
                        disabled={updatingId === order._id}
                        className="flex-1 py-2.5 px-4 border-2 border-red-500 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                      >
                        <XCircle className="w-4 h-4" />
                        Hủy đơn
                      </button>
                    </div>
                  )}

                  {/* Đơn đã xác nhận trở đi: GHN tự động cập nhật qua webhook */}
                  {["confirmed", "picked_up", "shipping", "out_for_delivery"].includes(order.status) && (
                    <div className="pt-4 border-t border-border">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Truck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-blue-900 mb-1">
                              Đơn hàng đang được GHN xử lý
                            </p>
                            <p className="text-xs text-blue-700">
                              Trạng thái sẽ tự động cập nhật khi GHN lấy hàng và vận chuyển
                            </p>
                            {order.ghnOrderCode && (
                              <p className="text-xs text-blue-600 mt-2 font-mono">
                                Mã vận đơn: <span className="font-semibold">{order.ghnOrderCode}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nút xem chi tiết cho tất cả đơn đã hoàn tất hoặc có vấn đề */}
                  {["delivered", "completed", "failed", "returned", "cancelled"].includes(order.status) && (
                    <div className="pt-4 border-t border-border">
                      <Link
                        href={`/orders/${order._id}`}
                        className="w-full py-2.5 px-4 border-2 border-primary text-primary rounded-xl text-sm font-semibold hover:bg-primary/5 flex items-center justify-center gap-2 transition-all"
                      >
                        Xem chi tiết
                        <ChevronRight className="w-4 h-4" />
                      </Link>
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
