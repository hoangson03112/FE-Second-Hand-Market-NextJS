import type { Metadata } from "next";

import { NotFoundView } from "@/components/ui";

export const metadata: Metadata = {
  title: "Không tìm thấy trang",
  description:
    "Đường dẫn bạn truy cập không tồn tại. Quay lại trang chủ Eco Market để tiếp tục mua sắm.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundView />;
}
