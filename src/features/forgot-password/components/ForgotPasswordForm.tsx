import Link from "next/link";
import InputField from "@/features/auth/InputField";
import ErrorMessage from "@/features/auth/ErrorMessage";
import AuthButton from "@/features/auth/AuthButton";
import InfoBox from "@/components/common/auth/InfoBox";
import { EmailIcon } from "@/components/ui/icons/EmailIcon";
import { ArrowRightIcon } from "@/components/ui/icons/ArrowRightIcon";

interface ForgotPasswordFormProps {
  email: string;
  error: string;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ForgotPasswordForm({
  email,
  error,
  isLoading,
  onEmailChange,
  onSubmit,
}: ForgotPasswordFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <ErrorMessage message={error} />

      <div className="space-y-5">
        <InputField
          id="email"
          name="email"
          type="email"
          label="Email �ã �Ēng ký"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEmailChange(e.target.value)}
          placeholder="VD: email@example.com"
          required
          icon={<EmailIcon />}
        />
      </div>

      <InfoBox variant="warning" title="⏱️ Lưu ý:">
        Link đặt lại mật khẩu sẽ được gửi đến email của bạn và <strong>hết hạn sau 15 phút</strong>.
      </InfoBox>

      <AuthButton isLoading={isLoading}>
        <span>Gửi link đặt lại</span>
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
