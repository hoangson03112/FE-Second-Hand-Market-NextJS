import Link from "next/link";
import { IconAlertTriangle, IconArrowRight, IconArrowLeft } from "@tabler/icons-react";

interface InvalidTokenErrorProps {
  message?: string;
}

export default function InvalidTokenError({ message }: InvalidTokenErrorProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <span className="inline-flex items-center rounded-[2px] border border-blush-300 bg-blush-50 px-3 py-1 text-2xs font-bold uppercase tracking-[0.14em] text-blush-700">
          Liên kết không hợp lệ hoặc đã hết hạn
        </span>
      </div>

      <div className="text-center space-y-3">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[2px] bg-cream-50 border border-luxury-ink/10">
          <IconAlertTriangle className="w-8 h-8 text-amber-600" />
        </div>

        <div className="space-y-1">
          <h3 className="font-droid-serif text-xl font-bold text-luxury-ink">
            Đường dẫn đã hết hiệu lực
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
            Liên kết đặt lại mật khẩu của bạn đã quá hạn thời gian cho phép (15 phút) hoặc đã được kích hoạt trước đó.
          </p>
        </div>
      </div>

      <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/70 p-4">
        <p className="text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ink">
          Chi tiết lỗi
        </p>
        <p className="mt-1 text-xs leading-relaxed text-neutral-600">
          {message || "Mã xác thực không hợp lệ. Vui lòng tạo yêu cầu cấp lại mã mới."}
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <Link
          href="/forgot-password"
          className="w-full h-11 px-8 rounded-[2px] bg-luxury-ink text-luxury-ivory uppercase tracking-[0.15em] text-xs font-bold hover:bg-charcoal-800 transition-all inline-flex items-center justify-center gap-2"
        >
          <span>Yêu cầu liên kết mới</span>
          <IconArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/login"
          className="w-full h-11 px-4 border border-luxury-ink/20 text-luxury-ink rounded-[2px] text-xs font-bold uppercase tracking-[0.12em] hover:bg-taupe-50 transition-all inline-flex items-center justify-center gap-1.5"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          <span>Quay lại đăng nhập</span>
        </Link>
      </div>
    </div>
  );
}
