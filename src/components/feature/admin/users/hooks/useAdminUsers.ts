import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import type { AdminAccount } from "@/types/admin";

export function useAdminUsers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "accounts"],
    queryFn: () => AdminService.getAccounts(),
  });

  const accounts: AdminAccount[] = data?.accounts ?? [];

  return { accounts, isLoading, error };
}

