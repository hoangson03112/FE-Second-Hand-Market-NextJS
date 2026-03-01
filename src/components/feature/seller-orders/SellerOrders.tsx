"use client";

import {
  IconArrowLeft,
  IconLoader2,
  IconTruck,
} from "@tabler/icons-react";
import Link from "next/link";
import { useSellerOrders } from "./hooks/useSellerOrders";
import OrderTabs from "./components/OrderTabs";
import OrderCard from "./components/OrderCard";
import EmptyOrderState from "./components/EmptyOrderState";

export default function SellerOrders() {
  const {
    account,
    userLoading,
    isLoading,
    activeTab,
    setActiveTab,
    filteredOrders,
    orders,
    imageErrorMap,
    updatingId,
    handleImageError,
    handleUpdateStatus,
  } = useSellerOrders();

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
          <IconArrowLeft className="h-4 w-4" />
          Quay lại
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <IconTruck className="w-8 h-8 text-primary" />
            Quản lý đơn hàng (Seller)
          </h1>
          <p className="text-muted-foreground">
            Xem và cập nhật trạng thái đơn hàng của bạn
          </p>
        </div>

        <OrderTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          orders={orders}
        />

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="text-center">
              <IconLoader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Đang tải đơn hàng...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyOrderState activeTab={activeTab} />
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                imageErrorMap={imageErrorMap}
                updatingId={updatingId}
                onImageError={handleImageError}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

