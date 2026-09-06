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
        <div className="mb-8 flex items-center justify-between gap-3 border-b border-luxury-ink/10 pb-5">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.15em] text-neutral-500 transition-colors hover:text-luxury-ink"
          >
            <IconArrowLeft className="h-4 w-4" />
            Về trang chủ
          </button>
          <span className="text-2xs font-bold uppercase tracking-[0.18em] text-neutral-400">
            Đăng ký Seller
          </span>
        </div>

        <section className="mx-auto max-w-3xl rounded-[2px] border border-luxury-ink/10 bg-white p-8 sm:p-10 shadow-xs">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-[2px] bg-cream-50 border border-luxury-ink/10">
              <IconCircleCheck className="h-8 w-8 text-accent" />
            </div>

            <p className="mt-4 text-2xs font-bold uppercase tracking-[0.2em] text-neutral-500">
              Hồ sơ đã được tiếp nhận
            </p>
            <h1 className="mt-2 font-droid-serif text-3xl font-bold text-luxury-ink sm:text-4xl">
              Gửi hồ sơ Seller thành công
            </h1>
            <p className="mt-3 max-w-xl text-xs leading-relaxed text-neutral-600">
              Ban Quản Trị Eco Market sẽ xem xét và xác minh thông tin giấy tờ của bạn trong vòng 24 giờ.
              Kết quả phê duyệt sẽ được gửi trực tiếp đến email của bạn.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 p-4 text-left">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-[2px] bg-white border border-luxury-ink/10">
                <IconClock className="h-4 w-4 text-luxury-ink" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-luxury-ink">Xét duyệt nhanh</p>
              <p className="mt-1 text-2xs text-neutral-500">Thông thường trong vòng 24 giờ</p>
            </div>

            <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 p-4 text-left">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-[2px] bg-white border border-luxury-ink/10">
                <IconMail className="h-4 w-4 text-luxury-ink" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-luxury-ink">Thông báo Email</p>
              <p className="mt-1 text-2xs text-neutral-500">Nhận kết quả ngay khi duyệt</p>
            </div>

            <div className="rounded-[2px] border border-luxury-ink/10 bg-cream-50/60 p-4 text-left">
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-[2px] bg-white border border-luxury-ink/10">
                <IconBuildingStore className="h-4 w-4 text-luxury-ink" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-luxury-ink">Bán hàng không giới hạn</p>
              <p className="mt-1 text-2xs text-neutral-500">Mở khóa toàn bộ tính năng</p>
            </div>
          </div>

          <div className="mt-6 rounded-[2px] border border-luxury-champagne/30 bg-luxury-champagne/8 p-4">
            <p className="text-xs leading-relaxed text-neutral-700">
              Đội ngũ kiểm duyệt đang xử lý hồ sơ. Trong thời gian này, bạn vẫn có thể đăng bán các sản phẩm thường trong hạn mức thành viên.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sell"
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[2px] bg-luxury-ink px-6 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ivory transition-colors hover:bg-charcoal-800"
            >
              <IconBuildingStore className="h-4 w-4" />
              Khám phá đăng bán
            </Link>
            <Link
              href="/"
              className="flex h-11 flex-1 items-center justify-center rounded-[2px] border border-luxury-ink/20 bg-white px-6 text-2xs font-bold uppercase tracking-[0.14em] text-luxury-ink transition-colors hover:bg-taupe-50"
            >
              Về trang chủ
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
