/**
 * Server-side API helpers for SEO (metadata, sitemap).
 * Uses native fetch - no auth needed for public endpoints.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

async function fetchApi<T>(path: string): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}${path}`, {
      next: { revalidate: 60 }, // cache 1 min
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data?.data ?? data) as T;
  } catch {
    return null;
  }
}

export interface ServerProduct {
  _id: string;
  name: string;
  slug?: string;
  price?: number;
  description?: string;
  avatar?: { url?: string };
  images?: { url?: string }[];
  status?: string;
  updatedAt?: string;
}

export interface ServerCategory {
  _id: string;
  name: string;
  slug: string;
  status?: string;
  subCategories?: { _id: string; name: string; slug: string }[];
}

export async function fetchProductById(id: string): Promise<ServerProduct | null> {
  return fetchApi<ServerProduct>(`/products/${id}`);
}

export async function fetchProductsForSitemap(limit = 500): Promise<ServerProduct[]> {
  const data = await fetchApi<{ data?: ServerProduct[] }>(
    `/products/all?limit=${limit}&page=1`
  );
  if (!data) return [];
  const arr = (data as { data?: ServerProduct[] }).data;
  return Array.isArray(arr) ? arr.slice(0, limit) : [];
}

export async function fetchCategoriesForSitemap(): Promise<ServerCategory[]> {
  const data = await fetchApi<ServerCategory[] | { data: ServerCategory[] }>("/categories");
  if (!data) return [];
  return Array.isArray(data) ? data : (data as { data: ServerCategory[] }).data ?? [];
}

export { BASE_URL };
