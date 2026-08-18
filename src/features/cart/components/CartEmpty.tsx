"use client";

import {
  IconArrowRight,
  IconChevronRight,
  IconLayoutGrid,
  IconSearch,
  IconShoppingBag,
} from "@tabler/icons-react";
import Link from "next/link";
import useCategories from "@/hooks/useCategories";

export default function CartEmpty() {
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();
  const featuredCategories = categories.slice(0, 4);
  const featuredSubCategories = categories
    .flatMap((category) =>
      (category.subCategories ?? []).map((subCategory) => ({
        label: subCategory.name,
        href: `/categories/${category.slug}/sub/${subCategory.slug}`,
      })),
    )
    .slice(0, 3);

  return (
    <section className="relative overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-charcoal-100 blur-3xl opacity-50" />
        <div className="absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-charcoal-100 blur-3xl opacity-50" />
      </div>

      <div className="relative grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:items-center xl:p-16">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-[2px] border border-luxury-ink/10 bg-charcoal-50/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-charcoal-600">
            <IconShoppingBag className="h-3.5 w-3.5 text-luxury-ink" />
            Giỏ hàng
            <IconChevronRight className="h-3 w-3 text-charcoal-400" />
            Trống
          </div>

          <h3 className="mt-6 text-3xl text-luxury-ink sm:text-4xl">
            Giỏ hàng của bạn đang trống.
          </h3>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal-500 sm:text-base">
            Khám phá sản phẩm đã được kiểm duyệt, thêm vào giỏ và thanh toán
            trong vài bước. Bạn cũng có thể tìm nhanh theo danh mục hoặc từ
            khóa.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/search"
              className="group inline-flex h-11 min-w-[160px] items-center justify-center gap-2 whitespace-nowrap rounded-[2px] bg-luxury-ink px-6 text-[11px] uppercase tracking-[0.2em] font-bold text-white transition-colors duration-200 hover:bg-luxury-ink/90"
            >
              <IconSearch className="h-4 w-4" />
              Tìm sản phẩm
            </Link>

            <Link
              href="/products"
              className="inline-flex h-11 min-w-[190px] items-center justify-center gap-2 whitespace-nowrap rounded-[2px] border border-luxury-ink/20 bg-transparent px-6 text-[11px] uppercase tracking-[0.2em] font-bold text-luxury-ink transition-colors hover:bg-charcoal-50"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Gợi ý thông minh",
                description: "Lọc theo tình trạng, giá, vị trí.",
              },
              {
                title: "Chốt đơn nhanh",
                description: "Giỏ hàng → checkout mượt, rõ ràng.",
              },
              {
                title: "Giao dịch an tâm",
                description: "Thông báo & trạng thái đơn minh bạch.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-[2px] border border-luxury-ink/10 bg-charcoal-50/50 p-5"
              >
                <div className="text-[11px] uppercase tracking-wide font-bold text-luxury-ink">
                  {item.title}
                </div>
                <div className="mt-2 text-[13px] leading-relaxed text-charcoal-600">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[2px] border border-luxury-ink/10 bg-white p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-charcoal-500">
                  GỢI Ý NHANH
                </div>
                <div
                  className="font-droid-serif mt-2 text-lg text-luxury-ink"
                >
                  Bắt đầu từ danh mục
                </div>
                <p className="mt-1 text-sm text-charcoal-600">
                  Chọn danh mục thực tế từ hệ thống để khám phá nhanh sản phẩm.
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[2px] bg-charcoal-50 border border-luxury-ink/10 text-luxury-ink">
                <IconLayoutGrid className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {isLoadingCategories && (
                <div className="col-span-2 rounded-[2px] border border-luxury-ink/10 bg-charcoal-50/50 px-4 py-3 text-sm text-charcoal-500">
                  Đang tải danh mục...
                </div>
              )}

              {!isLoadingCategories &&
                featuredCategories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/categories/${category.slug}`}
                    className="group inline-flex items-center justify-between rounded-[2px] border border-luxury-ink/10 bg-white px-4 py-3 text-sm font-bold text-luxury-ink transition-colors hover:bg-charcoal-50"
                  >
                    <span className="truncate">{category.name}</span>
                    <IconArrowRight className="h-4 w-4 text-charcoal-400 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                ))}

              {!isLoadingCategories && featuredCategories.length === 0 && (
                <div className="col-span-2 rounded-[2px] border border-luxury-ink/10 bg-charcoal-50/50 px-4 py-3 text-sm text-charcoal-500">
                  Chưa có danh mục hiển thị. Bạn có thể duyệt toàn bộ sản phẩm.
                </div>
              )}
            </div>

            <div className="mt-8 rounded-[2px] border border-luxury-ink/10 bg-charcoal-50/50 p-5">
              <div className="text-[11px] uppercase tracking-wide font-bold text-luxury-ink">
                Danh mục con phổ biến
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {featuredSubCategories.length > 0 ? (
                  featuredSubCategories.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="inline-flex items-center rounded-[2px] border border-luxury-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-charcoal-700 transition-colors hover:bg-charcoal-100"
                    >
                      {item.label}
                    </Link>
                  ))
                ) : (
                  <span className="text-xs text-charcoal-500">
                    Chưa có danh mục con khả dụng.
                  </span>
                )}
              </div>
              <div className="mt-4 text-[13px] leading-relaxed text-charcoal-600">
                Mẹo: Bạn có thể bấm &quot;Mua ngay&quot; ở trang sản phẩm để đi
                thẳng tới checkout.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
