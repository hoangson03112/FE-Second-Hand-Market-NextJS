import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import type { AdminOrder } from "@/types/admin";

export function useAdminOrders() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "orders"],
    queryFn: () => AdminService.getOrders(),
  });

  const orders: AdminOrder[] = data?.orders ?? [];

  const toggleExpanded = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return {
    orders,
    isLoading,
    error,
    expandedId,
    toggleExpanded,
  };
}

