import { IconLoader2, IconX } from "@tabler/icons-react";
import { microCaps } from "@/features/order/components";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";
import { formatDateOnly } from "@/utils/format";
import type { MyListingProduct } from "@/types/myProducts";

type Discount = NonNullable<MyListingProduct["personalDiscounts"]>[number];

interface ProductDiscountListProps {
  discounts: Discount[];
  onDelete?: (discountId: string) => void;
  isDeletingId?: string | null;
  /** grid: stacked rows. list: a single wrapping line of pills. */
  variant?: "grid" | "list";
}

/**
 * Personal offers sit on the champagne/cream ground reserved for "needs
 * attention but not wrong" — the same tone the order screens use for a refund
 * in progress.
 */
export function ProductDiscountList({
  discounts,
  onDelete,
  isDeletingId = null,
  variant = "list",
}: ProductDiscountListProps) {
  if (discounts.length === 0) return null;

  const isGrid = variant === "grid";

  return (
    <div>
      <p className={cn(microCaps, "text-neutral-500")}>
        Ưu đãi riêng · {discounts.length}
      </p>

      <div className={cn("mt-2", isGrid ? "space-y-1.5" : "flex flex-wrap gap-2")}>
        {discounts.map((discount) => (
          <div
            key={discount._id}
            className={cn(
              "flex items-center gap-2.5 rounded-[2px] border border-luxury-champagne/40 bg-cream-100/70 px-2.5 py-1.5",
              isGrid && "justify-between",
            )}
          >
            <div className="flex min-w-0 items-baseline gap-2">
              <span
                className="font-droid-serif shrink-0 tabular-nums text-sm text-taupe-700"
              >
                {formatPrice(discount.price)}
              </span>
              {discount.buyerId?.fullName ? (
                <span className="truncate text-xs text-neutral-600">
                  {discount.buyerId.fullName}
                </span>
              ) : null}
              <span className="shrink-0 text-2xs tabular-nums text-neutral-500">
                {formatDateOnly(discount.endDate)}
              </span>
            </div>

            {onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(discount._id)}
                disabled={isDeletingId === discount._id}
                title="Xóa ưu đãi"
                aria-label="Xóa ưu đãi"
                className="shrink-0 rounded-[2px] p-1 text-blush-600 transition-colors hover:bg-blush-50 disabled:opacity-40"
              >
                {isDeletingId === discount._id ? (
                  <IconLoader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <IconX className="h-3 w-3" />
                )}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
