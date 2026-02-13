import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import type { AdminReport } from "@/types/admin";

export function useAdminReports() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "reports"],
    queryFn: () => AdminService.getReports(),
  });

  const reports: AdminReport[] = data?.reports ?? [];

  const toggleExpanded = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return { reports, isLoading, error, expandedId, toggleExpanded };
}

