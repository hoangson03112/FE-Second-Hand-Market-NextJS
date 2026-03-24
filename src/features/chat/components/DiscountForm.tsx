import { useState } from "react";
function getDefaultEndDate() {
  const now = new Date();
  now.setHours(now.getHours() + 24);
  return now.toISOString().slice(0, 10);
}

interface DiscountFormProps {
  products: Array<{ _id: string; name: string; price: number }>;
  buyerId: string;
  onCreated?: (discount: any) => void;
  onCancel?: () => void;
}

export default function DiscountForm({ products, buyerId, onCreated, onCancel }: DiscountFormProps) {
  const [productId, setProductId] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const endDate = getDefaultEndDate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/eco-market/seller/personal-discount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, buyerId, price: Number(price), endDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Tạo giảm giá thất bại");
      onCreated && onCreated(data.deal);
    } catch (err: any) {
      setError(err.message || "Tạo giảm giá thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-primary/30 rounded-xl p-4 mt-3 flex flex-col gap-4 shadow-lg">
      <div className="flex items-center gap-3">
        <select
          value={productId}
          onChange={e => setProductId(e.target.value)}
          className="flex-1 border border-primary/30 rounded-lg px-3 py-2 text-sm font-medium"
          required
        >
          <option value="">Chọn sản phẩm...</option>
          {products.map(p => (
            <option key={p._id} value={p._id}>
              {p.name} (Giá: {p.price.toLocaleString("vi-VN")}₫)
            </option>
          ))}
        </select>
        <input
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
          className="w-32 border border-primary/30 rounded-lg px-3 py-2 text-sm font-medium"
          min={1}
          placeholder="Giá giảm"
          required
        />
      </div>
      <div className="text-xs text-muted-foreground">
        Hạn dùng: <span className="font-semibold">24h</span> kể từ bây giờ
      </div>
      {error && <div className="text-destructive text-sm mt-1">{error}</div>}
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-primary text-white px-4 py-2 rounded font-semibold shadow-sm" disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo giảm giá"}
        </button>
        <button type="button" className="bg-muted px-4 py-2 rounded font-semibold" onClick={onCancel} disabled={loading}>
          Hủy
        </button>
      </div>
    </form>
  );
}
