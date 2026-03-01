"use client";

import { IconLoader2 } from "@tabler/icons-react";
import { useAdminOrders } from "./hooks/useAdminOrders";
import EmptyState from "./components/EmptyState";
import OrdersTable from "./components/OrdersTable";

export default function AdminOrders() {
  const { orders, isLoading, error, expandedId, toggleExpanded } =
    useAdminOrders();

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
        Không tải được danh sách đơn hàng.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-foreground">Đơn hàng</h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Xem toàn bộ đơn hàng trong hệ thống
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyState />
      ) : (
        <OrdersTable
          orders={orders}
          expandedId={expandedId}
          onToggleExpanded={toggleExpanded}
        />
      )}
    </div>
  );
}

