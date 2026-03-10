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

      <div className="space-y-5">
        <PasswordField
          id="newPassword"
          name="newPassword"
          label="Mật khẩu m�:i"
          value={newPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onNewPasswordChange(e.target.value)}
          placeholder="T�i thiỒu 6 ký tự"
          required
        />

        <PasswordField
          id="confirmPassword"
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onConfirmPasswordChange(e.target.value)}
          placeholder="Nhập lại mật khẩu m�:i"
          required
        />
      </div>

      <InfoBox variant="info" title="�x� Mẹo:">
        Sử dụng mật khẩu mạnh v�:i ít nhất 8 ký tự, bao g�m chữ hoa, chữ thường và s�.
      </InfoBox>

      <AuthButton isLoading={isLoading}>
        <span>Đ�"i mật khẩu</span>
        <ArrowRightIcon className="w-5 h-5" />
      </AuthButton>

      <p className="text-center text-[15px] text-taupe-600">
        Nh�: mật khẩu r�i?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 transition-colors"
        >
          ĐĒng nhập ngay
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </p>
    </form>
  );
}
