import { IconPackage, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { PRODUCT_MESSAGES } from "@/constants";

export function EmptyProductState() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-cream-50 to-white border-2 border-border p-20 text-center shadow-md">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <IconPackage className="w-10 h-10 text-primary" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-taupe-900">
            {PRODUCT_MESSAGES.NO_PRODUCTS}
          </h2>
          <p className="text-sm text-taupe-500">
            {PRODUCT_MESSAGES.NO_PRODUCTS_DESC ||
              "Bắt đầu bằng cách đăng sản phẩm đầu tiên của bạn"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/sell"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 hover:shadow-md transition-all duration-200 active:scale-[0.98]"
          >
            <IconPlus className="w-4 h-4" />
            Đăng sản phẩm
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold border-2 border-taupe-300/80 text-taupe-700 rounded-xl hover:bg-taupe-50 hover:border-taupe-500/70 transition-all duration-200"
          >
            Khám phá chợ
          </Link>
        </div>
      </div>
    </div>
  );
}
