import Link from "next/link";
import { Package, Plus, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCT_MESSAGES } from "@/constants";

export function EmptyProductState() {
  return (
    <div className="rounded-xl bg-white border border-gray-100 p-16 text-center relative overflow-hidden">
      {/* Subtle decorative circle */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gray-50 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />

      {/* Content */}
      <div className="relative z-10">
        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <Package className="w-10 h-10 text-gray-400" />
        </div>
        
        <h2 className="text-2xl font-medium text-gray-900 mb-2">
          {PRODUCT_MESSAGES.NO_PRODUCTS}
        </h2>
        
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          {PRODUCT_MESSAGES.NO_PRODUCTS_DESC || 
            "Bắt đầu bằng cách đăng sản phẩm đầu tiên của bạn"}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <Link
            href="/sell"
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium",
              "bg-gray-900 text-white rounded-lg",
              "hover:bg-gray-800 transition-colors"
            )}
          >
            <Plus className="w-4 h-4" />
            Đăng sản phẩm
          </Link>

          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium",
              "bg-gray-50 text-gray-700 rounded-lg",
              "hover:bg-gray-100 transition-colors"
            )}
          >
            Khám phá chợ
          </Link>
        </div>

        {/* Tips - minimal */}
        <div className="mt-12 flex justify-center gap-8 text-xs text-gray-500">
          <span>✓ Dễ dàng</span>
          <span>✓ Miễn phí</span>
          <span>✓ Nhanh chóng</span>
        </div>
      </div>
    </div>
  );
}
