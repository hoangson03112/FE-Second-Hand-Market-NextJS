import { Loader2, Lock, KeyRound, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { PasswordFormData } from "../types";
import { PASSWORD_MIN_LENGTH } from "@/constants";

interface PasswordFormProps {
  formData: PasswordFormData;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordForm({
  formData,
  isSubmitting,
  onSubmit,
  onChange,
}: PasswordFormProps) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    if (strength <= 3) return { strength, label: "Trung bình", color: "text-yellow-500" };
    return { strength, label: "Mạnh", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);
  const passwordsMatch = formData.newPassword && formData.confirmPassword && 
                         formData.newPassword === formData.confirmPassword;

  return (
    <div>
      {/* Header with gradient */}
      <div className="relative px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-transparent">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Đổi Mật Khẩu
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Bảo vệ tài khoản của bạn với mật khẩu mạnh
            </p>
          </div>
        </div>
      </div>

      {/* Security tips */}
      <div className="p-6 pb-0">
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
          <div className="flex gap-3">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-foreground">Mẹo bảo mật</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Mật khẩu nên có ít nhất {PASSWORD_MIN_LENGTH} ký tự</li>
                <li>• Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                <li>• Không sử dụng thông tin cá nhân dễ đoán</li>
                <li>• Không chia sẻ mật khẩu cho bất kỳ ai</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="p-6">
        <div className="space-y-6 max-w-3xl">
          {/* Old password */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <KeyRound className="w-4 h-4 text-primary" />
              Mật khẩu hiện tại
              <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                value={formData.oldPassword}
                onChange={onChange}
                className="w-full px-4 py-3 pl-10 pr-12 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Nhập mật khẩu hiện tại"
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary/80"
              >
                {showOldPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
          </div>

          {/* New password */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <KeyRound className="w-4 h-4 text-primary" />
              Mật khẩu mới
              <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={onChange}
                className="w-full px-4 py-3 pl-10 pr-12 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder={`Tối thiểu ${PASSWORD_MIN_LENGTH} ký tự`}
                required
                minLength={PASSWORD_MIN_LENGTH}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary/80"
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
                        passwordStrength.strength <= 3 ? "bg-yellow-500 w-2/3" :
                        "bg-green-500 w-full"
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

          {/* Confirm password */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Xác nhận mật khẩu
              <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={onChange}
                className="w-full px-4 py-3 pl-10 pr-12 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="Nhập lại mật khẩu mới"
                required
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary/80"
              >
                {showConfirmPassword ? "Ẩn" : "Hiện"}
              </button>
            </div>
            {/* Match indicator */}
            {formData.confirmPassword && (
              <div className="mt-2 flex items-center gap-1.5">
                {passwordsMatch ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-xs text-green-500">Mật khẩu khớp</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                    <span className="text-xs text-destructive">Mật khẩu không khớp</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-border pt-6">
            {/* Submit */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="text-destructive">*</span> Thông tin bắt buộc
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Đổi mật khẩu
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
