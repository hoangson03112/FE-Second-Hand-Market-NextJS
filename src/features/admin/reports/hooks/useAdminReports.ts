import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import type { AdminReport } from "@/types/admin";

const PAGE_LIMIT = 20;

export function useAdminReports() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPageState] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "reports", { page }],
    queryFn: () => AdminService.getReports({ page, limit: PAGE_LIMIT }),
  });

  const reports: AdminReport[] = data?.reports ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;

  const setPage = useCallback(
    (p: number) => setPageState(Math.max(1, Math.min(p, Math.max(1, totalPages)))),
    [totalPages],
  );

  const toggleExpanded = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return { reports, isLoading, error, expandedId, toggleExpanded, page, setPage, totalPages };
}

