import Link from "next/link";
import { IconArrowUpRight, IconPackage } from "@tabler/icons-react";

interface OrderTab {
  key: string;
  label: string;
}

interface OrdersEmptyProps {
  activeTab: string;
  tabs: readonly OrderTab[];
}

export function OrdersEmpty({ activeTab, tabs }: OrdersEmptyProps) {
  const isAll = activeTab === "all";
  const activeLabel = tabs
    .find((tab) => tab.key === activeTab)
    ?.label.toLowerCase();

  return (
    <div className="rounded-[2px] border border-dashed border-luxury-ink/15 bg-white px-6 py-20 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-cream-50">
        <IconPackage className="h-6 w-6 text-luxury-ink" />
      </span>

      <h3
        style={{ fontFamily: "var(--font-droid-serif), serif" }}
        className="mt-7 text-xl tracking-tight text-luxury-ink"
      >
        {isAll ? "Chưa có đơn hàng nào" : `Không có đơn ${activeLabel}`}
      </h3>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
        {isAll
          ? "Khi bạn đặt món đầu tiên, đơn hàng sẽ xuất hiện ở đây cùng toàn bộ tiến trình giao nhận."
          : "Không tìm thấy đơn hàng nào trong trạng thái này. Thử chọn một tab khác."}
      </p>

      {isAll ? (
        <Link
          href="/products"
          className="group mt-8 inline-flex items-center gap-2 rounded-[2px] bg-luxury-ink px-7 py-3.5 text-[10px] font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800"
        >
          Khám phá sản phẩm
          <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
