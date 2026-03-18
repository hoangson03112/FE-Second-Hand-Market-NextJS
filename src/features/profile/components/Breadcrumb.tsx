import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

export function Breadcrumb() {
  return (
    <div className="max-w-6xl mx-auto px-4 mb-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-primary hover:underline font-medium text-sm"
      >
        <IconArrowLeft className="h-4 w-4" />
        Quay lại
      </Link>
      <div className="flex items-center gap-2 text-sm mt-2 text-muted-foreground">
        <Link href="/" className="text-primary hover:underline">
          Trang chủ
        </Link>
        <IconChevronRight className="w-4 h-4 shrink-0" />
        <span className="text-foreground">Tài khoản của tôi</span>
      </div>
    </div>
  );
}
