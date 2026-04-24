import Link from "next/link";
import InputField from "@/features/auth/InputField";
import AuthButton from "@/features/auth/AuthButton";
import InfoBox from "@/components/common/auth/InfoBox";
import { EmailIcon } from "@/components/shared";
import { ArrowRightIcon } from "@/components/shared";

interface ForgotPasswordFormProps {
  email: string;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ForgotPasswordForm({
  email,
  isLoading,
  onEmailChange,
  onSubmit,
}: ForgotPasswordFormProps) {
  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="rounded-2xl border border-taupe-200/70 bg-gradient-to-r from-cream-50 to-taupe-50 p-4 sm:p-5">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-taupe-500">Bảo mật tài khoản</p>
        <p className="mt-2 text-[14px] leading-relaxed text-taupe-700">
          Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu. Liên kết chỉ có hiệu lực trong 15 phút.
        </p>
      </div>

      <div className="space-y-5">
        <InputField
          id="email"
          name="email"
          type="email"
          label="Email đã đăng ký"
          value={email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEmailChange(e.target.value)}
          placeholder="VD: email@example.com"
          required
          icon={<EmailIcon />}
        />
      </div>

      <InfoBox variant="warning" title="Lưu ý bảo mật">
        Liên kết đặt lại mật khẩu sẽ được gửi đến email của bạn và <strong>hết hạn sau 15 phút</strong>.
      </InfoBox>

      <AuthButton isLoading={isLoading}>
        <span>Gửi liên kết đặt lại</span>
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
