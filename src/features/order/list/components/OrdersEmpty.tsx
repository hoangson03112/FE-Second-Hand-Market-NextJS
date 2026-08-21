import Link from "next/link";
import {
  IconArrowUpRight,
  IconCircleCheck,
  IconPackage,
} from "@tabler/icons-react";
import type { OrderTab } from "@/constants/orderStatus";

interface OrdersEmptyProps {
  activeTab: string;
  tabs: readonly OrderTab[];
  /** Set when the list is empty because of the search box, not the tab. */
  searchQuery?: string;
}

const TAB_COPY: Record<string, { heading: string; body: string }> = {
  action: {
    heading: "Không có việc gì cần bạn làm",
    body: "Mọi đơn hàng đang tự chạy. Chúng tôi sẽ nhắc bạn tại đây khi cần xác nhận hoặc bổ sung thông tin.",
  },
  active: {
    heading: "Không có đơn nào đang đến",
    body: "Đơn hàng đang được người bán xác nhận hoặc vận chuyển sẽ hiển thị ở đây.",
  },
  received: {
    heading: "Chưa có đơn nào đã nhận",
    body: "Đơn đã giao đến bạn và đơn đã hoàn thành sẽ hiển thị ở đây.",
  },
  refund: {
    heading: "Không có đơn hoàn trả",
    body: "Yêu cầu hoàn tiền và hoàn hàng của bạn sẽ hiển thị ở đây.",
  },
  cancelled: {
    heading: "Không có đơn đã hủy",
    body: "Đơn bị hủy hoặc giao thất bại sẽ hiển thị ở đây.",
  },
};

export function OrdersEmpty({
  activeTab,
  tabs,
  searchQuery,
}: OrdersEmptyProps) {
  const isAll = activeTab === "all";
  const isSearch = Boolean(searchQuery?.trim());
  const isAllClear = activeTab === "action";

  const copy = isSearch
    ? {
        heading: "Không tìm thấy đơn hàng",
        body: `Không có đơn nào khớp với “${searchQuery?.trim()}”. Thử mã đơn, mã vận đơn, tên sản phẩm hoặc tên người bán.`,
      }
    : isAll
      ? {
          heading: "Chưa có đơn hàng nào",
          body: "Khi bạn đặt món đầu tiên, đơn hàng sẽ xuất hiện ở đây cùng toàn bộ tiến trình giao nhận.",
        }
      : (TAB_COPY[activeTab] ?? {
          heading: `Không có đơn ${tabs
            .find((tab) => tab.key === activeTab)
            ?.label.toLowerCase()}`,
          body: "Không tìm thấy đơn hàng nào trong nhóm này. Thử chọn một tab khác.",
        });

  const Icon = !isSearch && isAllClear ? IconCircleCheck : IconPackage;

  return (
    <div className="rounded-[2px] border border-dashed border-luxury-ink/15 bg-white px-6 py-20 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-cream-50">
        <Icon className="h-6 w-6 text-luxury-ink" />
      </span>

      <h3 className="font-droid-serif mt-7 text-xl tracking-tight text-luxury-ink">
        {copy.heading}
      </h3>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
        {copy.body}
      </p>

      {isAll && !isSearch ? (
        <Link
          href="/products"
          className="group mt-8 inline-flex items-center gap-2 rounded-[2px] bg-luxury-ink px-7 py-3.5 text-2xs font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800"
        >
          Khám phá sản phẩm
          <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
