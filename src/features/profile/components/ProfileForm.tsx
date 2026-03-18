import {
  IconLoader2,
  IconUser,
  IconMail,
  IconPhone,
  IconAlertCircle,
  IconCircleCheck,
} from "@tabler/icons-react";
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
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-xl font-bold text-foreground">Hồ sơ của tôi</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Quản lý thông tin cá nhân và bảo mật tài khoản
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-6">
        <div className="space-y-6 max-w-3xl">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Họ và tên <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={onChange}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                placeholder="VD: Nguyễn Văn A"
                required
              />
              <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email <span className="text-destructive">*</span>
              {isGoogleUser && (
                <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-lg bg-primary/10 text-primary">
                  Quản lý bởi Google
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
                className={`w-full h-11 pl-10 pr-4 rounded-xl border text-sm transition-all ${
                  isGoogleUser
                    ? "bg-muted/50 cursor-not-allowed text-muted-foreground border-border"
                    : "bg-background border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                }`}
                placeholder="email@example.com"
                required
              />
              <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              {isGoogleUser && (
                <IconCircleCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
              )}
            </div>
            {isGoogleUser && (
              <p className="mt-2 flex items-start gap-2 text-xs text-muted-foreground p-3 rounded-xl bg-muted/50 border border-border">
                <IconAlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                Email liên kết tài khoản Google, không thể thay đổi tại đây.
              </p>
            )}
            {!isGoogleUser && (
              <p className="mt-2 text-xs text-muted-foreground p-3 rounded-xl bg-primary/5 border border-primary/10">
                Thay đổi email sẽ gửi xác nhận tới địa chỉ mới.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Số điện thoại
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={onChange}
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-border bg-background text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                placeholder="VD: 0912 345 678"
              />
              <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Có thể nhận mã xác nhận khi thay đổi SĐT.
            </p>
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
                  Đang lưu...
                </>
              ) : (
                <>
                  <IconCircleCheck className="w-4 h-4" />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
