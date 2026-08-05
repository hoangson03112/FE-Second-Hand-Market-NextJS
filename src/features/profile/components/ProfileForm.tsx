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
      <div className="px-6 py-6 border-b border-luxury-ink/10">
        <h2 className="text-2xl text-luxury-ink font-droid-serif">
          Hồ sơ của tôi
        </h2>
        <p className="text-2xs uppercase tracking-[0.13em] font-semibold text-charcoal-400 mt-2">
          Quản lý thông tin cá nhân và bảo mật tài khoản
        </p>
      </div>

      <form onSubmit={onSubmit} className="p-6 lg:p-8">
        <div className="space-y-6 max-w-3xl">
          <div>
            <label className="block text-xs uppercase tracking-wide font-semibold text-luxury-ink mb-2">
              Họ và tên <span className="text-blush-600">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={onChange}
                className="w-full h-11 pl-10 pr-4 rounded-[2px] border border-luxury-ink/20 bg-transparent text-sm outline-none focus:border-luxury-ink focus:ring-1 focus:ring-luxury-ink transition-all"
                placeholder="VD: Nguyễn Văn A"
                required
              />
              <IconUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-600 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide font-semibold text-luxury-ink mb-2">
              Email <span className="text-blush-600">*</span>
              {isGoogleUser && (
                <span className="ml-3 text-2xs uppercase tracking-[0.1em] font-semibold px-2 py-1 rounded-[2px] bg-taupe-50 text-luxury-ink border border-luxury-ink/10">
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
                className={`w-full h-11 pl-10 pr-4 rounded-[2px] border text-sm transition-all ${
                  isGoogleUser
                    ? "bg-muted/50 cursor-not-allowed text-muted-foreground border-luxury-ink/10"
                    : "bg-transparent border-luxury-ink/20 outline-none focus:border-luxury-ink focus:ring-1 focus:ring-luxury-ink"
                }`}
                placeholder="email@example.com"
                required
              />
              <IconMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-600 pointer-events-none" />
              {isGoogleUser && (
                <IconCircleCheck className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-taupe-500 pointer-events-none" />
              )}
            </div>
            {isGoogleUser && (
              <p className=" mt-1 flex items-center gap-2 text-xs text-luxury-ink/80 p-2 rounded-[2px] bg-taupe-50/50 border border-luxury-ink/10">
                <IconAlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                Email liên kết tài khoản Google, không thể thay đổi tại đây.
              </p>
            )}
            {!isGoogleUser && (
              <p className="mt-3 text-xs text-luxury-ink/80 p-3 rounded-[2px] bg-taupe-50/50 border border-luxury-ink/10">
                Thay đổi email sẽ gửi xác nhận tới địa chỉ mới.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide font-semibold text-luxury-ink mb-2">
              Số điện thoại
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={onChange}
                className="w-full h-11 pl-10 pr-4 rounded-[2px] border border-luxury-ink/20 bg-transparent text-sm outline-none focus:border-luxury-ink focus:ring-1 focus:ring-luxury-ink transition-all"
                placeholder="VD: 0912 345 678"
              />
              <IconPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-600 pointer-events-none" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Có thể nhận mã xác nhận khi thay đổi SĐT.
            </p>
          </div>

          <div className="border-t border-luxury-ink/10 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              <span className="text-blush-600">*</span> Bắt buộc
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-8 rounded-[2px] bg-luxury-ink text-white uppercase tracking-[0.2em] text-[11px] font-semibold hover:bg-luxury-ink/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2 shrink-0"
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
