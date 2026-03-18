import type { Metadata } from "next";
import {
  fetchProductById,
  BASE_URL,
} from "@/lib/api-server";

type Props = { params: Promise<{ id: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProductById(id);
  if (!product) {
    return { title: "Sản phẩm | Eco Marketplace" };
  }

  const desc =
    (product.description && product.description.slice(0, 160)) ||
    `Mua ${product.name} chất lượng cao với giá tốt nhất`;
  const image =
    product.avatar?.url ||
    product.images?.[0]?.url ||
    `${BASE_URL}/images/product-placeholder.svg`;
  const url = `${BASE_URL}/products/${product._id}/${product.slug || "product"}`;

  return {
    title: `${product.name} | Eco Marketplace`,
    description: desc,
    openGraph: {
      title: product.name,
      description: desc,
      images: [{ url: image, alt: product.name }],
      type: "website",
      url,
      siteName: "Eco Marketplace",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: desc,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;
  const product = await fetchProductById(id);

  const jsonLd =
    product &&
    ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description?.slice(0, 200),
      image: product.avatar?.url || product.images?.[0]?.url,
      url: `${BASE_URL}/products/${product._id}/${product.slug || "product"}`,
      ...(product.price && {
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "VND",
          availability: "https://schema.org/InStock",
        },
      }),
    } satisfies Record<string, unknown>);

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
