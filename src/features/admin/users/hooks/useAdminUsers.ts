import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import type { AdminAccount } from "@/types/admin";

const PAGE_LIMIT = 20;

export function useAdminUsers() {
  const [search, setSearchState] = useState("");
  const [page, setPageState] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "accounts", { page, search }],
    queryFn: () => AdminService.getAccounts({ page, limit: PAGE_LIMIT, search }),
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

  return { accounts, isLoading, error, search, setSearch, page, setPage, totalPages, totalItems };
}

