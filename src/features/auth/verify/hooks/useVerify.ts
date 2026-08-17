import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { queryKeys } from "@/lib/query-client";
import { announceSession } from "@/lib/session";
import { useToast } from "@/components/providers/ToastProvider";

export function useVerify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const accountID = searchParams.get("accountID");
  const toast = useToast();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, toast]);

  /* Đếm ngược cooldown gửi lại mã — BE trả về retryAfterSeconds. */
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

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

      if (response.status === "success") {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
        announceSession("signed-in");

        router.replace("/");
        router.refresh();
      } else {
        setError(response.message || "Mã xác thực không đúng hoặc đã hết hạn");
      }
    } catch (err: unknown) {
      const failure = err as {
        response?: {
          data?: { message?: string; code?: string; attemptsLeft?: number };
        };
      };
      const data = failure.response?.data;
      const message = data?.message || "Có lỗi xảy ra, vui lòng thử lại";

      // BE vô hiệu mã sau 5 lần sai — cho người dùng biết còn bao nhiêu lượt
      // thay vì để họ gõ đến khi bị chặn mà không hiểu vì sao.
      setError(
        data?.code === "INVALID_CODE" && typeof data.attemptsLeft === "number"
          ? `${message} (còn ${data.attemptsLeft} lần thử)`
          : message,
      );
      if (data?.code === "ATTEMPTS_EXCEEDED" || data?.code === "CODE_EXPIRED") {
        setCode("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!accountID || resendLoading || cooldown > 0) return;

    setResendLoading(true);
    setResendSuccess(false);
    setError("");

    try {
      const response = await AuthService.resendVerificationCode({ accountID });

      if (response.status === "success") {
        setCode("");
        setResendMessage(response.message);
        setResendSuccess(true);
        setCooldown(response.retryAfterSeconds ?? 60);
        setTimeout(() => setResendSuccess(false), 5000);
      } else {
        setError(response.message || "Không thể gửi lại mã, vui lòng thử lại");
      }
    } catch (err: unknown) {
      const failure = err as {
        response?: { data?: { message?: string; retryAfterSeconds?: number } };
      };
      // 429 do cooldown vẫn trả về số giây còn lại — dựng lại bộ đếm để nút
      // không mời người dùng bấm tiếp vào chỗ chắc chắn bị từ chối.
      const retryAfter = failure.response?.data?.retryAfterSeconds;
      if (retryAfter) setCooldown(retryAfter);
      setError(
        failure.response?.data?.message ||
          "Không thể gửi lại mã, vui lòng thử lại sau",
      );
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
    resendMessage,
    cooldown,
    handleSubmit,
    handleResend,
  };
}
