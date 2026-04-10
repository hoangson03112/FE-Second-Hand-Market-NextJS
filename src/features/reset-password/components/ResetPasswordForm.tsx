import Link from "next/link";
import PasswordField from "@/features/auth/PasswordField";
import ErrorMessage from "@/features/auth/ErrorMessage";
import AuthButton from "@/features/auth/AuthButton";
import InfoBox from "@/components/common/auth/InfoBox";
import { ArrowRightIcon } from "@/components/ui/icons/ArrowRightIcon";

interface ResetPasswordFormProps {
  newPassword: string;
  confirmPassword: string;
  error: string;
  isLoading: boolean;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ResetPasswordForm({
  newPassword,
  confirmPassword,
  error,
  isLoading,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: ResetPasswordFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <ErrorMessage message={error} />

      <div className="rounded-2xl border border-taupe-200/70 bg-gradient-to-r from-cream-50 to-taupe-50 p-4 sm:p-5">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-taupe-500">Cập nhật bảo mật</p>
        <p className="mt-2 text-[14px] leading-relaxed text-taupe-700">
          Tạo mật khẩu mới để bảo vệ tài khoản của bạn tốt hơn. Ưu tiên mật khẩu mạnh, khó đoán.
        </p>
      </div>

      <div className="space-y-5">
        <PasswordField
          id="newPassword"
          name="newPassword"
          label="Mật khẩu mới"
          value={newPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNewPasswordChange(e.target.value)}
          placeholder="Tối thiểu 6 ký tự"
          required
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfirmPasswordChange(e.target.value)}
          placeholder="Nhập lại mật khẩu mới"
          required
        />
      </div>

      <InfoBox variant="info" title="Mẹo bảo mật">
        Sử dụng mật khẩu mạnh với ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số.
      </InfoBox>

      <AuthButton isLoading={isLoading}>
        <span>Đổi mật khẩu</span>
        <ArrowRightIcon className="w-5 h-5" />
      </AuthButton>

      <p className="text-center text-[15px] text-taupe-600">
        Nhớ mật khẩu rồi?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 transition-colors"
        >
          Đăng nhập ngay
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </p>
    </form>
  );
}
