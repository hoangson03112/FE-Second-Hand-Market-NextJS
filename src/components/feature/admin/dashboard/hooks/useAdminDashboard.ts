import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import type { DashboardStats } from "@/types/admin";

export function useAdminDashboard() {
  const { data: stats, isLoading, error } = useQuery<DashboardStats, Error>({
    queryKey: ["admin", "dashboard"],
    queryFn: () => AdminService.getDashboardStats(),
  });

  return {
    stats,
    isLoading,
    error,
  };
}
