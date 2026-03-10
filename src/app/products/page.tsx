import type { Metadata } from "next";
import AllProducts from "@/features/products/AllProducts";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm | Eco Market",
  description: "Khám phá hàng ngàn sản phẩm second-hand chất lượng tại Eco Market",
};

export default function ProductsPage() {
  return <AllProducts />;
}
