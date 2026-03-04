import Link from "next/link";

export function HeaderGuestActions() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Link
        href="/login"
        className="inline-flex items-center justify-center h-8 sm:h-9 px-3 sm:px-4 text-[12px] sm:text-[13px] font-semibold transition-all duration-150 hover:opacity-85"
        style={{ color: "#4A3F33", background: "#EDE0D4", borderRadius: "9999px" }}
      >
        Đăng nhập
      </Link>
      <Link
        href="/register"
        className="hidden md:inline-flex items-center justify-center h-9 px-4 text-[13px] font-semibold transition-all duration-150 hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, #C47B5A 0%, #B06038 100%)",
          color: "#FDFAF6",
          borderRadius: "9999px",
          boxShadow: "0 2px 8px rgba(196,123,90,0.32)",
        }}
      >
        Đăng ký
      </Link>
    </div>
  );
}
