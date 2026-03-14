import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import type { AdminAccount } from "@/types/admin";

const PAGE_LIMIT = 20;
const ACCOUNTS_QUERY_KEY = ["admin", "accounts"];

export function useAdminUsers() {
  const qc = useQueryClient();
  const [search, setSearchState] = useState("");
  const [page, setPageState] = useState(1);
  const [statusFilter, setStatusFilterState] = useState<
    "active" | "inactive" | "banned" | ""
  >("");

  const { data, isLoading, error } = useQuery({
    queryKey: [...ACCOUNTS_QUERY_KEY, { page, search, statusFilter }],
    queryFn: () =>
      AdminService.getAccounts({
        page,
        limit: PAGE_LIMIT,
        search: search || undefined,
        status: statusFilter || undefined,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      accountId,
      status,
      reason,
    }: {
      accountId: string;
      status: "active" | "banned";
      reason?: string;
    }) => AdminService.updateAccountStatus(accountId, status, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ACCOUNTS_QUERY_KEY }),
  });

  const accounts: AdminAccount[] = data?.accounts ?? [];
  const totalPages = data?.pagination?.totalPages ?? 1;
  const totalItems = data?.pagination?.totalItems ?? 0;

  const setSearch = useCallback((q: string) => {
    setSearchState(q);
    setPageState(1);
  }, []);

  const setPage = useCallback(
    (p: number) => setPageState(Math.max(1, Math.min(p, Math.max(1, totalPages)))),
    [totalPages],
  );

  const setStatusFilter = useCallback(
    (s: "active" | "inactive" | "banned" | "") => {
      setStatusFilterState(s);
      setPageState(1);
    },
    [],
  );

  const handleBan = useCallback(
    async (accountId: string, reason?: string) => {
      await updateStatusMutation.mutateAsync({
        accountId,
        status: "banned",
        reason,
      });
    },
    [updateStatusMutation],
  );

  const handleUnban = useCallback(
    async (accountId: string) => {
      await updateStatusMutation.mutateAsync({
        accountId,
        status: "active",
      });
    },
    [updateStatusMutation],
  );

  return {
    accounts,
    isLoading,
    error,
    search,
    setSearch,
    page,
    setPage,
    totalPages,
    totalItems,
    statusFilter,
    setStatusFilter,
    handleBan,
    handleUnban,
    isUpdating: updateStatusMutation.isPending,
  };
}

