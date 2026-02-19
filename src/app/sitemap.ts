import { MetadataRoute } from "next";

// Sitemap tĩnh - có thể mở rộng với API để lấy products động
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://eco-marketplace.vn";
  
  const currentDate = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/become-seller`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // TODO: Fetch dynamic products from API
  // const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=1000`);
  // const products = await productsResponse.json();
  // const productPages = products.map((product) => ({
  //   url: `${baseUrl}/products/${product._id}/${product.slug}`,
  //   lastModified: new Date(product.updatedAt),
  //   changeFrequency: "weekly" as const,
  //   priority: 0.8,
  // }));

  // TODO: Fetch categories from API
  // const categoriesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
  // const categories = await categoriesResponse.json();
  // const categoryPages = categories.map((category) => ({
  //   url: `${baseUrl}/categories/${category.slug}`,
  //   lastModified: currentDate,
  //   changeFrequency: "daily" as const,
  //   priority: 0.7,
  // }));

  return [
    ...staticPages,
    // ...productPages,
    // ...categoryPages,
  ];
}
