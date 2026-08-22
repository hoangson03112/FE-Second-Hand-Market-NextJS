"use client";

import { IconArrowLeft, IconTruck, IconMapPin } from "@tabler/icons-react";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/features/auth/hooks/useUser";
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
  ProductReviewsSection,
} from "./components";
import { useProduct, useProductReviews } from "@/hooks";
import { NotFoundView, PageLoader } from "@/components/ui";
import { useProductActions } from "./hooks/useProductActions";

interface ProductProps {
  id: string;
}

export default function Product({ id }: ProductProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: product, isLoading, error } = useProduct(id);
  const { data: productReviewsData } = useProductReviews(product?._id ?? "");

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

  /* ── MÀN HÌNH LOADING ── */
  if (isLoading) {
    return (
      <PageLoader
        fullScreen
        eyebrow="Sản phẩm"
        title="Đang tải thông tin sản phẩm."
      />
    );
  }

  /* ── MÀN HÌNH LỖI / KHÔNG TÌM THẤY SẢN PHẨM ── */
  if (error || !product) {
    return (
      <NotFoundView
        code=""
        eyebrow="Không tìm thấy sản phẩm"
        title="Sản phẩm này không còn khả dụng."
        description="Sản phẩm có thể đã bị xóa, đã bán hoặc không tồn tại trên hệ thống. Bạn có thể tìm một sản phẩm tương tự."
        primaryAction={{ href: "/products", label: "Xem sản phẩm khác" }}
        secondaryAction={{ href: "/", label: "Về trang chủ" }}
        className="min-h-screen"
      />
    );
  }

  const reviewSummary = productReviewsData?.pages[0];
  const averageRating = reviewSummary?.avgRating ?? product.avgRating ?? 0;
  const totalReviews = reviewSummary?.totalReviews ?? product.totalReviews ?? 0;

  // Chuyển đổi attributes thành dạng details
  const productDetails =
    product.attributes?.map(
      (attr: IAttribute) => `${attr.key}: ${attr.value}`,
    ) || [];

  return (
    <div className="min-h-screen bg-luxury-ivory text-luxury-ink font-sans selection:bg-luxury-ink selection:text-white">
      <main className="max-w-9xl mx-auto px-4 md:px-8 py-10">
        <button
          onClick={() => router.back()}
          className="font-droid-serif inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.15em] text-foreground hover:text-luxury-ink transition-colors mb-8 group"
        >
          <IconArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Trở lại
        </button>

        {/* LAYOUT CHÍNH: GALLERY & THÔNG TIN SẢN PHẨM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-6">
          {/* CỘT TRÁI: Gallery Hình Ảnh & Thông Số Kỹ Thuật */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-8">
            <ProductGalleryNew
              images={product.images || [product.avatar]}
              productName={product.name}
              condition={product.condition || "Đã sử dụng"}
            />
            <ProductSpecifications details={productDetails} />
          </div>

          {/* CỘT PHẢI: Thông Tin Chi Tiết & Hành Động */}
          <div className="lg:col-span-6 xl:col-span-7 flex flex-col">
            <ProductHeader
              name={product.name}
              averageRating={averageRating}
              totalReviews={totalReviews}
              productId={product._id}
              productSlug={product.slug}
              productImage={product.avatar?.url || product.images?.[0]?.url}
              category={product.category}
              subcategory={product.subcategory}
            />

            {product.seller && (
              <SellerInfoCard
                location={product.address?.provinceId || ""}
                seller={product.seller}
                onContactSeller={handleContactSeller}
              />
            )}
            <div className="flex justify-between items-center">
              {" "}
              <ProductPrice
                price={product.price}
                formattedPrice={
                  product.price ? formatPrice(product.price) : "Liên hệ"
                }
                originalPrice={product.originalPrice}
                hasPersonalDiscount={product.hasPersonalDiscount}
              />
              {(product.stock ?? 0) === 0 && (
                <div className="inline-flex items-center justify-center rounded-[2px] bg-taupe-50/50 text-taupe-500 border border-luxury-ink/10 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em]">
                  Hết hàng
                </div>
              )}
              {(product.stock ?? 0) === 1 && (
                <div className="inline-flex items-center justify-center rounded-[2px] bg-blush-50 text-blush-600 border border-blush-200 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em]">
                  Chỉ còn 1 sản phẩm duy nhất
                </div>
              )}
              {(product.stock ?? 0) > 1 && (
                <div className="text-sm font-bold uppercase tracking-wide text-charcoal-400">
                  Còn lại:{" "}
                  <span className="font-medium text-luxury-ink">
                    {product.stock} sản phẩm
                  </span>
                </div>
              )}
            </div>

            {/* HÌNH THỨC GIAO HÀNG */}
            {product.deliveryOptions && (
              <div className="flex flex-wrap gap-3 py-2 ">
                {product.deliveryOptions.codShipping && (
                  <div className="inline-flex items-center gap-2 rounded-[2px] bg-white text-luxury-ink border border-luxury-ink/10 px-3.5 py-2 text-[11px] uppercase tracking-wide font-bold">
                    <IconTruck className="h-4 w-4 text-primary" />
                    Giao hàng tận nhà (COD)
                  </div>
                )}
                {product.deliveryOptions.localPickup && (
                  <div className="inline-flex items-center gap-2 rounded-[2px] bg-white text-luxury-ink border border-luxury-ink/10 px-3.5 py-2 text-[11px] uppercase tracking-wide font-bold">
                    <IconMapPin className="h-4 w-4 text-red-500" />
                    Giao dịch trực tiếp
                  </div>
                )}
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
          </div>
        </div>

        {/* MÔ TẢ & ĐÁNH GIÁ SẢN PHẨM */}
        <div className="space-y-12 border-t border-luxury-ink/10 pt-6">
          <ProductDescription description={product.description} />
          <ProductReviewsSection productId={product._id} />
        </div>

        {/* NÚT BÁO CÁO */}
        {account && (
          <div className="mt-14 text-center pb-8">
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="text-xs uppercase tracking-[0.15em] font-bold text-charcoal-500 hover:text-blush-600 transition-colors underline underline-offset-4"
            >
              Báo cáo sản phẩm này
            </button>
          </div>
        )}

        {/* MODAL BÁO CÁO */}
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
