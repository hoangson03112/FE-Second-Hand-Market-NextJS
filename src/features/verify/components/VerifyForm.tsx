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
  resendLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
}

export default function VerifyForm({
  code,
  onCodeChange,
  error,
  onClearError,
  isLoading,
  resendSuccess,
  resendLoading,
  onSubmit,
  onResend,
}: VerifyFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      {error && (
        <div className="bg-destructive/8 border-l-4 border-destructive rounded-lg p-4 flex items-start gap-3 animate-shake">
          <ErrorIcon className="text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {resendSuccess && (
        <div className="bg-secondary/60 border-l-4 border-border rounded-lg p-4 flex items-start gap-3">
          <SuccessIcon className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/80">Mã xác thực mới đã được gửi!</p>
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
        className="w-full flex justify-center items-center gap-2 py-4 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>Đang xác thực...</span>
          </>
        ) : (
          <>
            <span>Xác thực tài khoản</span>
            <ArrowRightIcon />
          </>
        )}
      </button>

      <div className="text-center space-y-3 pt-4 border-t border-neutral-200">
        <p className="text-sm text-tertiary">
          Chưa nhận được mã?{" "}
          <button
            type="button"
            onClick={onResend}
            disabled={resendLoading}
            className="font-semibold text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
          >
            {resendLoading ? "Đang gửi..." : "Gửi lại mã"}
          </button>
        </p>
        <p className="text-sm text-tertiary">
          <Link
            href="/login"
            className="font-semibold text-primary hover:text-primary-dark transition-colors"
          >
            Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </form>
  );
}
