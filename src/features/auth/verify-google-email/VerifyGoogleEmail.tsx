"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { AuthService } from "@/services/auth.service";
import { queryKeys } from "@/lib/query-client";
import { announceSession } from "@/lib/session";
import {
  AuthEditorialPanel,
  AuthFormHeader,
  AuthShell,
} from "@/features/auth/components";
import { VERIFY_HIGHLIGHTS } from "@/features/auth/constants";
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
  const [cooldown, setCooldown] = useState(0);

  /* Đếm ngược cooldown gửi lại mã — BE trả về retryAfterSeconds. */
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

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
    if (!pending || resendLoading || cooldown > 0) return;
    setError("");
    setResendMessage("");
    setResendLoading(true);
    try {
      const response = await AuthService.resendGoogleEmailCode({ pending });
      if (response.status === "success") {
        setCode("");
        setResendMessage(
          response.message ||
            "Đã gửi lại mã xác minh. Vui lòng kiểm tra cả hộp thư Spam.",
        );
        setCooldown(response.retryAfterSeconds ?? 60);
      } else {
        setError(response.message || "Không thể gửi lại mã. Vui lòng thử lại.");
      }
    } catch (err: unknown) {
      const errData = err as {
        response?: { data?: { message?: string; retryAfterSeconds?: number } };
      };
      const retryAfter = errData.response?.data?.retryAfterSeconds;
      if (retryAfter) setCooldown(retryAfter);
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
    <AuthShell
      panel={
        <AuthEditorialPanel
          eyebrow="Bước cuối cùng"
          title={
            <>
              Xác nhận rằng
              <span className="block text-accent">đó là bạn.</span>
            </>
          }
          description="Một mã gồm sáu chữ số vừa được gửi tới hộp thư của bạn. Nhập mã để hoàn tất đăng nhập bằng Google."
          highlights={VERIFY_HIGHLIGHTS}
        />
      }
    >
      <AuthFormHeader
        eyebrow="Xác minh"
        title={
          <>
            Kiểm tra
            <br /> <span className="text-accent">hộp thư</span>
          </>
        }
      />

      <p className="-mt-5 mb-9 text-sm leading-relaxed text-neutral-600">
        Chúng tôi đã gửi mã 6 chữ số đến{" "}
        <span className="font-medium text-luxury-ink">
          {email || "email của bạn"}
        </span>
        . Nhập mã bên dưới để hoàn tất đăng nhập.
      </p>

      <VerifyForm
        code={code}
        onCodeChange={setCode}
        error={error}
        onClearError={() => setError("")}
        isLoading={isLoading}
        resendSuccess={Boolean(resendMessage)}
        resendMessage={resendMessage}
        resendLoading={resendLoading}
        cooldown={cooldown}
        onSubmit={handleSubmit}
        onResend={handleResendCode}
        submitLabel="Hoàn tất đăng nhập"
        submitLoadingLabel="Đang xác thực..."
        resendPromptLabel="Không nhận được mã?"
      />
    </AuthShell>
  );
}
