import Link from "next/link";

export default function InvalidTokenError() {
  return (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
        <span className="text-4xl">⚠️</span>
      </div>

      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-foreground">Link không hợp lệ</h3>
        <p className="text-taupe-600 leading-relaxed">
          Link reset mật khẩu không đúng hoặc đã hết hạn (15 phút).
        </p>
      </div>

      <div className="pt-4 space-y-3">
        <Link
          href="/forgot-password"
          className="block w-full py-3 px-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors text-center"
        >
          Yêu cầu link mới
        </Link>

        <Link
          href="/login"
          className="block text-center text-sm text-taupe-600 hover:text-primary transition-colors"
        >
          ← Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}
