import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { AuthService } from "@/services/auth.service";
import { queryKeys } from "@/lib/query-client";
import { clearSessionHint, hasSessionHint } from "@/lib/session";
import type { AccountInfo } from "@/types/auth";

/**
 * Nguồn sự thật duy nhất về người dùng đang đăng nhập.
 *
 * Không đoán trạng thái từ accessToken/refreshToken (cookie httpOnly, JS không
 * đọc được). Chỉ dùng cờ phiên để bỏ qua request thừa với khách vãng lai; còn
 * lại luôn hỏi backend qua /auth/me.
 */
export function useUser() {
  return useQuery<AccountInfo | null>({
    queryKey: queryKeys.users.current(),
    queryFn: async () => {
      // Khách vãng lai: không có cờ phiên thì không gọi mạng lần nào.
      if (!hasSessionHint()) return null;

      try {
        const response = await AuthService.getAccountInfo();
        if (response?.status === "success" && response.account) {
          return response.account;
        }
        clearSessionHint();
        return null;
      } catch (error) {
        const status =
          error instanceof AxiosError ? error.response?.status : undefined;

        // 401/403 ở đây nghĩa là interceptor đã thử refresh và thất bại
        // ⇒ phiên thực sự hết hạn.
        if (status === 401 || status === 403) {
          clearSessionHint();
          return null;
        }

        // Lỗi mạng / 5xx: hiển thị như chưa đăng nhập nhưng GIỮ cờ phiên,
        // để lần refetch sau còn khôi phục được.
        console.error("Không lấy được thông tin tài khoản:", error);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
