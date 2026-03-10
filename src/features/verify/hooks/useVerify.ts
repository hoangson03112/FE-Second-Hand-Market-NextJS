import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { useTokenStore } from "@/store/useTokenStore";
import { queryKeys } from "@/lib/query-client";

export function useVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const accountID = searchParams.get("accountID");
  const { setAccessToken } = useTokenStore();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (!accountID) {
      router.push("/register");
    }
  }, [accountID, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 6) {
      setError("Mã xác thực phải có 6 ký tự");
      return;
    }

    if (!accountID) {
      setError("Thiếu thông tin tài khoản");
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.verify({
        userID: accountID,
        code: code,
      });

      if (response.status === "success" && response.token) {
        // Lưu accessToken vào Zustand store
        // refreshToken đã được backend set vào HttpOnly cookie tự động
        setAccessToken(response.token);

        // Invalidate user query to refetch account info
        queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });

        router.push("/");
        router.refresh();
      } else {
        setError(response.message || "Mã xác thực không đúng hoặc đã hết hạn");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!accountID) return;

    setResendLoading(true);
    setResendSuccess(false);
    setError("");

    try {
      // Note: Backend might need a resend endpoint, for now we'll just show a message
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch {
      setError("Không thể gửi lại mã, vui lòng thử lại sau");
    } finally {
      setResendLoading(false);
    }
  };

  return {
    accountID,
    code,
    setCode,
    error,
    setError,
    isLoading,
    resendLoading,
    resendSuccess,
    handleSubmit,
    handleResend,
  };
}
