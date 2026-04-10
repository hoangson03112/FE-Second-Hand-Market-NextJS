import Link from "next/link";

interface InvalidTokenErrorProps {
  message?: string;
}

export default function InvalidTokenError({ message }: InvalidTokenErrorProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <span className="inline-flex items-center rounded-full border border-destructive/25 bg-destructive/8 px-3 py-1 text-[12px] font-semibold tracking-wide text-destructive">
          Liên kết không khả dụng
        </span>
      </div>

      <div className="text-center space-y-4">
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-destructive/20 to-orange-200/60" />
          <div className="absolute inset-[10px] rounded-full bg-white/90" />
          <span className="relative text-4xl">⚠️</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-[28px] font-bold leading-tight text-taupe-900">Link không hợp lệ</h3>
          <p className="text-[15px] leading-relaxed text-taupe-600">
            Liên kết đặt lại mật khẩu của bạn đã hết hạn hoặc đã được sử dụng.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-taupe-200/70 bg-gradient-to-r from-cream-50 to-taupe-50 p-4">
        <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-taupe-500">Chi tiết</p>
        <p className="mt-2 text-[14px] leading-relaxed text-taupe-700">
          {message || "Link reset mật khẩu không đúng hoặc đã hết hạn (15 phút)."}
        </p>
      </div>

      <div className="space-y-3 pt-1">
        <Link
          href="/forgot-password"
          className="btn-auth-primary block w-full rounded-xl px-4 py-3 text-center text-[15px] font-semibold transition-all"
        >
          Yêu cầu liên kết mới
        </Link>

        <Link
          href="/login"
          className="btn-auth-secondary block w-full rounded-xl px-4 py-3 text-center text-[15px] font-semibold transition-colors"
        >
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
