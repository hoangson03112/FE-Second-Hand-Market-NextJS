import { useQuery } from "@tanstack/react-query";
import { AdminService, type AdminAccount } from "@/services/admin.service";

export function useAdminUsers() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "accounts"],
    queryFn: () => AdminService.getAccounts(),
  });

  const accounts: AdminAccount[] = data?.accounts ?? [];

  return { accounts, isLoading, error };
}

