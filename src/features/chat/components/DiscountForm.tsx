import { useMemo, useState } from "react";
import { SellerService } from "@/services/seller.service";

function getDefaultEndDateIso() {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
}

function formatPercentForInput(value: number) {
  if (!Number.isFinite(value)) return "";
  const clamped = Math.min(100, Math.max(0, value));
  return Number(clamped.toFixed(2)).toString();
}

interface DiscountFormProps {
  product: { _id: string; name: string; price: number } | null;
  buyerId: string;
  onCreated?: (payload: {
    product: { _id: string; name: string; imageUrl?: string; slug?: string };
    discountedPrice: number;
    deal: unknown;
  }) => void;
  onCancel?: () => void;
}

export default function DiscountForm({ product, buyerId, onCreated, onCancel }: DiscountFormProps) {
  const [price, setPrice] = useState("");
  const [percent, setPercent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endDate = useMemo(() => getDefaultEndDateIso(), []);
  const originalPrice = product?.price ?? null;
  const numericPrice = Number(price);
  const canSubmit =
    !!product?._id &&
    Number.isFinite(numericPrice) &&
    numericPrice > 0 &&
    (originalPrice == null || numericPrice <= originalPrice) &&
    !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const priceNumber = Number(price);
      if (!product?._id) {
        throw new Error("Vui lòng chọn sản phẩm.");
      }
      if (!Number.isFinite(priceNumber) || priceNumber <= 0) {
        throw new Error("Giá deal phải là số dương.");
      }
      if (originalPrice != null && priceNumber > originalPrice) {
        throw new Error("Giá deal không được cao hơn giá gốc sản phẩm.");
      }

      const res = await SellerService.createPersonalDiscount({
        productId: product._id,
        buyerId,
        price: priceNumber,
        endDate,
      });
      onCreated?.({
        product: {
          _id: product._id,
          name: product.name,
        },
        discountedPrice: priceNumber,
        deal: res.deal,
      });
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "message" in err
          ? String((err as { message?: string }).message || "Tạo giảm giá thất bại")
          : "Tạo giảm giá thất bại";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="text-sm text-muted-foreground">
        Không có sản phẩm khả dụng để tạo ưu đãi.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-primary/30 rounded-xl p-4 mt-3 flex flex-col gap-4 shadow-lg">
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={price}
          onChange={e => {
            const nextPrice = e.target.value;
            setPrice(nextPrice);
            if (originalPrice && Number(nextPrice) >= 0) {
              const p = ((originalPrice - Number(nextPrice)) / originalPrice) * 100;
              setPercent(formatPercentForInput(p));
            } else {
              setPercent("");
            }
          }}
          className="w-full border border-primary/30 rounded-lg px-3 py-2 text-sm font-medium"
          min={1}
          placeholder="Giá deal"
          required
        />
        <input
          type="number"
          value={percent}
          onChange={e => {
            const nextPercent = e.target.value;
            setPercent(nextPercent);
            const percentNumber = Number(nextPercent);
            if (originalPrice && Number.isFinite(percentNumber)) {
              const clamped = Math.min(100, Math.max(0, percentNumber));
              const nextPrice = Math.round(originalPrice * (1 - clamped / 100));
              setPrice(nextPrice > 0 ? String(nextPrice) : "");
            } else {
              setPrice("");
            }
          }}
          onBlur={() => {
            if (!percent.trim()) return;
            const percentNumber = Number(percent);
            if (!Number.isFinite(percentNumber)) {
              setPercent("");
              return;
            }
            setPercent(formatPercentForInput(percentNumber));
          }}
          className="w-40 border border-primary/30 rounded-lg px-3 py-2 text-sm font-medium"
          min={0}
          max={100}
          step="0.01"
          placeholder="% giảm"
          required
        />
      </div>
      <div className="text-xs text-muted-foreground">
        Hạn dùng: <span className="font-semibold">24h</span> kể từ bây giờ
        {originalPrice != null ? (
          <span className="ml-2">
            • Giá gốc: <span className="font-semibold">{originalPrice.toLocaleString("vi-VN")}₫</span>
          </span>
        ) : null}
      </div>
      {error && <div className="text-destructive text-sm mt-1">{error}</div>}
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded font-semibold shadow-sm disabled:opacity-60"
          disabled={!canSubmit}
        >
          {loading ? "Đang tạo..." : "Tạo giảm giá"}
        </button>
        <button type="button" className="bg-muted px-4 py-2 rounded font-semibold" onClick={onCancel} disabled={loading}>
          Hủy
        </button>
      </div>
    </form>
  );
}
