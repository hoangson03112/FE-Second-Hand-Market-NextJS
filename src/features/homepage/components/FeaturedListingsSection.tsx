"use client";


import {

  IconPackageOff,
} from "@tabler/icons-react";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { useProvinces } from "@/hooks/useGHNLocation";
import { cn } from "@/lib/utils";
import type { IProduct } from "@/types/product";
import { useScrollReveal } from "../hooks";
import { Skeleton } from "@/components/shared";
import SectionHeader from "./SectionHeader";
import { ProductCard } from "@/features/categories/components";

export default function FeaturedListingsSection() {
  const { data, isLoading } = useFeaturedProducts(5);
  const { data: provinces = [] } = useProvinces();
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1, delay: 160 });
  const featuredProducts = data?.data ?? [];

  const getProvinceName = (item: IProduct) => {
    if (item.seller?.province) return item.seller.province;
    if (item.seller?.from_province_id) {
      const match = provinces.find(
        (p) => String(p.ProvinceID) === String(item.seller?.from_province_id),
      );
      if (match) return match.ProvinceName;
    }
    return "Toàn quốc";
  };

  return (
    <section className="relative w-full border-t border-luxury-ink/6 py-20 md:py-28">
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-9xl px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        )}
      >
        <div
          className={cn(
            "transition-all duration-700 ease-out",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
          )}
          style={{ transitionDelay: "80ms" }}
        >
          <SectionHeader
            eyebrow="Sản phẩm nổi bật"
            title={
              <>
                Tuyển chọn <span className="text-accent">mới nhất</span>
              </>
            }
            action={{ label: "Xem tất cả", href: "/products" }}
          />
        </div>

        {/* Layout Grid 5 Cột */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-5">
            {[...Array(5)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-[300px] w-full rounded-2xl bg-neutral-200/80"
              />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center shadow-xs">
            <IconPackageOff className="h-8 w-8 text-neutral-400" />
            <p className="mt-2 text-sm text-neutral-500">
              Chưa có sản phẩm nổi bật nào.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5 lg:gap-5">
            {featuredProducts.map((item, index) => {
              const provinceName = getProvinceName(item);

              return (
                <ProductCard
                  key={index}
                  product={item}
                  provinceName={provinceName}
                ></ProductCard>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
