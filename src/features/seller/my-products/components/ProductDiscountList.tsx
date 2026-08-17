import { IconTicket, IconX } from "@tabler/icons-react";
import { formatPrice } from "@/utils/format/price";
import { formatDateOnly } from "@/utils/format";
import type { MyListingProduct } from "@/types/myProducts";

type Discount = NonNullable<MyListingProduct["personalDiscounts"]>[number];

interface ProductDiscountListProps {
  discounts: Discount[];
  onDelete?: (discountId: string) => void;
  isDeletingId?: string | null;
  /** grid: stacked rows with buyer name on its own line. list: compact inline pills. */
  variant?: "grid" | "list";
}

export function ProductDiscountList({
  discounts,
  onDelete,
  isDeletingId = null,
  variant = "list",
}: ProductDiscountListProps) {
  if (discounts.length === 0) return null;

  return (
    <div className={variant === "grid" ? "mb-3 space-y-1.5" : "mb-2 space-y-1"}>
      <p className="text-[11px] font-bold text-taupe-500 uppercase tracking-wide flex items-center gap-1">
        <IconTicket className="w-3 h-3" />
        Ưu đãi ({discounts.length})
      </p>

      <div
        className={variant === "grid" ? "space-y-1.5" : "flex flex-wrap gap-2"}
      >
        {discounts.map((d) => (
          <div
            key={d._id}
            className={
              variant === "grid"
                ? "flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg bg-primary/5 border border-primary/20 text-xs"
                : "inline-flex items-center gap-2 py-1 px-2 rounded-lg bg-primary/5 border border-primary/20 text-xs"
            }
          >
            {variant === "grid" ? (
              <div className="min-w-0 flex-1">
                <span className="font-bold text-primary">
                  {formatPrice(d.price)}
                </span>
                {d.buyerId?.fullName && (
                  <span className="text-taupe-500 ml-1 truncate block">
                    → {d.buyerId.fullName}
                  </span>
                )}
                <span className="text-taupe-400 text-[10px]">
                  Hết hạn: {formatDateOnly(d.endDate)}
                </span>
              </div>
            ) : (
              <>
                <span className="font-bold text-primary">
                  {formatPrice(d.price)}
                </span>
                {d.buyerId?.fullName && (
                  <span className="text-taupe-500 truncate max-w-[80px]">
                    {d.buyerId.fullName}
                  </span>
                )}
                <span className="text-taupe-400 text-[10px]">
                  {formatDateOnly(d.endDate)}
                </span>
              </>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(d._id)}
                disabled={isDeletingId === d._id}
                className={
                  variant === "grid"
                    ? "p-1 rounded text-red-500 hover:bg-red-50 disabled:opacity-50 shrink-0"
                    : "p-0.5 rounded text-red-500 hover:bg-red-50 disabled:opacity-50"
                }
                title="Xóa ưu đãi"
              >
                <IconX
                  className={variant === "grid" ? "w-3.5 h-3.5" : "w-3 h-3"}
                />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
