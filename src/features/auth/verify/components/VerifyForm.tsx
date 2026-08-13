import Link from "next/link";
import { ErrorIcon } from "@/components/shared";
import { SuccessIcon } from "@/components/shared";
import { ArrowRightIcon } from "@/components/shared";
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
  onSubmit,
  onResend,
  submitLabel = "Xác thực tài khoản",
  submitLoadingLabel = "Đang xác thực...",
  resendPromptLabel = "Chưa nhận được mã?",
}: VerifyFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 flex items-start gap-3 animate-shake">
          <ErrorIcon className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {resendSuccess && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 rounded-xl p-4 flex items-start gap-3">
          <SuccessIcon className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-700">{resendMessage}</p>
        </div>
      )}

      <VerifyCodeInput
        code={code}
        onCodeChange={onCodeChange}
        onClearError={onClearError}
      />

      <button
        type="submit"
        disabled={isLoading || code.length !== 6}
        className="w-full flex justify-center items-center gap-2 py-4 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>{submitLoadingLabel}</span>
          </>
        ) : (
          <>
            <span>{submitLabel}</span>
            <ArrowRightIcon />
          </>
        )}
      </button>

      <div className="text-center space-y-3 pt-4 border-t-2 border-border">
        <p className="text-sm text-taupe-500">
          {resendPromptLabel}{" "}
          <button
            type="button"
            onClick={onResend}
            disabled={resendLoading}
            className="font-semibold text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
          >
            {resendLoading ? "Đang gửi..." : "Gửi lại mã"}
          </button>
        </p>
        <p className="text-sm text-taupe-500">
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </form>
  );
} 