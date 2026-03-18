import { MetadataRoute } from "next";
import {
  BASE_URL,
  fetchProductsForSitemap,
  fetchCategoriesForSitemap,
} from "@/lib/api-server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: currentDate, changeFrequency: "daily" as const, priority: 1 },
    { url: `${BASE_URL}/products`, lastModified: currentDate, changeFrequency: "hourly" as const, priority: 0.9 },
    { url: `${BASE_URL}/become-seller`, lastModified: currentDate, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/login`, lastModified: currentDate, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${BASE_URL}/register`, lastModified: currentDate, changeFrequency: "monthly" as const, priority: 0.5 },
  ];

  const [products, categories] = await Promise.all([
    fetchProductsForSitemap(500),
    fetchCategoriesForSitemap(),
  ]);

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/products/${p._id}/${p.slug || "product"}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${BASE_URL}/categories/${c.slug}`,
    lastModified: currentDate,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const subCategoryPages: MetadataRoute.Sitemap = categories.flatMap((c) =>
    (c.subCategories || []).map((s) => ({
      url: `${BASE_URL}/categories/${c.slug}/sub/${s.slug}`,
      lastModified: currentDate,
      changeFrequency: "daily" as const,
      priority: 0.65,
    }))
  );

  return [...staticPages, ...productPages, ...categoryPages, ...subCategoryPages];
}
