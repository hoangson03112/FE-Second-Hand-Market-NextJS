"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "../hooks";

const values = [
  {
    title: "Mua bán có trách nhiệm",
    description:
      "Mỗi giao dịch là một lựa chọn tiêu dùng bền vững, giảm lãng phí và kéo dài vòng đời sản phẩm.",
    href: "/sell",
  },
  {
    title: "Tin cậy và minh bạch",
    description:
      "Ưu tiên thông tin rõ ràng về tình trạng, xuất xứ và mức giá để người mua ra quyết định nhanh hơn.",
    href: "/products",
  },
  {
    title: "Kết nối cộng đồng",
    description:
      "Tạo không gian nơi người dùng chia sẻ đồ tốt, trao đổi thân thiện và giữ lại giá trị sử dụng.",
    href: "/register",
  },
];

export default function PhilosophySection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.08, delay: 160 });

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg, #F8F2EA 0%, #F4ECE1 100%)",
      }}
      className="border-b border-taupe-200/70 py-12 md:py-16"
    >
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full max-w-9xl px-4 sm:px-6 lg:px-8 transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        )}
      >
        <div
          className={cn(
            "overflow-hidden rounded-2xl border border-taupe-200/80 bg-[#F8F4ED] shadow-[0_12px_32px_rgba(67,47,28,0.08)] transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          )}
          style={{ transitionDelay: "220ms" }}
        >
          <div className="grid items-stretch lg:grid-cols-12">
            <div className="relative p-7 md:p-10 lg:col-span-5 lg:p-12">
              <div className="pointer-events-none absolute -left-10 -top-16 h-44 w-44 rounded-full bg-[#E9D7C0]/50 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-16 right-4 h-40 w-40 rounded-full bg-[#DFC5A2]/40 blur-2xl" />

              <div className="relative">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-taupe-500">
                  Triết lý của chúng tôi
                </p>
                <h3 className="mt-3 text-[2rem] font-semibold leading-[1.1] tracking-tight text-taupe-900 md:text-[2.3rem]">
                  Mỗi món đồ cũ đều
                  <br />
                  xứng đáng một hành trình mới.
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-taupe-500">
                  Chúng tôi xây dựng nền tảng để việc mua bán đồ đã qua sử dụng trở nên an tâm, tiện lợi và giàu ý nghĩa hơn mỗi ngày.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  <span className="rounded-full border border-taupe-300 bg-cream-50 px-3 py-1 text-xs font-medium text-taupe-600">
                    Bền vững
                  </span>
                  <span className="rounded-full border border-taupe-300 bg-cream-50 px-3 py-1 text-xs font-medium text-taupe-600">
                    Minh bạch
                  </span>
                  <span className="rounded-full border border-taupe-300 bg-cream-50 px-3 py-1 text-xs font-medium text-taupe-600">
                    Thân thiện
                  </span>
                </div>

                <Link
                  href="/products"
                  className="mt-7 inline-flex items-center rounded-full border border-taupe-400 bg-cream-50 px-5 py-2 text-xs font-semibold text-taupe-700 transition-colors hover:bg-[#F3ECE2]"
                >
                  Khám phá sản phẩm
                </Link>
              </div>
            </div>

            <div className="grid gap-3 border-t border-taupe-200/70 bg-[#FBF8F3] p-6 md:grid-cols-2 md:p-8 lg:col-span-7 lg:border-l lg:border-t-0 lg:p-10">
              {values.map((item, idx) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "rounded-xl border border-taupe-200/80 bg-white/80 p-5 shadow-[0_6px_16px_rgba(66,48,30,0.06)] transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-taupe-300 hover:bg-white",
                    idx === 2 ? "md:col-span-2" : "",
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{ transitionDelay: `${260 + idx * 120}ms` }}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-taupe-400">
                    Giá trị {idx + 1}
                  </p>
                  <h4 className="mt-2 text-base font-semibold text-taupe-900">
                    {item.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-taupe-500">
                    {item.description}
                  </p>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-taupe-500">
                    Xem thêm
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
