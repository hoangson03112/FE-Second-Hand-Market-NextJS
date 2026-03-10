import Link from "next/link";

export function HeaderGuestActions() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Link
        href="/login"
        className="inline-flex items-center justify-center h-8 sm:h-9 px-3 sm:px-4 text-[12px] sm:text-[13px] font-semibold transition-all duration-150 hover:opacity-85 text-neutral-700 bg-secondary rounded-full"
      >
        Đăng nhập
      </Link>
      <Link
        href="/register"
        className="hidden md:inline-flex items-center justify-center h-9 px-4 text-[13px] font-semibold transition-all duration-150 hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, var(--primary) 0%, oklch(0.43 0.08 35) 100%)",
          color: "var(--background)",
          borderRadius: "9999px",
          boxShadow: "0 2px 8px color-mix(in oklch, var(--primary) 32%, transparent)",
        }}
      >
        Đăng ký
      </Link>
    </div>
  );
}
