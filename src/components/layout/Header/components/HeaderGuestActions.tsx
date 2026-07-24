import Link from "next/link";

export function HeaderGuestActions() {
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="uppercase inline-flex items-center justify-center h-8 sm:h-9 px-3.5 sm:px-4 text-xs  font-medium text-foreground bg-primary-foreground border border-primary rounded-[3px] transition-all duration-200 hover:scale-[1.03]"
      >
        Đăng nhập
      </Link>
      <Link
        href="/register"
        className="group relative inline-flex items-center justify-center h-8 sm:h-9 px-4 sm:px-5 text-xs font-medium uppercase tracking-[0.15em] text-white bg-primary rounded-[3px] transition-all duration-300 hover:scale-[1.03]"
      >
        <div className="absolute inset-0 bg-[#5FB160] opacity-25 group-hover:opacity-45 transition-opacity duration-300 blur-sm rounded-[3px]" />
        <span className="relative z-10">Đăng ký</span>
      </Link>
    </div>
  );
}
