"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { queryKeys } from "@/lib/query-client";
import { announceSession } from "@/lib/session";
import { EmailVerifyIcon } from "@/components/shared";
import VerifyForm from "@/features/auth/verify/components/VerifyForm";

export default function VerifyGoogleEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();


  const pending = searchParams.get("pending");
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  useEffect(() => {
    if (!pending) {
      router.replace("/login?error=google_verify_invalid");
    }
  }, [pending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code || code.length !== 6) {
      setError("Mã xác thực phải có 6 ký tự");
      return;
    }
    if (!pending) {
      setError(
        "Phiên xác minh không hợp lệ. Vui lòng đăng nhập lại bằng Google.",
      );
      return;
    }
    setIsLoading(true);
    try {
      const response = await AuthService.verifyGoogleEmail({ pending, code });
      if (response.status === "success") {
        // Backend đã set cookie phiên trong response này.
        queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
        announceSession("signed-in");
        router.replace("/");
        router.refresh();
      } else {
        setError(response.message || "Mã xác minh không đúng hoặc đã hết hạn.");
      }
    } catch (err: unknown) {
      const errData = err as { response?: { data?: { message?: string } } };
      setError(
        errData.response?.data?.message ||
          "Có lỗi xảy ra. Vui lòng đăng nhập lại bằng Google.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!pending || resendLoading) return;
    setError("");
    setResendMessage("");
    setResendLoading(true);
    try {
      const response = await AuthService.resendGoogleEmailCode({ pending });
      if (response.status === "success") {
        setResendMessage(
          response.message ||
            "Đã gửi lại mã xác minh. Vui lòng kiểm tra cả hộp thư Spam.",
        );
      } else {
        setError(response.message || "Không thể gửi lại mã. Vui lòng thử lại.");
      }
    } catch (err: unknown) {
      const errData = err as { response?: { data?: { message?: string } } };
      setError(
        errData.response?.data?.message ||
          "Không thể gửi lại mã. Vui lòng thử lại.",
      );
    } finally {
      setResendLoading(false);
    }
  };

  if (!pending) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 via-white to-cream-50 p-4 lg:p-8">
      <div className="w-full max-w-md">
        <div className="bg-cream-50/95 backdrop-blur-xl rounded-3xl shadow-xl border-2 border-border p-8 lg:p-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center">
              <EmailVerifyIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-taupe-900 mb-2">
              Xác minh email
            </h2>
            <p className="text-taupe-500">
              Chúng tôi đã gửi mã 6 số đến{" "}
              <span className="font-semibold text-taupe-900">
                {email || "email của bạn"}
              </span>
              . Nhập mã bên dưới để hoàn tất đăng nhập.
            </p>
          </div>

          <VerifyForm
            code={code}
            onCodeChange={setCode}
            error={error}
            onClearError={() => setError("")}
            isLoading={isLoading}
            resendSuccess={Boolean(resendMessage)}
            resendMessage={resendMessage}
            resendLoading={resendLoading}
            onSubmit={handleSubmit}
            onResend={handleResendCode}
            submitLabel="Hoàn tất đăng nhập"
            submitLoadingLabel="Đang xác thực..."
            resendPromptLabel="Không nhận được mã?"
          />
        </div>
      </div>
    </div>
  );
}
