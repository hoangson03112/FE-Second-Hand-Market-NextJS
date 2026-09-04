import Link from "next/link";
import React from "react";
import { Input } from "@/components/ui/input";
import InfoBox from "@/features/auth/components/InfoBox";
import { IconArrowRight, IconLock, IconEye, IconEyeOff, IconShieldCheck } from "@tabler/icons-react";

interface ResetPasswordFormProps {
  newPassword: string;
  confirmPassword: string;
  isLoading: boolean;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ResetPasswordForm({
  newPassword,
  confirmPassword,
  isLoading,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/70 p-4">
        <p className="text-2xs font-bold uppercase tracking-[0.15em] text-luxury-ink flex items-center gap-1.5">
          <IconShieldCheck className="w-3.5 h-3.5 text-luxury-ink" />
          Cập nhật mật khẩu mới
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-neutral-600">
          Vui lòng thiết lập mật khẩu mới có độ bảo mật cao để bảo vệ tài khoản giao dịch của bạn.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label
            htmlFor="newPassword"
            className="block text-[11px] uppercase tracking-wider font-bold text-luxury-ink"
          >
            Mật khẩu mới <span className="text-blush-600 ml-0.5">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <IconLock className="h-4 w-4" />
            </div>
            <Input
              id="newPassword"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onNewPasswordChange(e.target.value)
              }
              placeholder="Tối thiểu 6 ký tự"
              required
              className="pl-10 pr-10 h-11 text-xs"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-luxury-ink transition-colors"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirmPassword"
            className="block text-[11px] uppercase tracking-wider font-bold text-luxury-ink"
          >
            Xác nhận mật khẩu mới <span className="text-blush-600 ml-0.5">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <IconLock className="h-4 w-4" />
            </div>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onConfirmPasswordChange(e.target.value)
              }
              placeholder="Nhập lại mật khẩu mới"
              required
              className="pl-10 pr-10 h-11 text-xs"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-luxury-ink transition-colors"
              aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showConfirmPassword ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <InfoBox variant="info" title="Khuyến nghị an toàn:">
        Nên sử dụng kết hợp chữ in hoa, chữ thường, chữ số và ký tự đặc biệt để tối ưu hóa độ an toàn.
      </InfoBox>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 px-8 rounded-[2px] bg-luxury-ink text-luxury-ivory uppercase tracking-[0.15em] text-xs font-bold hover:bg-charcoal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all inline-flex items-center justify-center gap-2"
      >
        <span>{isLoading ? "Đang lưu thay đổi..." : "Lưu mật khẩu mới"}</span>
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
