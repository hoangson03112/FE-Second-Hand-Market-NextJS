import { IconArrowLeft } from "@tabler/icons-react";
import { Eyebrow, microCaps } from "@/features/order/components";
import { cn } from "@/lib/utils";

interface OrdersHeaderProps {
  onBack: () => void;
  /** Total order count, shown as an editorial figure beside the title. */
  totalCount?: number;
  /** How many orders are waiting on the buyer — the figure worth leading with. */
  actionCount?: number;
}

function Figure({
  label,
  value,
  attention = false,
}: {
  label: string;
  value: number;
  attention?: boolean;
}) {
  return (
    <div>
      <p className={cn(microCaps, "text-neutral-500")}>{label}</p>
      <p
        className={cn(
          "font-droid-serif",
          "mt-2 text-2xl leading-none tabular-nums",
          attention ? "text-taupe-700" : "text-luxury-ink",
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function OrdersHeader({
  onBack,
  totalCount,
  actionCount = 0,
}: OrdersHeaderProps) {
  return (
    <div className="mx-auto w-full max-w-9xl px-4 sm:px-6">
      <div className="flex flex-col gap-6 py-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={onBack}
            aria-label="Quay lại"
            className="-ml-2 mt-1 shrink-0 rounded-[2px] p-2 text-luxury-ink transition-colors hover:bg-taupe-50"
          >
            <IconArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <Eyebrow>Lịch sử mua hàng</Eyebrow>
            <h1
              className="font-droid-serif mt-2.5 text-[clamp(1.5rem,3vw,2rem)] leading-[1.1] tracking-tight text-luxury-ink"
            >
              Đơn hàng của tôi
            </h1>
            <p className="mt-2.5 max-w-md text-sm leading-relaxed text-neutral-600">
              {actionCount > 0
                ? `Có ${actionCount} đơn đang chờ bạn xử lý.`
                : "Theo dõi tiến trình từng đơn và xử lý khi cần."}
            </p>
          </div>
        </div>

        {totalCount !== undefined && totalCount > 0 ? (
          <div className="flex shrink-0 items-end gap-8">
            {actionCount > 0 ? (
              <Figure label="Cần xử lý" value={actionCount} attention />
            ) : null}
            <Figure label="Tổng đơn" value={totalCount} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
