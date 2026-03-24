"use client";

import {
  IconArrowRight,
  IconChevronRight,
  IconSearch,
  IconShoppingBag,
} from "@tabler/icons-react";
import Link from "next/link";

export default function CartEmpty() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/70 bg-white shadow-2xl shadow-black/10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="relative grid gap-10 p-8 sm:p-10 lg:grid-cols-2 lg:items-center">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/30 px-3 py-1 text-xs font-semibold tracking-wide text-taupe-700">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconShoppingBag className="h-3.5 w-3.5" />
            </span>
            Giỏ hàng
            <IconChevronRight className="h-3.5 w-3.5 text-taupe-400" />
            Trống
          </div>

          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-taupe-950 sm:text-3xl">
            Giỏ hàng của bạn đang trống.
          </h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-taupe-600 sm:text-base">
            Khám phá sản phẩm đã được kiểm duyệt, thêm vào giỏ và thanh toán trong vài bước.
            Bạn cũng có thể tìm nhanh theo danh mục hoặc từ khóa.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/search"
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-primary/95"
            >
              <IconSearch className="h-4 w-4" />
              Tìm sản phẩm
              <IconArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            <Link
              href="/products"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-border bg-white px-5 text-sm font-semibold text-taupe-800 transition-colors hover:bg-muted/40"
            >
              Xem tất cả sản phẩm
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
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
                className="rounded-2xl border border-border/70 bg-gradient-to-b from-white to-muted/20 p-4"
              >
                <div className="text-sm font-semibold text-taupe-900">{item.title}</div>
                <div className="mt-1 text-xs leading-relaxed text-taupe-600">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-accent/15 blur-2xl" />
          <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-gradient-to-br from-cream-50 to-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold tracking-wide text-taupe-500">
                  GỢI Ý NHANH
                </div>
                <div className="mt-1 text-base font-semibold text-taupe-900">
                  Bắt đầu từ danh mục
                </div>
                <p className="mt-1 text-sm text-taupe-600">
                  Chọn danh mục để xem những món đang hot.
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <IconShoppingBag className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                { label: "Thời trang", href: "/categories/thoi-trang" },
                { label: "Đồ điện tử", href: "/categories/do-dien-tu" },
                { label: "Nội thất", href: "/categories/noi-that" },
                { label: "Sách", href: "/categories/sach" },
              ].map((chip) => (
                <Link
                  key={chip.label}
                  href={chip.href}
                  className="group inline-flex items-center justify-between rounded-2xl border border-border/70 bg-white px-3 py-2 text-sm font-semibold text-taupe-800 transition-colors hover:bg-muted/40"
                >
                  <span className="truncate">{chip.label}</span>
                  <IconArrowRight className="h-4 w-4 text-taupe-400 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-muted/30 p-4">
              <div className="text-xs font-semibold text-taupe-700">
                Tip
              </div>
              <div className="mt-1 text-xs leading-relaxed text-taupe-600">
                Bạn có thể bấm “Mua ngay” ở trang sản phẩm để đi thẳng tới checkout.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
