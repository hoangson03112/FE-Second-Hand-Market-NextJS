import { Loader2, User, Mail, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import type { ProfileFormData } from "../types";

interface ProfileFormProps {
  formData: ProfileFormData;
  isSubmitting: boolean;
  isGoogleUser: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileForm({
  formData,
  isSubmitting,
  isGoogleUser,
  onSubmit,
  onChange,
}: ProfileFormProps) {
  return (
    <div>
      {/* Header with gradient */}
      <div className="relative px-6 py-5 border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-transparent">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Hồ Sơ Của Tôi
            </h2>
            <p className="text-sm text-muted-foreground mt-1.5">
              Quản lý thông tin cá nhân và bảo mật tài khoản của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Form with enhanced styling */}
      <form onSubmit={onSubmit} className="p-6">
        <div className="space-y-6 max-w-3xl">
          {/* Full name */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <User className="w-4 h-4 text-primary" />
              Họ và tên
              <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={onChange}
                className="w-full px-4 py-3 pl-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="VD: Nguyễn Văn A"
                required
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          {/* Email */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Mail className="w-4 h-4 text-primary" />
              Email
              <span className="text-destructive">*</span>
              {isGoogleUser && (
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-normal">
                  Được quản lý bởi Google
                </span>
              )}
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                readOnly={isGoogleUser}
                disabled={isGoogleUser}
                className={`w-full px-4 py-3 pl-10 rounded-lg border transition-all ${
                  isGoogleUser
                    ? "bg-muted/50 cursor-not-allowed text-muted-foreground border-border/50"
                    : "bg-background border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                }`}
                placeholder="email@example.com"
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              {isGoogleUser && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              )}
            </div>
            {isGoogleUser && (
              <div className="flex items-start gap-2 mt-2 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
                <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Email này được liên kết với tài khoản Google của bạn và không thể thay đổi trực tiếp.
                </p>
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Phone className="w-4 h-4 text-primary" />
              Số điện thoại
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={onChange}
                className="w-full px-4 py-3 pl-10 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                placeholder="VD: 0912 345 678"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Số điện thoại sẽ được sử dụng để liên hệ khi có vấn đề với đơn hàng
            </p>
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
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Lưu thay đổi
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
