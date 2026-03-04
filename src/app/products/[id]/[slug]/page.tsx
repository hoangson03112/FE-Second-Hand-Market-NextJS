"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import Product from "@/components/feature/product/Product";
import { useProduct } from "@/hooks";

export default function ProductPage() {
  const params = useParams<{ id: string; slug: string }>();
  const id = typeof params.id === "string" ? params.id : params.id?.[0];

  // Fetch product for meta tags
  const { data: product } = useProduct(id || "");

  // Update meta tags when product loads
  useEffect(() => {
    if (product && typeof window !== 'undefined') {
      // Update page title
      document.title = `${product.name} - Eco Market`;

      // Update or create meta tags
      const updateMetaTag = (property: string, content: string) => {
        let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('property', property);
          document.head.appendChild(meta);
        }
        meta.content = content;
      };

      const updateMetaName = (name: string, content: string) => {
        let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute('name', name);
          document.head.appendChild(meta);
        }
        meta.content = content;
      };

      // Open Graph tags
      const url = `${window.location.origin}/products/${product._id}/${product.slug || 'product'}`;
      const image = product.avatar?.url || product.images?.[0]?.url || '/images/placeholder.png';
      const description = product.description 
        ? product.description.slice(0, 160) 
        : `Mua ${product.name} chất lượng cao với giá tốt nhất`;

      updateMetaTag('og:title', product.name);
      updateMetaTag('og:description', description);
      updateMetaTag('og:image', image);
      updateMetaTag('og:url', url);
      updateMetaTag('og:type', 'product');
      updateMetaTag('og:site_name', 'Eco Market');
      
      // Twitter Card tags
      updateMetaName('twitter:card', 'summary_large_image');
      updateMetaName('twitter:title', product.name);
      updateMetaName('twitter:description', description);
      updateMetaName('twitter:image', image);
      
      // Product specific
      if (product.price) {
        updateMetaTag('product:price:amount', product.price.toString());
        updateMetaTag('product:price:currency', 'VND');
      }
    }
  }, [product]);

  if (!id) return null;

  return <Product id={id} />;
}
