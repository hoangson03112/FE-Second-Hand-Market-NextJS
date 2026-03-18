import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import type { AdminAuditLog } from "@/types/admin";

const PAGE_LIMIT = 20;

export function useAdminAuditLogs() {
  const [page, setPageState] = useState(1);
  const [action, setActionState] = useState("all");
  const [targetType, setTargetTypeState] = useState("all");
  const [startDate, setStartDateState] = useState<string | undefined>(undefined);
  const [endDate, setEndDateState] = useState<string | undefined>(undefined);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "audit-logs", { page, action, targetType, startDate, endDate }],
    queryFn: () =>
      AdminService.getAuditLogs({
        page,
        limit: PAGE_LIMIT,
        action,
        targetType,
        startDate,
        endDate,
      }),
  });

  const logs: AdminAuditLog[] = data?.data ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const totalItems = data?.pagination?.totalItems ?? 0;

  const setPage = useCallback(
    (p: number) => setPageState(Math.max(1, Math.min(p, Math.max(1, totalPages)))),
    [totalPages],
  );

  const setAction = useCallback((value: string) => {
    setActionState(value);
    setPageState(1);
  }, []);

  const setTargetType = useCallback((value: string) => {
    setTargetTypeState(value);
    setPageState(1);
  }, []);

  const setDateRange = useCallback((from?: string, to?: string) => {
    setStartDateState(from);
    setEndDateState(to);
    setPageState(1);
  }, []);

  return {
    logs,
    isLoading,
    error,
    page,
    setPage,
    totalPages,
    totalItems,
    action,
    setAction,
    targetType,
    setTargetType,
    startDate,
    endDate,
    setDateRange,
  };
}

