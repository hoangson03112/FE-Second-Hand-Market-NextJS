export interface CuratedCollection {
  title: string;
  description: string;
  gradient: string;
  href: string;
}

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    title: "Không gian tối giản",
    description: "Những món đồ gọn gàng, phù hợp nhà ở hiện đại.",
    gradient:
      "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1774026122/spacejoy-umAXneH4GhA-unsplash_s4q4i0.jpg",
    href: "/categories/do-dung-nha-cua",
  },
  {
    title: "Nâng cấp công nghệ",
    description: "Thiết bị công nghệ đã qua sử dụng, sẵn sàng cho vòng đời mới.",
    gradient:
      "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1774026123/ales-nesetril-Im7lZjxeLhg-unsplash_rako3c.jpg",
    href: "/categories/thiet-bi-dien-tu",
  },
  {
    title: "Đồ vintage tuyển chọn",
    description: "Những món đồ mang dấu ấn thời gian và câu chuyện riêng.",
    gradient:
      "https://res.cloudinary.com/dqvtj4uxo/image/upload/v1774026121/abe-b-ryokan-7Uk-DPd0fZY-unsplash_y7cyko.jpg",
    href: "/categories/vintage",
  },
];
