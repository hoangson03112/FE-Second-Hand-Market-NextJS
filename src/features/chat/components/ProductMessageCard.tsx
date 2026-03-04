import Image from "next/image";
import Link from "next/link";

interface ProductMessageCardProps {
  productId: string;
  productName: string;
  productPrice: number;
  productImage?: string;
  productSlug?: string;
}

export default function ProductMessageCard({
  productId,
  productName,
  productPrice,
  productImage,
  productSlug,
}: ProductMessageCardProps) {
  const productUrl = `/products/${productId}/${productSlug || "product"}`;

  return (
    <Link
      href={productUrl}
      className="block bg-white border-2 border-primary/20 rounded-xl p-3 hover:shadow-md transition-all duration-200 max-w-sm"
    >
      <div className="flex gap-3">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-cream-50 flex-shrink-0">
          {productImage ? (
            <Image
              src={productImage}
              alt={productName}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-taupe-400">
              <span className="text-2xl">📦</span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-taupe-900 mb-1 line-clamp-2">
            {productName}
          </p>
          <p className="text-primary font-bold text-base">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(productPrice)}
          </p>
          <p className="text-xs text-taupe-500 mt-1">👆 Nhấn để xem chi tiết</p>
        </div>
      </div>
    </Link>
  );
}
