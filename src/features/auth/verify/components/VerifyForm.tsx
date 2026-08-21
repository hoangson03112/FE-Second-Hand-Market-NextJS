"use client";

import Link from "next/link";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";

import { AuthSubmitButton } from "../../components";
import VerifyCodeInput from "./VerifyCodeInput";

interface VerifyFormProps {
  code: string;
  onCodeChange: (code: string) => void;
  error: string;
  onClearError: () => void;
  isLoading: boolean;
  resendSuccess: boolean;
  /** Optional override for the success message text (defaults to "Mã xác thực mới đã được gửi!"). */
  resendMessage?: string;
  resendLoading: boolean;
  /** Số giây còn phải chờ trước khi được gửi lại; 0 = bấm được ngay. */
  cooldown?: number;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
  /** Customize copy for flows that reuse this form (e.g. Google email verification). */
  submitLabel?: string;
  submitLoadingLabel?: string;
  resendPromptLabel?: string;
}

export default function VerifyForm({
  code,
  onCodeChange,
  error,
  onClearError,
  isLoading,
  resendSuccess,
  resendMessage = "Mã xác thực mới đã được gửi!",
  resendLoading,
  cooldown = 0,
  onSubmit,
  onResend,
  submitLabel = "Xác thực tài khoản",
  submitLoadingLabel = "Đang xác thực...",
  resendPromptLabel = "Chưa nhận được mã?",
}: VerifyFormProps) {
  const waiting = cooldown > 0;

  return (
    <form className="space-y-7" onSubmit={onSubmit}>
      {resendSuccess && (
        <div
          role="status"
          className="auth-alert flex items-start gap-3 rounded-[2px] border border-accent/30 bg-accent/5 px-4 py-3.5"
        >
          <IconCheck
            className="mt-px h-4 w-4 shrink-0 text-accent"
            strokeWidth={2}
          />
          <p className="text-[13px] leading-relaxed text-neutral-700">
            {resendMessage}
          </p>
        </div>
      )}

      <VerifyCodeInput
        code={code}
        onCodeChange={onCodeChange}
        onClearError={onClearError}
        hasError={Boolean(error)}
      />

      <AuthSubmitButton
        label={submitLabel}
        loadingLabel={submitLoadingLabel}
        isLoading={isLoading}
        disabled={code.length !== 6}
      />

      <div className="border-t border-luxury-ink/10 pt-6 text-center">
        <p className="text-xs text-neutral-600">{resendPromptLabel}</p>
        <button
          type="button"
          onClick={onResend}
          disabled={resendLoading || waiting}
          className="group mt-2.5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-luxury-ink transition-colors hover:text-taupe-700 disabled:pointer-events-none disabled:text-neutral-400"
        >
          {resendLoading
            ? "Đang gửi..."
            : waiting
              ? `Gửi lại sau ${cooldown}s`
              : "Gửi lại mã"}
          <span
            aria-hidden
            className={`h-px w-6 transition-all duration-300 ${
              waiting ? "bg-neutral-300" : "bg-luxury-champagne group-hover:w-9"
            }`}
          />
        </button>

        <div className="mt-6">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.22em] text-neutral-500 transition-colors hover:text-luxury-ink"
          >
            <IconArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes authAlertIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .auth-alert {
          animation: authAlertIn 0.35s ease-out backwards;
        }
      `}</style>
    </form>
  );
}
