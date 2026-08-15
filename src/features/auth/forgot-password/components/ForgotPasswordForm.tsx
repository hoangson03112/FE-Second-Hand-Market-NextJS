import Link from "next/link";
import { Input } from "@/components/ui/input";
import InfoBox from "@/features/auth/components/InfoBox";
import { IconArrowRight, IconMail } from "@tabler/icons-react";

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
        <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-taupe-500">
          Bảo mật tài khoản
        </p>
        <p className="mt-2 text-[14px] leading-relaxed text-taupe-700">
          Nhập email đã đăng ký để nhận liên kết đặt lại mật khẩu. Liên kết chỉ
          có hiệu lực trong 15 phút.
        </p>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-[14px] font-bold text-taupe-900"
        >
          Email đã đăng ký <span className="text-destructive ml-1">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <IconMail className="h-5 w-5" />
          </div>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onEmailChange(e.target.value)
            }
            placeholder="VD: email@example.com"
            required
            className="pl-12 pr-4 py-6 border-foreground/20 focus-visible:border-foreground focus-visible:ring-foreground/10 transition-all text-foreground bg-transparent placeholder:text-foreground/40 text-[15px] rounded-xl"
          />
        </div>
      </div>

      <InfoBox variant="warning" title="Lưu ý bảo mật">
        Liên kết đặt lại mật khẩu sẽ được gửi đến email của bạn và{" "}
        <strong>hết hạn sau 15 phút</strong>.
      </InfoBox>

      <button
        type="submit"
        disabled={isLoading}
        className="group relative flex w-full items-center justify-center px-12 py-4 text-sm font-medium uppercase tracking-[0.25em] text-background bg-foreground transition-all duration-300 hover:scale-[1.02] disabled:opacity-70 disabled:hover:scale-100"
        style={{ borderRadius: "3px" }}
      >
        <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md rounded-lg" />
        <span className="relative z-10 flex items-center gap-2">
          {isLoading ? "Đang xử lý..." : "Gửi liên kết đặt lại"}
          {!isLoading && <IconArrowRight className="w-5 h-5" />}
        </span>
      </button>

      <p className="text-center text-[15px] text-taupe-600">
        Nhớ mật khẩu rồi?{" "}
        <Link
          href="/login"
          className="font-bold text-primary hover:text-primary/80 inline-flex items-center gap-1.5 transition-colors"
        >
          Đăng nhập ngay
          <IconArrowRight className="w-4 h-4" />
        </Link>
      </p>
    </form>
  );
}
