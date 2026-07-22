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
    <section className="relative w-full py-8 md:py-16">
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-9xl px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        )}
      >
        {/* Header Section */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-neutral-200 pb-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-foreground">
              Sản phẩm nổi bật
            </p>
            <h2
              style={{
                fontFamily: "var(--font-droid-serif), serif",
                fontWeight: 400,
                lineHeight: 1.05,
              }}
              className=" mt-2 text-sm font-semibold tracking-tight text-primary md:text-[2.6rem]"
            >
              Tuyển chọn <span className="text-accent">mới nhất</span>
            </h2>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center text-xs uppercase font-medium text-foreground  hover:text-taupe-700"
          >
            Xem tất cả
            <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
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
            {featuredProducts.map((item) => {
              const imageUrl = item.avatar?.url ?? item.images?.[0]?.url;
              const provinceName = getProvinceName(item);

              return (
                <Link
                  key={item._id}
                  href={`/products/${item._id}/${item.slug ?? "san-pham"}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-neutral-200/80 bg-white p-2.5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100">
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

                    <span className="absolute left-2 top-2 z-10 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
                      {item.category?.name ?? "Mới"}
                    </span>
                  </div>

                  <div className="mt-2.5 flex flex-1 flex-col justify-between px-0.5 pb-0.5">
                    <div>
                      <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 uppercase tracking-wider">
                        <IconMapPin className="h-3 w-3 text-red-500 shrink-0" />
                        <span className="line-clamp-1">{provinceName}</span>
                      </div>

                      <h3 className="mt-1 line-clamp-2 text-xs md:text-sm font-semibold text-foreground transition-colors group-hover:text-foreground leading-snug">
                        {item.name}
                      </h3>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between border-t border-neutral-100 pt-2">
                      <span className="text-sm md:text-base font-bold text-primary tracking-tight group-hover:text-red-700">
                        {formatPrice(item.price)}
                      </span>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors group-hover:bg-[#5FB160] group-hover:text-white">
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
