import type { Metadata } from "next";

export function generateProductMetadata(product: {
  name: string;
  description?: string;
  price: number;
  condition?: string;
  avatar?: { url: string } | string;
  categoryId?: { name: string };
}): Metadata {
  const imageUrl =
    typeof product.avatar === "object" && product.avatar?.url
      ? product.avatar.url
      : typeof product.avatar === "string"
      ? product.avatar
      : "/placeholder.svg";

  const title = `${product.name} - ${product.condition || "Đồ cũ"} giá tốt`;
  const description =
    product.description?.slice(0, 160) ||
    `Mua ${product.name} giá tốt chỉ ${new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(product.price)}. ${product.categoryId?.name || "Sản phẩm"} chất lượng, uy tín.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "product",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function generateCategoryMetadata(category: {
  name: string;
  description?: string;
}): Metadata {
  const title = `${category.name} - Eco Marketplace`;
  const description =
    category.description || `Mua bán ${category.name} cũ giá tốt tại Eco Marketplace`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function generateSearchMetadata(query: string): Metadata {
  const title = `Tìm kiếm "${query}" - Eco Marketplace`;
  const description = `Kết quả tìm kiếm cho "${query}". Mua bán đồ cũ giá tốt tại Eco Marketplace.`;

  return {
    title,
    description,
    robots: {
      index: false, // Không index trang search
      follow: true,
    },
  };
}
