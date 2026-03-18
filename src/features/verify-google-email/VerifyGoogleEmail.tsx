"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { AuthService } from "@/services/auth.service";
import { useTokenStore } from "@/store/useTokenStore";
import { queryKeys } from "@/lib/query-client";
import { EmailVerifyIcon } from "@/components/ui/icons/EmailVerifyIcon";
import { ErrorIcon } from "@/components/ui/icons/ErrorIcon";
import { ArrowRightIcon } from "@/components/ui/icons/ArrowRightIcon";
import VerifyCodeInput from "@/features/verify/components/VerifyCodeInput";

export default function VerifyGoogleEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { setAccessToken } = useTokenStore();

  const pending = searchParams.get("pending");
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      setError("Phiên xác minh không hợp lệ. Vui lòng đăng nhập lại bằng Google.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await AuthService.verifyGoogleEmail({ pending, code });
      if (response.status === "success" && response.token) {
        setAccessToken(response.token);
        queryClient.invalidateQueries({ queryKey: queryKeys.users.current() });
        router.replace("/");
        router.refresh();
      } else {
        setError(response.message || "Mã xác minh không đúng hoặc đã hết hạn.");
      }
    } catch (err: unknown) {
      const errData = err as { response?: { data?: { message?: string } } };
      setError(
        errData.response?.data?.message ||
          "Có lỗi xảy ra. Vui lòng đăng nhập lại bằng Google."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!pending) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-neutral-50 to-background p-4 lg:p-8">
      <div className="w-full max-w-md">
        <div className="bg-cream-50/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-taupe-200/50 p-8 lg:p-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center">
              <EmailVerifyIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-2">
              Xác minh email
            </h2>
            <p className="text-tertiary">
              Chúng tôi đã gửi mã 6 số đến{" "}
              <span className="font-semibold text-foreground">{email || "email của bạn"}</span>.
              Nhập mã bên dưới để hoàn tất đăng nhập.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-destructive/8 border-l-4 border-destructive rounded-lg p-4 flex items-start gap-3">
                <ErrorIcon className="text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <VerifyCodeInput
              code={code}
              onCodeChange={setCode}
              onClearError={() => setError("")}
            />

            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full flex justify-center items-center gap-2 py-4 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  <span>Đang xác thực...</span>
                </>
              ) : (
                <>
                  <span>Hoàn tất đăng nhập</span>
                  <ArrowRightIcon />
                </>
              )}
            </button>

            <p className="text-center text-sm text-tertiary pt-4 border-t border-neutral-200">
              <Link
                href="/login"
                className="font-semibold text-primary hover:text-primary-dark transition-colors"
              >
                Quay lại đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
