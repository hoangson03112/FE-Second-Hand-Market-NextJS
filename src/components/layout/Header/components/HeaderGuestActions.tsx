import Link from "next/link";

export function HeaderGuestActions() {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <Link
        href="/login"
        className="inline-flex items-center justify-center h-8 sm:h-9 px-3 sm:px-4 text-[12px] sm:text-[13px] font-semibold hover:text-white transition-all duration-150 hover:opacity-85 text-neutral-200 bg-secondary rounded-full"
      >
        Đăng nhập
      </Link>
      <Link
        href="/register"
        className="hidden md:inline-flex items-center justify-center h-9 px-4 text-[13px] font-semibold text-white bg-primary rounded-full shadow-sm transition-all duration-150 hover:bg-primary/90"
        style={{
          boxShadow: "0 2px 8px color-mix(in srgb, var(--primary) 32%, transparent)",
        }}
      >
        Đăng ký
      </Link>
    </div>
  );
}
