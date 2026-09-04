import Link from "next/link";
import { Input } from "@/components/ui/input";
import InfoBox from "@/features/auth/components/InfoBox";
import { IconArrowRight, IconMail, IconShieldLock } from "@tabler/icons-react";

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
      <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/70 p-4">
        <p className="text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink flex items-center gap-1.5">
          <IconShieldLock className="w-3.5 h-3.5 text-luxury-ink" />
          Bảo mật tài khoản
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
          Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu an toàn. Liên kết chỉ
          có hiệu lực trong 15 phút.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-[11px] uppercase tracking-wider font-bold text-luxury-ink"
        >
          Email đã đăng ký <span className="text-blush-600 ml-0.5">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <IconMail className="h-4 w-4" />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onEmailChange(e.target.value)
            }
            placeholder="VD: name@domain.com"
            required
            className="pl-10 h-11 text-xs"
          />
        </div>
      </div>

      <InfoBox variant="warning" title="Lưu ý bảo mật:">
        Liên kết khôi phục chỉ được kích hoạt một lần duy nhất và sẽ tự động hết hạn sau 15 phút kể từ lúc gửi.
      </InfoBox>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 px-8 rounded-[2px] bg-luxury-ink text-luxury-ivory uppercase tracking-[0.15em] text-xs font-bold hover:bg-charcoal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2"
      >
        <span>{isLoading ? "Đang gửi yêu cầu..." : "Gửi liên kết đặt lại"}</span>
        {!isLoading && <IconArrowRight className="w-4 h-4" />}
      </button>

      <p className="text-center text-xs text-neutral-500">
        Bạn đã nhớ lại mật khẩu?{" "}
        <Link
          href="/login"
          className="font-bold text-luxury-ink hover:underline inline-flex items-center gap-1 transition-colors"
        >
          Đăng nhập ngay
          <IconArrowRight className="w-3.5 h-3.5" />
        </Link>
      </p>
    </form>
  );
}
