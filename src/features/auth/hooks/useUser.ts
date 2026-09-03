import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { AuthService } from "@/services/auth.service";
import { queryKeys } from "@/lib/query-client";
import { useHasSession } from "@/components/providers/SessionContext";
import type { AccountInfo } from "@/types/auth";


export function useUser() {
  const hasSession = useHasSession();

  return useQuery<AccountInfo | null>({
    queryKey: queryKeys.users.current(),

    initialData: hasSession ? undefined : null,
    queryFn: async () => {
      try {
        const response = await AuthService.getAccountInfo();
        if (response?.status === "success" && response.account) {
          return response.account;
        }
        return null;
      } catch (error) {
        const status =
          error instanceof AxiosError ? error.response?.status : undefined;


        if (status === 401 || status === 403) {
          return null;
        }


        console.error("Không lấy được thông tin tài khoản:", error);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
