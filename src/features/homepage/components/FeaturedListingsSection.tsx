"use client";

import Link from "next/link";
import Image from "next/image";
import { IconMapPin } from "@tabler/icons-react";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { useProvinces } from "@/hooks/useGHNLocation";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";
import type { IProduct } from "@/types/product";
import { useScrollReveal } from "../hooks";

const CARD_GRADIENTS = [
  "linear-gradient(145deg, #f4f1ed 0%, #d8d2ca 45%, #9ea4ae 100%)",
  "linear-gradient(145deg, #f2dcc9 0%, #dfbe9f 52%, #bf9574 100%)",
  "linear-gradient(145deg, #264b45 0%, #3b6b63 52%, #72958f 100%)",
  "linear-gradient(145deg, #f2e7d8 0%, #d4ba96 48%, #a48053 100%)",
];

export default function FeaturedListingsSection() {
  const { data, isLoading } = useFeaturedProducts(4);
  const { data: provinces = [] } = useProvinces();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1, delay: 160 });
  const featuredProducts = data?.data ?? [];

  const renderCard = (
    item: IProduct | undefined,
    className: string,
    index: number,
    isCompact = false,
  ) => {
    if (!item) return null;
    const fallbackGradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
    const imageUrl = item.avatar?.url ?? item.images?.[0]?.url;
    const provinceName =
      item.seller?.province ||
      provinces.find(
        (province) =>
          String(province.ProvinceID) === String(item.seller?.from_province_id ?? ""),
      )?.ProvinceName ||
      "Chưa cập nhật";

    return (
      <Link
        href={`/products/${item._id}/${item.slug ?? "san-pham"}`}
        className={`group h-full overflow-hidden rounded-2xl border border-taupe-200/80 bg-[#FAF7F2] p-3 shadow-[0_10px_24px_rgba(60,42,24,0.08)] transition-transform duration-300 hover:-translate-y-0.5 ${className}`}
      >
        <div className="flex h-full flex-col">
          <div
            className={`relative w-full overflow-hidden rounded-xl ${isCompact ? "h-[236px]" : "h-[252px]"}`}
            style={!imageUrl ? { background: fallbackGradient } : undefined}
          >
            {imageUrl && (
              <>
                <Image
                  src={imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes={isCompact ? "(max-width: 1024px) 100vw, 25vw" : "(max-width: 1024px) 100vw, 50vw"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent" />
              </>
            )}
            <span className="absolute left-2.5 top-2.5 rounded-full bg-cream-50/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-taupe-700">
              {item.category?.name ?? "Nổi bật"}
            </span>
          </div>

          <div className="mt-3 flex flex-1 flex-col justify-between">
            <div>
              <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-taupe-900">
                {item.name}
              </h3>
              <p className="mt-1 line-clamp-1 text-xs text-taupe-500">
                {item.description?.trim() || "Sản phẩm đang được người dùng quan tâm nhiều."}
              </p>

            </div>
            <div className="flex justify-between">            <p className="mt-2 text-sm font-semibold text-taupe-700">{formatPrice(item.price)}</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-taupe-500 text-end">
                <IconMapPin className="h-3.5 w-3.5 shrink-0 text-red-500" />
                <span className="line-clamp-1">
                   <span className="font-medium text-taupe-700">{provinceName}</span>
                </span>
              </p></div>

          </div>
        </div>
      </Link>
    );
  };

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg, #F5EFE7 0%, #F2E9DE 100%)",
      }}
      className="border-b border-taupe-200/60 py-12 md:py-16"
    >
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8 transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        )}
      >
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-taupe-500">
              Chọn lọc mỗi tuần
            </p>
            <h2 className="mt-2 text-[2rem] font-semibold tracking-tight text-taupe-900">
              Sản phẩm nổi bật
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-taupe-500">
            Những món đồ có chất lượng tốt, mức giá hợp lý và được cộng đồng quan tâm nhiều nhất trong tuần này.
          </p>
        </div>

        <div
          className={cn(
            "grid gap-4 lg:grid-cols-12 lg:grid-rows-[386px_386px] transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          )}
          style={{ transitionDelay: "240ms" }}
        >
          {isLoading ? (
            <>
              <div className="h-full animate-pulse rounded-2xl bg-cream-100 lg:col-span-6 lg:row-start-1" />
              <div className="h-full animate-pulse rounded-2xl bg-cream-100 lg:col-span-3 lg:row-start-1" />
              <div className="h-full animate-pulse rounded-2xl bg-cream-100 lg:col-span-3 lg:row-start-1" />
              <div className="h-full animate-pulse rounded-2xl bg-cream-100 lg:col-span-6 lg:row-start-2" />
            </>
          ) : (
            <>
              {renderCard(featuredProducts[0], "lg:col-span-6 lg:row-start-1", 0)}
              {renderCard(featuredProducts[1], "lg:col-span-3 lg:row-start-1", 1, true)}
              {renderCard(featuredProducts[2], "lg:col-span-3 lg:row-start-1", 2, true)}
              {renderCard(featuredProducts[3], "lg:col-span-6 lg:row-start-2", 3)}
            </>
          )}

          <div className="flex h-full flex-col items-start justify-between rounded-2xl border border-dashed border-taupe-300/80 bg-[#F9F4EC] p-6 lg:col-span-6 lg:row-start-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-taupe-500">
                Gợi ý mua nhanh
              </p>
              <h3 className="mt-2 text-xl font-semibold leading-tight text-taupe-900">
                Tìm món phù hợp với ngân sách của bạn
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-taupe-500">
                Lọc theo nhu cầu, tình trạng và mức giá để thấy ngay các sản phẩm đáng mua nhất.
              </p>
              {!isLoading && featuredProducts.length === 0 && (
                <p className="mt-2 text-xs font-medium text-taupe-500">
                  Hiện chưa có sản phẩm nổi bật, vui lòng quay lại sau.
                </p>
              )}
            </div>
            <Link
              href="/products"
              className="inline-flex items-center rounded-full bg-taupe-700 px-7 py-2.5 text-xs font-semibold text-cream-50 shadow-[0_8px_20px_rgba(56,40,24,0.22)] transition-colors hover:bg-taupe-800"
            >
              Xem toàn bộ sản phẩm
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
