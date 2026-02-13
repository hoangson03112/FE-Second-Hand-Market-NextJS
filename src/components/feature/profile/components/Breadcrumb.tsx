import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb() {
  return (
    <div className="bg-background border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-primary hover:text-primary/80">
            Trang chủ
          </Link>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
          <span className="text-foreground">Tài khoản của tôi</span>
        </div>
      </div>
    </div>
  );
}
