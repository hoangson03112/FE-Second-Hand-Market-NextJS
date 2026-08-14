import { IconArrowLeft } from "@tabler/icons-react";
import { Eyebrow } from "@/components/shared/Eyebrow";

interface OrdersHeaderProps {
  onBack: () => void;
  /** Total order count, shown as an editorial figure beside the title. */
  totalCount?: number;
}

export function OrdersHeader({ onBack, totalCount }: OrdersHeaderProps) {
  return (
    <div className="mx-auto w-full max-w-9xl px-4 sm:px-6">
      <div className="flex items-center gap-4 py-5">
        <button
          type="button"
          onClick={onBack}
          aria-label="Quay lại"
          className="-ml-2 shrink-0 rounded-[2px] p-2 text-luxury-ink transition-colors hover:bg-taupe-50"
        >
          <IconArrowLeft className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <Eyebrow>Lịch sử mua hàng</Eyebrow>
          <h1
            style={{
              fontFamily: "var(--font-droid-serif), serif",
              fontWeight: 400,
              lineHeight: 1.1,
            }}
            className="mt-2.5 truncate text-2xl tracking-tight text-luxury-ink md:text-3xl"
          >
            Đơn hàng của tôi
          </h1>
        </div>

        {totalCount !== undefined && totalCount > 0 ? (
          <div className="hidden shrink-0 text-right sm:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-neutral-500">
              Tổng đơn
            </p>
            <p
              style={{ fontFamily: "var(--font-droid-serif), serif" }}
              className="mt-2 text-2xl leading-none tabular-nums text-luxury-ink"
            >
              {totalCount}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
