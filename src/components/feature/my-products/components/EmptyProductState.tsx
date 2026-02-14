import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRODUCT_MESSAGES } from "@/constants";

export function EmptyProductState() {
  return (
    <div className="rounded-xl bg-card border border-border p-20 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto">
          <Package className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            {PRODUCT_MESSAGES.NO_PRODUCTS}
          </h2>
          <p className="text-sm text-muted-foreground">
            {PRODUCT_MESSAGES.NO_PRODUCTS_DESC || 
              "Bắt đầu bằng cách đăng sản phẩm đầu tiên của bạn"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/sell"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Đăng sản phẩm
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
          >
            Khám phá chợ
          </Link>
        </div>
      </div>
    </div>
  );
}
