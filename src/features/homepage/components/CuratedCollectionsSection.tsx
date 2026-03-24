"use client";

import Link from "next/link";

const collections = [
  {
    title: "Không gian tối giản",
    description: "Những món đồ gọn gàng, phù hợp nhà ở hiện đại.",
    gradient: "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1774026122/spacejoy-umAXneH4GhA-unsplash_s4q4i0.jpg",
  },
  {
    title: "Nâng cấp công nghệ",
    description: "Thiết bị công nghệ đã qua sử dụng, sẵn sàng cho vòng đời mới.",
    gradient: "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1774026123/ales-nesetril-Im7lZjxeLhg-unsplash_rako3c.jpg",
  },
  {
    title: "Đồ vintage tuyển chọn",
    description: "Những món đồ mang dấu ấn thời gian và câu chuyện riêng.",
    gradient: "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1774026121/abe-b-ryokan-7Uk-DPd0fZY-unsplash_y7cyko.jpg",
  },
];

export default function CuratedCollectionsSection() {
  return (
    <section
      style={{
        background:
          "linear-gradient(180deg, #FCF8F2 0%, #F9F3EB 100%)",
      }}
      className="border-y border-taupe-200/60 py-10 md:py-12"
    >
      <div className="mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-taupe-400">
              Gợi ý chọn lọc
            </p>
            <h2 className="mt-1 text-[2rem] font-semibold tracking-tight text-taupe-900">
              Bộ sưu tập nổi bật
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-taupe-500 transition-colors hover:text-taupe-700"
          >
            Xem tất cả +
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {collections.map((item) => (
            <article
              key={item.title}
              className="group relative overflow-hidden rounded-lg border border-taupe-200/70 shadow-[0_10px_22px_rgba(0,0,0,0.14)]"
            >
              <div
                className="h-[300px] w-full transition-transform duration-500 group-hover:scale-[1.03]"
                style={{
                  backgroundImage: `url(${item.gradient})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-lg font-semibold leading-tight">{item.title}</h3>
                <p className="mt-1 text-xs text-white/80">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
