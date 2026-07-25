"use client";

import Link from "next/link";
import Image from "next/image";
import {
  IconMapPin,
  IconArrowUpRight,
  IconSparkles,
  IconPackageOff,
} from "@tabler/icons-react";
import { useFeaturedProducts } from "@/hooks/useProducts";
import { useProvinces } from "@/hooks/useGHNLocation";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/format/price";
import type { IProduct } from "@/types/product";
import { useScrollReveal } from "../hooks";
import { Skeleton } from "@/components/shared";
import SectionHeader from "./SectionHeader";

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
              const imageUrl = item.avatar?.url ?? item.images?.[0]?.url;
              const provinceName = getProvinceName(item);

              return (
                <Link
                  key={item._id}
                  href={`/products/${item._id}/${item.slug ?? "san-pham"}`}
                  className={cn(
                    "group flex flex-col overflow-hidden border border-luxury-ink/8 bg-white p-3 transition-all duration-700 ease-out hover:-translate-y-1 hover:border-luxury-ink/15 hover:shadow-[0_20px_40px_color-mix(in_srgb,var(--luxury-ink)_8%,transparent)]",
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8",
                  )}
                  style={{
                    transitionDelay: `${160 + index * 90}ms`,
                    borderRadius: "2px",
                  }}
                >
                  <div
                    className="relative aspect-square w-full overflow-hidden bg-cream-100"
                    style={{ borderRadius: "1px" }}
                  >
                    {imageUrl ? (
                      <>
                        <Image
                          src={imageUrl}
                          alt=""
                          fill
                          className="object-cover opacity-30 blur-lg scale-125"
                          aria-hidden="true"
                        />

                        <div className="absolute inset-0 p-2">
                          <div className="relative h-full w-full">
                            <Image
                              src={imageUrl}
                              alt={item.name}
                              fill
                              className="object-contain drop-shadow-xs transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 50vw, 20vw"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center text-neutral-400">
                        <IconSparkles className="h-8 w-8 opacity-40" />
                      </div>
                    )}

                    <span className="absolute left-2 top-2 z-10 bg-luxury-ink/75 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                      {item.category?.name ?? "Mới"}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-1 flex-col justify-between px-0.5 pb-0.5">
                    <div>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-neutral-500 uppercase tracking-[0.14em]">
                        <IconMapPin className="h-3 w-3 text-blush-500 shrink-0" />
                        <span className="line-clamp-1">{provinceName}</span>
                      </div>

                      <h3 className="mt-1.5 line-clamp-2 text-xs font-medium text-foreground leading-snug transition-colors group-hover:text-primary md:text-sm">
                        {item.name}
                      </h3>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-luxury-ink/6 pt-3">
                      <span className="text-sm font-normal tracking-tight text-primary md:text-base group-hover:text-blush-600">
                        {formatPrice(item.price)}
                      </span>
                      <div
                        className="flex h-7 w-7 items-center justify-center border border-luxury-ink/10 text-luxury-ink transition-all duration-300 group-hover:border-luxury-ink group-hover:bg-luxury-ink group-hover:text-white"
                        style={{ borderRadius: "999px" }}
                      >
                        <IconArrowUpRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
