
import { useQuery } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { queryKeys } from "@/lib/query-client";
import { serverStateConfig } from "@/lib/state";
import { useTokenStore } from "@/store/useTokenStore";
import type { AccountInfo } from "@/types/auth";

export function useUser() {
  const accessToken = useTokenStore((state) => state.accessToken);

  return useQuery<AccountInfo | null>({
    queryKey: queryKeys.users.current(),
    queryFn: async () => {
      if (!accessToken) {
        return null;
      }

      try {
        const response = await AuthService.getAccountInfo();
        if (response.status === "success" && response.account) {
          return response.account;
        }
        return null;
      } catch (error) {
        console.error("Error fetching user account:", error);
        return null;
      }
    },
    enabled: !!accessToken, // Only fetch if user is authenticated
    staleTime: serverStateConfig.staleTime.dynamic, // 1 minute
    gcTime: serverStateConfig.gcTime.dynamic, // 10 minutes
  });
}
