import { useState, useEffect } from "react";
import DiscountForm from "./DiscountForm";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ProductService } from "@/services/product.service";
import type { MyListingProduct } from "@/types/myProducts";

interface SellerDiscountInlineProps {
  buyerId: string;
  buyerName?: string;
  sellerId: string;
  onCreated?: (discount: unknown) => void;
  onCancel?: () => void;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

function toDealProduct(p: MyListingProduct): Product {
  return {
    _id: p._id,
    name: p.name,
    price: p.price,
    imageUrl: p.avatar?.url || undefined,
    category: p.categoryId?.name,
  };
}

// ─── Product Card for Popover ─────────────────────────────────────────────
function ProductCard({ product, selected, onSelect }: { product: Product; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-center gap-3 w-full p-2 rounded-lg border transition-all shadow-sm hover:border-violet-300 bg-white ${selected ? "border-violet-400 ring-2 ring-violet-200" : "border-slate-200"}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 font-bold text-lg">?</div>
      )}
      <div className="flex-1 min-w-0 text-left">
        <div className="font-medium text-slate-800 truncate">{product.name}</div>
        <div className="text-xs text-slate-400 truncate">{product.category}</div>
        <div className="text-violet-600 font-semibold text-sm">{product.price.toLocaleString("vi-VN")}₫</div>
      </div>
      {selected && <IconCheck className="w-4 h-4 text-violet-500" />}
    </button>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function SellerDiscountInline({ buyerId, buyerName, sellerId, onCreated, onCancel }: SellerDiscountInlineProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (sellerId) {
      setLoading(true);
      setLoadError("");
      ProductService.getMyListings({ page: 1, limit: 50 })
        .then((res) => {
          const items = Array.isArray(res?.data) ? res.data : [];
          const eligible = items.filter(
            (p) =>
              (p.status === "active" || p.status === "approved") &&
              (p.stock ?? 0) > 0,
          );
          setProducts(eligible.map(toDealProduct));
        })
        .catch(() => {
          setProducts([]);
          setLoadError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
        })
        .finally(() => setLoading(false));
    }
  }, [sellerId]);

  const handleCreated = (discount: any) => {
    setCreated(true);
    setTimeout(() => {
      setCreated(false);
      setSelectedProduct("");
      onCreated?.(discount);
    }, 1800);
  };

  const handleCancel = () => {
    setSelectedProduct("");
    onCancel?.();
  };

  return (
    <div
      className="border-t border-border bg-white p-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="flex items-center justify-between pb-3 border-b border-violet-100">
        <div className="font-semibold text-slate-800 text-sm leading-tight">
          Tạo ưu đãi riêng {buyerName && <span className="text-violet-600">cho {buyerName}</span>}
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="w-7 h-7 rounded-full hover:bg-slate-200 flex items-center justify-center transition-colors text-slate-400 hover:text-slate-600"
        >
          <IconX className="w-4 h-4" />
        </button>
      </div>

      {created ? (
        <div className="px-6 py-6 flex flex-col items-center justify-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl mt-3">
          <span className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <IconCheck className="w-7 h-7 text-emerald-600" />
          </span>
          <div className="text-emerald-700 font-semibold text-base">Ưu đãi đã được tạo thành công!</div>
        </div>
      ) : (
        <div className="pt-3">
          <div className="mb-3">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Chọn sản phẩm áp dụng
            </div>
            {loading ? (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-400">
                <span className="w-4 h-4 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                Đang tải sản phẩm…
              </div>
            ) : loadError ? (
              <div className="text-xs text-center text-red-500 py-2">{loadError}</div>
            ) : products.length === 0 ? (
              <div className="text-xs text-center text-slate-400 py-2">
                Bạn chưa có sản phẩm nào để tạo ưu đãi.
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {products.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    selected={selectedProduct === p._id}
                    onSelect={() => setSelectedProduct(p._id)}
                  />
                ))}
              </div>
            )}
          </div>

          {selectedProduct ? (
            <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                Cấu hình ưu đãi
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                <DiscountForm
                  product={products.find((p) => p._id === selectedProduct) || null}
                  buyerId={buyerId}
                  onCreated={handleCreated}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          ) : (
            products.length > 0 && (
              <p className="text-xs text-slate-400 text-center pb-1 mt-2">
                Chọn sản phẩm để tiếp tục cấu hình ưu đãi
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}