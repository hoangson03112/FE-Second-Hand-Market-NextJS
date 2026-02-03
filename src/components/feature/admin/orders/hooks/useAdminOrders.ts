import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminService, type AdminOrder } from "@/services/admin.service";

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

