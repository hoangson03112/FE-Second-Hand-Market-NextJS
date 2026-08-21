import Link from "next/link";
import { IconArrowUpRight, IconPackage } from "@tabler/icons-react";

const TAB_EMPTY_MESSAGES: Record<string, { heading: string; sub: string }> = {
  all: {
    heading: "Chưa có đơn hàng nào",
    sub: "Đơn hàng sẽ hiển thị khi có người mua sản phẩm của bạn, cùng toàn bộ tiến trình giao nhận.",
  },
  pending: {
    heading: "Không có đơn chờ xác nhận",
    sub: "Các đơn mới sẽ xuất hiện ở đây để bạn xác nhận.",
  },
  processing: {
    heading: "Không có đơn đang xử lý",
    sub: "Đơn đã xác nhận sẽ hiển thị tại đây.",
  },
  shipped: {
    heading: "Không có đơn đang giao",
    sub: "Đơn hàng trên đường vận chuyển sẽ hiển thị ở đây.",
  },
  delivered: {
    heading: "Không có đơn đã giao",
    sub: "Đơn giao thành công sẽ hiển thị ở đây.",
  },
  refund: {
    heading: "Không có đơn hoàn trả",
    sub: "Các yêu cầu hoàn tiền / hoàn hàng sẽ hiển thị tại đây.",
  },
  cancelled: {
    heading: "Không có đơn đã hủy",
    sub: "Đơn hàng bị hủy hoặc giao thất bại sẽ hiển thị ở đây.",
  },
};

interface EmptyOrderStateProps {
  activeTab: string;
}

export default function EmptyOrderState({ activeTab }: EmptyOrderStateProps) {
  const msg = TAB_EMPTY_MESSAGES[activeTab] ?? TAB_EMPTY_MESSAGES.all;
  const isAll = activeTab === "all";

  return (
    <div className="rounded-[2px] border border-dashed border-luxury-ink/15 bg-white px-6 py-20 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-[2px] border border-luxury-ink/10 bg-cream-50">
        <IconPackage className="h-6 w-6 text-luxury-ink" />
      </span>

      <h3 className="font-droid-serif mt-7 text-xl tracking-tight text-luxury-ink">
        {msg.heading}
      </h3>

      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
        {msg.sub}
      </p>

      {isAll ? (
        <Link
          href="/sell"
          className="group mt-8 inline-flex items-center gap-2 rounded-[2px] bg-luxury-ink px-7 py-3.5 text-2xs font-bold uppercase tracking-[0.22em] text-luxury-ivory transition-all duration-300 hover:bg-charcoal-800"
        >
          Đăng sản phẩm mới
          <IconArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      ) : null}
    </div>
  );
}
