import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { queryKeys } from "@/lib/query-client";
import { announceSession } from "@/lib/session";
import {
  clearVerificationSession,
  readVerificationSession,
} from "@/lib/verification-session";
import { useToast } from "@/components/providers/ToastProvider";

export function useVerify() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();


  const [session, setSession] = useState(() =>
    typeof window === "undefined" ? null : readVerificationSession(),
  );
  const verificationToken = session?.token ?? null;
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


  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);


  useEffect(() => {
    if (!verificationToken) {
      router.push("/login");
    }
  }, [verificationToken, router]);


  const abandonSession = () => {
    clearVerificationSession();
    setSession(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code || code.length !== 6) {
      setError("Mã xác thực phải có 6 ký tự");
      return;
    }

    if (!verificationToken) {
      setError("Phiên xác minh đã hết hạn, vui lòng đăng nhập lại");
      return;
    }

    setIsLoading(true);

    try {
      const response = await AuthService.verify({
        verificationToken,
        code: code,
      });

      if (response.status === "success") {

        clearVerificationSession();
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


      setError(
        data?.code === "INVALID_CODE" && typeof data.attemptsLeft === "number"
          ? `${message} (còn ${data.attemptsLeft} lần thử)`
          : message,
      );
      if (data?.code === "ATTEMPTS_EXCEEDED" || data?.code === "CODE_EXPIRED") {
        setCode("");
      }
      if (data?.code === "SESSION_EXPIRED") {
        abandonSession();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!verificationToken || resendLoading || cooldown > 0) return;

    setResendLoading(true);
    setResendSuccess(false);
    setError("");

    try {
      const response = await AuthService.resendVerificationCode({
        verificationToken,
      });

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
        response?: {
          data?: {
            message?: string;
            code?: string;
            retryAfterSeconds?: number;
          };
        };
      };
      const data = failure.response?.data;


      if (data?.retryAfterSeconds) setCooldown(data.retryAfterSeconds);
      setError(data?.message || "Không thể gửi lại mã, vui lòng thử lại sau");
      if (data?.code === "SESSION_EXPIRED") {
        abandonSession();
      }
    } finally {
      setResendLoading(false);
    }
  };

  return {
    verificationToken,
    maskedEmail: session?.maskedEmail,
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
