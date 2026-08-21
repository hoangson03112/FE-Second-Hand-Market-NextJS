import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

export function Breadcrumb() {
  return (
    <div className="max-w-9xl mx-auto w-full px-4 mb-6 sm:px-6">
      <div className="flex items-center gap-2 text-sm mt-2 text-muted-foreground">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-charcoal-400 uppercase flex-wrap"
        >
          <Link href="/" className="hover:text-luxury-ink transition-colors">
            Trang chủ
          </Link>
          <IconChevronRight className="h-3 w-3 text-taupe-300" />
          <span className="text-luxury-ink">Thông tin tài khoản</span>
        </nav>
      </div>
    </div>
  );
}
