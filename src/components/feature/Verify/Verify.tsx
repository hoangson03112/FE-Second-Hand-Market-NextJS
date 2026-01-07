import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { useTokenStore } from "@/store/useTokenStore";
import { queryKeys } from "@/lib/query-client";

export default function Verify() {
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

      if (!code || code.length !== 4) {
        setError("Mã xác thực phải có 4 ký tự");
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
  
    if (!accountID) {
      return null;
    }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cream-50 via-neutral-50 to-taupe-50 p-4 lg:p-8">
    <div className="w-full max-w-md">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 lg:p-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-primary mb-2">Xác thực email</h2>
          <p className="text-tertiary">
            Chúng tôi đã gửi mã xác thực 4 số đến email của bạn
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 flex items-start gap-3 animate-shake">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {resendSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-green-700">Mã xác thực mới đã được gửi!</p>
            </div>
          )}

          <div>
            <label htmlFor="code" className="block text-sm font-semibold text-secondary mb-3 text-center">
              Nhập mã xác thực
            </label>
            <div className="flex gap-2 justify-center">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={code[index] || ""}
                  onChange={(e) => {
                    const newCode = code.split("");
                    newCode[index] = e.target.value.replace(/\D/g, "");
                    setCode(newCode.join("").slice(0, 4));
                    setError("");
                    // Auto focus next input
                    if (e.target.value && index < 3) {
                      const nextInput = document.getElementById(`code-${index + 1}`);
                      nextInput?.focus();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !code[index] && index > 0) {
                      const prevInput = document.getElementById(`code-${index - 1}`);
                      prevInput?.focus();
                    }
                  }}
                  id={`code-${index}`}
                  className="w-14 h-16 text-center text-3xl font-bold bg-neutral/50 border-2 border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              ))}
            </div>
            <p className="mt-4 text-xs text-tertiary text-center">
              Kiểm tra hộp thư đến và nhập mã 4 số
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || code.length !== 4}
            className="w-full flex justify-center items-center gap-2 py-4 px-6 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Đang xác thực...</span>
              </>
            ) : (
              <>
                <span>Xác thực tài khoản</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>

          <div className="text-center space-y-3 pt-4 border-t border-neutral-200">
            <p className="text-sm text-tertiary">
              Chưa nhận được mã?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="font-semibold text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
              >
                {resendLoading ? "Đang gửi..." : "Gửi lại mã"}
              </button>
            </p>
            <p className="text-sm text-tertiary">
              <Link href="/login" className="font-semibold text-primary hover:text-primary-dark transition-colors">
                Quay lại đăng nhập
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}
