"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { queryKeys } from "@/lib/query-client";
import { formatPrice } from "@/utils/format/price";
import type { IAttribute } from "@/types/product";
import type { AccountInfo } from "@/types/auth";
import {
  ProductGalleryNew,
  ProductHeader,
  SellerInfoCard,
  ProductPrice,
  ProductSpecifications,
  ProductDescription,
  QuantitySelector,
  ProductActionButtons,
  ReportProductModal,
} from "./components";
import { useProduct, useProductActions } from "./hooks";
import type { ProductProps } from "./Product.types";
import { PageContainer, Container } from "@/components/layout/Container";

export default function Product({ id }: ProductProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: product, isLoading, error } = useProduct(id);

  // Invalidate product list khi vào detail → quay lại list sẽ refetch stock mới nhất
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
  }, [id, queryClient]);
  const { data: account } = useUser();
  const [quantity, setQuantity] = useState(1);
  const [showReportModal, setShowReportModal] = useState(false);

  const {
    actionLoading,
    handlePurchaseNow,
    handleAddToCart,
    handleContactSeller,
  } = useProductActions({
    product: product ?? null,
    account: account as AccountInfo,
    quantity,
  });

  const handleQuantityChange = useCallback(
    (newQuantity: number) => {
      if (newQuantity > 0 && newQuantity <= (product?.stock || 0)) {
        setQuantity(newQuantity);
      }
    },
    [product?.stock],
  );

  // Loading state
  if (isLoading) {
    return (
      <PageContainer withBackground={false}>
        <Container
          as="main"
          maxWidth="7xl"
          paddingX="md"
          paddingY="lg"
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-neutral-600 text-lg">
            Đang tải thông tin sản phẩm...
          </p>
        </Container>
      </PageContainer>
    );
  }

  // Error or not found
  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background">
        <main className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-neutral-600 text-lg">Không tìm thấy sản phẩm</p>
          <Link
            href="/"
            className="text-primary hover:underline mt-4 inline-block"
          >
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
    product.attributes?.map(
      (attr: IAttribute) => `${attr.key}: ${attr.value}`,
    ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-cream-50/30 to-background">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8 font-medium"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="gap-4 flex-col flex">
            {/* Gallery Section */}
            <ProductGalleryNew
              images={product.images || [product.avatar]}
              productName={product.name}
              condition={product.condition || "Đã sử dụng"}
            />
            <ProductSpecifications details={productDetails} />
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <ProductHeader
              name={product.name}
              averageRating={averageRating}
              totalReviews={totalReviews}
              category={product.category}
              subcategory={product.subcategory}
            />

            {product.seller && (
              <SellerInfoCard
                seller={product.seller}
                onContactSeller={handleContactSeller}
              />
            )}

            <ProductPrice
              price={product.price}
              formattedPrice={
                product.price ? formatPrice(product.price) : "Liên hệ"
              }
            />

            {(product.stock ?? 0) === 0 && (
              <div className=" rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-2 text-sm font-medium my-3">
                Hết hàng
              </div>
            )}
            {(product.stock ?? 0) === 1 && (
              <div className="rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 px-3 py-2 text-sm font-medium my-3">
                Chỉ còn 1 sản phẩm
              </div>
            )}
            {(product.stock ?? 0) > 1 && (
              <div className="text-sm text-muted-foreground">
                Còn {product.stock} sản phẩm
              </div>
            )}

            <QuantitySelector
              quantity={quantity}
              maxQuantity={product.stock || 0}
              onQuantityChange={handleQuantityChange}
            />

            <ProductActionButtons
              account={account}
              actionLoading={actionLoading}
              isOutOfStock={!product.stock || product.stock <= 0}
              onBuyNow={handlePurchaseNow}
              onAddToCart={handleAddToCart}
            />

            {/* <ProductGuarantees /> */}
          </div>
        </div>

        <ProductDescription description={product.description} />

        {account && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="text-sm text-muted-foreground hover:text-red-600 underline"
            >
              Báo cáo sản phẩm này
            </button>
          </div>
        )}

        {showReportModal && (
          <ReportProductModal
            productId={product._id}
            productName={product.name}
            onClose={() => setShowReportModal(false)}
          />
        )}
      </main>
    </div>
  );
}
