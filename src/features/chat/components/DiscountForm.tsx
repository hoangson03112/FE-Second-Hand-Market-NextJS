import { useMemo, useState } from "react";
import { IconCoin, IconCalendarClock } from "@tabler/icons-react";
import { parsePriceInput, getDiscountStats, formatPrice } from "@/utils/format/price";
import { SellerService } from "@/services/seller.service";

const getDefaultEndDate = (): string => {
  const now = new Date();
  now.setHours(now.getHours() + 24);
  return now.toISOString().slice(0, 10);
};

interface DiscountFormProps {
  product: { _id: string; name: string; price: number; imageUrl?: string; slug?: string };
  buyerId: string;
  onCreated?: (payload: { deal: any; product: { _id: string; name: string; price: number; imageUrl?: string; slug?: string }; discountedPrice: number; endDate: string }) => void;
  onCancel?: () => void;
}

export default function DiscountForm({ product, buyerId, onCreated, onCancel }: DiscountFormProps) {
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endDate = getDefaultEndDate();

  const discountedPrice = useMemo(() => parsePriceInput(price), [price]);
  const { discountAmount, discountPercent } = useMemo(
    () => getDiscountStats(product.price, discountedPrice),
    [product.price, discountedPrice]
  );
  const validPrice = useMemo(
    () => product.price > 0 && discountedPrice > 0 && discountedPrice <= product.price,
    [product.price, discountedPrice]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validPrice) {
      setError("Giá ưu đãi phải > 0 và không vượt quá giá gốc.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await SellerService.createPersonalDiscount({
        productId: product._id,
        buyerId,
        price: discountedPrice,
        endDate,
      });
      onCreated?.({
        deal: data.deal,
        product,
        discountedPrice,
        endDate,
      });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } }; message?: string })?.response?.data
          ?.message ||
        (err as Error)?.message ||
        "Tạo giảm giá thất bại";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-2 flex flex-col gap-3"
    >
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-primary/80">
          Tạo ưu đãi cá nhân
        </p>
        <p className="text-xs text-muted-foreground">
          Áp dụng cho: <span className="font-medium text-foreground">{product.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Giá ưu đãi
          </p>
          <div className="flex items-center gap-2 rounded-lg border border-primary/20 px-2.5 py-2">
            <IconCoin className="h-4 w-4 text-primary" />
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold outline-none"
              min={1}
              max={product.price}
              placeholder={`<= ${formatPrice(product.price)}`}
              required
            />
            <span className="text-xs text-muted-foreground">₫</span>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Hạn sử dụng
          </p>
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <IconCalendarClock className="h-4 w-4 text-primary" />
            24h kể từ lúc tạo
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Đến ngày {new Date(endDate).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>

      {discountedPrice > 0 && (
        <div className="rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs leading-5">
          <span className="text-muted-foreground">Giá gốc: </span>
          <span className="font-semibold text-foreground">{formatPrice(product.price)}</span>
          <span className="mx-2 text-muted-foreground">|</span>
          <span className="text-muted-foreground">Giảm: </span>
          <span className="font-semibold text-primary">{formatPrice(discountAmount)}</span>
          <span className="mx-2 text-muted-foreground">|</span>
          <span className="text-muted-foreground">Tỷ lệ: </span>
          <span className="font-semibold text-primary">{discountPercent}%</span>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mt-1 flex gap-2">
        <button
          type="submit"
          className="inline-flex flex-1 items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
          disabled={loading || !validPrice}
        >
          {loading ? "Đang tạo..." : "Tạo giảm giá"}
        </button>
        <button
          type="button"
          className="rounded-xl bg-muted px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted/80"
          onClick={onCancel}
          disabled={loading}
        >
          Hủy
        </button>
      </div>
    </form>
  );
}
