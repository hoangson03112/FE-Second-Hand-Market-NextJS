"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProduct } from "@/hooks/useProducts";
import { useUser } from "@/hooks/useUser";
import { useProductActions } from "@/hooks/useProductActions";
import { formatPrice } from "@/utils/format/price";
import { IAttribute } from "@/types/product";
import ProductGalleryNew from "./ProductGalleryNew";
import ProductHeader from "./ProductHeader";
import SellerInfoCard from "./SellerInfoCard";
import ProductPrice from "./ProductPrice";
import ProductSpecifications from "./ProductSpecifications";
import ProductDescription from "./ProductDescription";
import QuantitySelector from "./QuantitySelector";
import ProductActionButtons from "./ProductActionButtons";
import ProductGuarantees from "./ProductGuarantees";
import { AccountInfo } from "@/types/auth";

interface ProductProps {
  id: string;
}

export default function Product({ id }: ProductProps) {
  const router = useRouter();
  const { data: product, isLoading, error } = useProduct(id);
  const { data: account } = useUser();
  const [quantity, setQuantity] = useState(1);

  const {
    actionLoading,
    handlePurchaseNow,
    handleAddToCart,
    handleContactSeller,
  } = useProductActions({ product, account: account as AccountInfo, quantity });

  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (newQuantity > 0 && newQuantity <= (product?.stock || 0)) {
        setQuantity(newQuantity);
      }
    },
    [product?.stock]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg">Đang tải thông tin sản phẩm...</p>
        </main>
      </div>
    );
  }

  // Error or not found
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground text-lg">Không tìm thấy sản phẩm</p>
          <Link href="/" className="text-primary hover:underline mt-4 inline-block">
            Quay lại trang chủ
          </Link>
        </main>
      </div>
    );
  }

  // Calculate rating (placeholder - would come from reviews API)
  const averageRating = 4.5;
  const totalReviews = 0;

  // Convert attributes to details format
  const productDetails =
    product.attributes?.map((attr: IAttribute) => `${attr.key}: ${attr.value}`) || [];

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Gallery Section */}
          <ProductGalleryNew
            images={product.images || [product.avatar]}
            productName={product.name}
            condition={product.condition || "Đã sử dụng"}
          />

          {/* Details Section */}
          <div className="flex flex-col">
            <ProductHeader
              name={product.name}
              averageRating={averageRating}
              totalReviews={totalReviews}
              sellerName={product.seller?.fullName }
            />

            {product.seller && (
              <SellerInfoCard
                seller={product.seller}
                onContactSeller={handleContactSeller}
              />
            )}

            <ProductPrice
              price={product.price}
              formattedPrice={product.price ? formatPrice(product.price) : "Liên hệ"}
            />

            <ProductSpecifications details={productDetails} />

            <QuantitySelector
              quantity={quantity}
              maxQuantity={product.stock || 0}
              onQuantityChange={handleQuantityChange}
            />

            <ProductActionButtons
              actionLoading={actionLoading}
              isOutOfStock={!product.stock || product.stock <= 0}
              onBuyNow={handlePurchaseNow}
              onAddToCart={handleAddToCart}
            />

<ProductGuarantees />
          </div>
     
        </div>

    
              <ProductDescription description={product.description} />
            

      </main>
    </div>
  );
}
