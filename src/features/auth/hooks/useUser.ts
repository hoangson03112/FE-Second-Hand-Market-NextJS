import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { AuthService } from "@/services/auth.service";
import { queryKeys } from "@/lib/query-client";
import { useHasSession } from "@/components/providers/SessionContext";
import type { AccountInfo } from "@/types/auth";

/**
 * Nguồn sự thật duy nhất về người dùng đang đăng nhập.
 *
 * Cookie phiên là httpOnly nên client không tự kiểm tra được; giá trị
 * `hasSession` do server component đọc và truyền xuống, chỉ dùng để bỏ qua
 * request thừa với khách vãng lai. Còn lại luôn hỏi backend qua /auth/me —
 * kể cả ngay sau khi đăng nhập, vì /auth/login không trả thông tin tài khoản.
 */
export function useUser() {
  const hasSession = useHasSession();

  return useQuery<AccountInfo | null>({
    queryKey: queryKeys.users.current(),
    /*
      Khách vãng lai: gieo sẵn null vào cache để không gọi mạng lần nào.

      Cố ý KHÔNG viết `if (!hasSession) return null` trong queryFn: lúc đăng
      nhập xong, invalidateQueries chạy trước khi component re-render, nên
      queryFn vẫn ôm closure có hasSession = false và trả null — người dùng
      đăng nhập rồi mà UI vẫn hiện như khách. Dùng initialData thì queryFn
      không phụ thuộc state nào, invalidate là fetch thật.
    */
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

        // 401/403 ở đây nghĩa là interceptor đã thử refresh và thất bại
        // ⇒ phiên thực sự hết hạn. Backend đã xoá cookie qua Set-Cookie.
        if (status === 401 || status === 403) {
          return null;
        }

        // Lỗi mạng / 5xx: hiển thị như chưa đăng nhập, nhưng cookie phiên vẫn
        // còn nguyên nên lần refetch sau khôi phục được.
        console.error("Không lấy được thông tin tài khoản:", error);
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}
