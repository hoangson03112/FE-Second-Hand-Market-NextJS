"use client";

import {
  IconArrowLeft,
  IconCircleCheck,
  IconClock,
  IconBuildingStore,
  IconMail,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BecomeSellerSuccess() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-luxury-ivory text-luxury-ink">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-3 border-b border-taupe-200/80 pb-5">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.15em] text-charcoal-500 transition-colors hover:text-luxury-ink"
          >
            <IconArrowLeft className="h-4 w-4" />
            Về trang chủ
          </button>
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal-400">
            Đăng ký Seller
          </span>
        </div>

        <section className="mx-auto max-w-3xl rounded-[32px] border border-taupe-200/80 bg-white/80 p-6 shadow-[0_18px_45px_rgba(28,27,24,0.05)] backdrop-blur-sm sm:p-8 lg:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f3e9dd] ring-8 ring-[#f7f1ea]">
              <IconCircleCheck className="h-10 w-10 text-emerald-600" />
            </div>

            <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal-400">
              Đăng ký thành công
            </p>
            <h1 className="mt-3 font-droid-serif text-3xl font-normal text-luxury-ink sm:text-4xl">
              Hồ sơ đã được gửi thành công!
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-charcoal-500">
              Chúng tôi sẽ xem xét hồ sơ của bạn và phản hồi trong vòng 24 giờ.
              Bạn sẽ nhận thông báo qua email khi có kết quả.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[22px] border border-taupe-200/80 bg-luxury-ivory p-4 text-left">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-taupe-200/80">
                <IconClock className="h-5 w-5 text-luxury-ink" />
              </div>
              <p className="text-sm font-medium text-luxury-ink">Xét duyệt nhanh</p>
              <p className="mt-1 text-xs text-charcoal-500">Thường trong vòng 24 giờ</p>
            </div>

            <div className="rounded-[22px] border border-taupe-200/80 bg-luxury-ivory p-4 text-left">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-taupe-200/80">
                <IconMail className="h-5 w-5 text-luxury-ink" />
              </div>
              <p className="text-sm font-medium text-luxury-ink">Thông báo qua email</p>
              <p className="mt-1 text-xs text-charcoal-500">Nhận kết quả ngay khi được duyệt</p>
            </div>

            <div className="rounded-[22px] border border-taupe-200/80 bg-luxury-ivory p-4 text-left">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-taupe-200/80">
                <IconBuildingStore className="h-5 w-5 text-luxury-ink" />
              </div>
              <p className="text-sm font-medium text-luxury-ink">Sẵn sàng bán hàng</p>
              <p className="mt-1 text-xs text-charcoal-500">Bắt đầu đăng sản phẩm ngay</p>
            </div>
          </div>

          <div className="mt-8 rounded-[24px] border border-amber-200 bg-amber-50/80 p-4">
            <p className="text-sm leading-6 text-amber-900">
              Đội ngũ Eco Market đang kiểm duyệt hồ sơ của bạn. Thông thường mất
              dưới <span className="font-bold">24 giờ</span> để xem xét.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sell"
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-luxury-ink px-5 text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-charcoal-700"
            >
              <IconBuildingStore className="h-4 w-4" />
              Khám phá tính năng Seller
            </Link>
            <Link
              href="/"
              className="flex h-12 flex-1 items-center justify-center rounded-full border border-taupe-200 bg-white px-5 text-sm font-bold uppercase tracking-[0.12em] text-luxury-ink transition-colors hover:border-luxury-ink/40 hover:bg-luxury-ivory"
            >
              Về trang chủ
            </Link>
          </div>

          <p className="mt-6 text-center text-xs uppercase tracking-[0.14em] text-charcoal-400">
            Hồ sơ sẽ được đội ngũ Eco Market kiểm duyệt trong vòng 24h.
          </p>
        </section>
      </div>
    </main>
  );
}
