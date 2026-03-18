/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import DiscountForm from "./DiscountForm";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ProductService } from "@/services/product.service";
import type { MyListingProduct } from "@/types/myProducts";

interface SellerDiscountInlineProps {
  buyerId: string;
  buyerName?: string;
  onCreated?: (payload: {
    deal: any;
    product: {
      _id: string;
      name: string;
      price: number;
      imageUrl?: string;
      slug?: string;
    };
    discountedPrice: number;
    endDate: string;
  }) => void;
  onCancel?: () => void;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  stock?: number;
  status?: string;
  slug?: string;
}

function mapListingToDiscountProduct(item: MyListingProduct): Product {
  return {
    _id: item._id,
    name: item.name,
    price: item.price,
    imageUrl: item.avatar?.url || undefined,
    category: item.categoryId?.name,
    stock: item.stock,
    status: item.status,
    slug: item.slug,
  };
}

async function fetchSellerProducts(): Promise<Product[]> {
  const res = await ProductService.getMyListings({ page: 1, limit: 100 });
  const listings = Array.isArray(res?.data) ? res.data : [];
  return listings
    .map(mapListingToDiscountProduct)
    .filter((p) => ["active", "approved"].includes(String(p.status)) && (p.stock ?? 0) > 0);
}


// ─── Product Card for Popover ─────────────────────────────────────────────
function ProductCard({ product, selected, onSelect }: { product: Product; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-xl border p-2.5 shadow-sm transition-all hover:border-primary/40 hover:bg-primary/5 ${
        selected ? "border-primary/60 ring-2 ring-primary/20 bg-primary/5" : "border-slate-200 bg-white"
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
      ) : (
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300 font-bold text-lg">?</div>
      )}
      <div className="min-w-0 flex-1 text-left">
        <div className="font-medium text-slate-800 truncate">{product.name}</div>
        <div className="text-xs text-slate-400 truncate">{product.category}</div>
        <div className="text-violet-600 font-semibold text-sm">{product.price.toLocaleString("vi-VN")}₫</div>
      </div>
      {selected && <IconCheck className="w-4 h-4 text-primary" />}
    </button>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function SellerDiscountInline({ buyerId, buyerName, onCreated, onCancel }: SellerDiscountInlineProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);
  const [createdProductName, setCreatedProductName] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchSellerProducts()
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleCreated = (payload: {
    deal: any;
    product: {
      _id: string;
      name: string;
      price: number;
      imageUrl?: string;
      slug?: string;
    };
    discountedPrice: number;
    endDate: string;
  }) => {
    setCreated(true);
    setCreatedProductName(payload.product.name);
    setTimeout(() => {
      setCreated(false);
      setSelectedProduct("");
      onCreated?.(payload);
    }, 1800);
  };

  const handleCancel = () => {
    setSelectedProduct("");
    setSearch("");
    onCancel?.();
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const selectedProductData = products.find((p) => p._id === selectedProduct);

  return (
    <div className="border-t-2 border-border bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-semibold text-foreground">
          Tạo ưu đãi riêng {buyerName ? `cho ${buyerName}` : ""}
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-lg px-2 py-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <IconX className="h-4 w-4" />
        </button>
      </div>

      {created ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          <IconCheck className="h-4 w-4" />
          Đã tạo ưu đãi cho {createdProductName}
        </div>
      ) : (
        <>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Chọn sản phẩm
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="mb-2 w-full rounded-lg border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/25"
          />
          {loading ? (
            <div className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              Đang tải sản phẩm...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="rounded-xl border border-border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
              Không có sản phẩm phù hợp để tạo ưu đãi.
            </div>
          ) : (
            <div className="mb-3 flex max-h-40 flex-col gap-2 overflow-y-auto">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  selected={selectedProduct === p._id}
                  onSelect={() => setSelectedProduct(p._id)}
                />
              ))}
            </div>
          )}

          {selectedProductData ? (
            <DiscountForm
              product={selectedProductData}
              buyerId={buyerId}
              onCreated={handleCreated}
              onCancel={handleCancel}
            />
          ) : null}
        </>
      )}
    </div>
  );
}