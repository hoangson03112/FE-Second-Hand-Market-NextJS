import { IconLoader2, IconLock, IconShieldCheck, IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";
import { useState } from "react";
import type { PasswordFormData } from "../types";
import { PASSWORD_MIN_LENGTH } from "@/constants";

interface PasswordFormProps {
  formData: PasswordFormData;
  isSubmitting: boolean;
  /** true = tài khoản Google, hiển thị "Thiết lập mật khẩu" (không có ô mật khẩu hiện tại) */
  isGoogleUser?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordForm({
  formData,
  isSubmitting,
  isGoogleUser = false,
  onSubmit,
  onChange,
}: PasswordFormProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const title = isGoogleUser ? "Thiết lập mật khẩu" : "Đổi mật khẩu";
  const description = isGoogleUser
    ? "Đặt mật khẩu để có thể đăng nhập bằng email và mật khẩu (dự phòng khi không dùng Google)."
    : "Bảo vệ tài khoản bằng mật khẩu mạnh";
  const submitLabel = isGoogleUser ? "Thiết lập mật khẩu" : "Đổi mật khẩu";

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (password.length >= PASSWORD_MIN_LENGTH) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*]/.test(password)) strength++;

    if (strength <= 1) return { strength, label: "Yếu", color: "text-destructive" };
    if (strength <= 3) return { strength, label: "Trung bình", color: "text-primary/70" };
    return { strength, label: "Mạnh", color: "text-primary" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);
  const passwordsMatch = formData.newPassword && formData.confirmPassword && 
                         formData.newPassword === formData.confirmPassword;

  return (
    <div>
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {description}
        </p>
      </div>

      <div className="p-6 space-y-4">
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex gap-3">
            <IconShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-foreground">Mẹo bảo mật</h4>
              <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                <li>• Ít nhất {PASSWORD_MIN_LENGTH} ký tự; nên có chữ hoa, thường, số, ký tự đặc biệt</li>
                <li>• Không dùng thông tin cá nhân dễ đoán, không chia sẻ mật khẩu</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground p-3 rounded-xl bg-muted/50 border border-border">
          {isGoogleUser
            ? "Sau khi thiết lập, bạn vẫn có thể đăng nhập bằng Google. Mật khẩu dùng khi đăng nhập bằng email."
            : "Sau khi đổi mật khẩu bạn sẽ nhận email xác nhận. Nếu không phải bạn thực hiện, hãy liên hệ hỗ trợ."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-6 pt-0">
        <div className="space-y-6 max-w-3xl">
          {!isGoogleUser && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Mật khẩu hiện tại <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={formData.oldPassword}
                  onChange={onChange}
                  className="w-full h-11 pl-10 pr-16 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  placeholder="Nhập mật khẩu hiện tại"
                  required
                />
                <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-primary hover:text-primary/80"
                >
                  {showOldPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {isGoogleUser ? "Mật khẩu" : "Mật khẩu mới"} <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={onChange}
                className="w-full h-11 pl-10 pr-16 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                placeholder={isGoogleUser ? `Chọn mật khẩu (tối thiểu ${PASSWORD_MIN_LENGTH} ký tự)` : `Tối thiểu ${PASSWORD_MIN_LENGTH} ký tự`}
                required
                minLength={PASSWORD_MIN_LENGTH}
              />
              <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-primary hover:text-primary/80"
              >
                {showNewPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
            {/* Password strength */}
            {formData.newPassword && (
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        passwordStrength.strength <= 1 ? "bg-destructive w-1/3" :
                        passwordStrength.strength <= 3 ? "bg-primary/60 w-2/3" :
                        "bg-primary w-full"
                      }`}
                    />
                  </div>
                  <span className={`text-xs font-medium ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Xác nhận {isGoogleUser ? "mật khẩu" : "mật khẩu mới"} <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChange}
                className="w-full h-11 pl-10 pr-16 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              <IconLock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-primary hover:text-primary/80"
              >
                {showConfirmPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
            {formData.confirmPassword && (
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                {passwordsMatch ? (
                  <>
                    <IconCircleCheck className="w-3.5 h-3.5 text-primary" />
                    <span className="text-primary">Mật khẩu khớp</span>
                  </>
                ) : (
                  <>
                    <IconAlertTriangle className="w-3.5 h-3.5 text-destructive" />
                    <span className="text-destructive">Mật khẩu không khớp</span>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-border pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              <span className="text-destructive">*</span> Bắt buộc
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2 shrink-0"
            >
              {isSubmitting ? (
                <>
                  <IconLoader2 className="w-4 h-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <IconCircleCheck className="w-4 h-4" />
                  {submitLabel}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
