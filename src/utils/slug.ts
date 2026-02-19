/**
 * Generate SEO-friendly slug from text
 * Removes Vietnamese accents, converts to lowercase, replaces spaces with hyphens
 * 
 * @param text - Text to convert to slug
 * @returns SEO-friendly slug
 * 
 * @example
 * generateSlug("iPhone 11 128GB Màu Đen") // "iphone-11-128gb-mau-den"
 * generateSlug("Áo thun nữ đẹp") // "ao-thun-nu-dep"
 */
export function generateSlug(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[đĐ]/g, "d") // Convert đ to d
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Generate unique slug by appending number if needed
 * 
 * @param text - Text to convert to slug
 * @param existingSlugs - Array of existing slugs to check against
 * @returns Unique slug
 * 
 * @example
 * generateUniqueSlug("iPhone 11", ["iphone-11"]) // "iphone-11-2"
 * generateUniqueSlug("iPhone 11", ["iphone-11", "iphone-11-2"]) // "iphone-11-3"
 */
export function generateUniqueSlug(
  text: string,
  existingSlugs: string[] = []
): string {
  const baseSlug = generateSlug(text);
  
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }

  let counter = 2;
  let uniqueSlug = `${baseSlug}-${counter}`;
  
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }

  return uniqueSlug;
}

/**
 * Extract ID from slug URL
 * Useful when URL pattern is /products/[id]/[slug]
 * 
 * @param url - URL or path containing ID and slug
 * @returns Extracted ID or null
 * 
 * @example
 * extractIdFromSlug("/products/123abc/iphone-11") // "123abc"
 * extractIdFromSlug("/products/456def") // "456def"
 */
export function extractIdFromSlug(url: string): string | null {
  const match = url.match(/\/([^/]+)(?:\/[^/]*)?$/);
  return match ? match[1] : null;
}

/**
 * Build product URL with ID and slug
 * 
 * @param id - Product ID
 * @param name - Product name (will be slugified)
 * @returns Product URL path
 * 
 * @example
 * buildProductUrl("123abc", "iPhone 11 128GB") // "/products/123abc/iphone-11-128gb"
 */
export function buildProductUrl(id: string, name: string): string {
  const slug = generateSlug(name);
  return `/products/${id}/${slug}`;
}

/**
 * Build category URL with slug
 * 
 * @param slug - Category slug (or name to be slugified)
 * @returns Category URL path
 * 
 * @example
 * buildCategoryUrl("điện thoại") // "/categories/dien-thoai"
 * buildCategoryUrl("dien-thoai") // "/categories/dien-thoai"
 */
export function buildCategoryUrl(slug: string): string {
  const cleanSlug = slug.includes("/") ? slug : generateSlug(slug);
  return `/categories/${cleanSlug}`;
}

/**
 * Validate slug format
 * 
 * @param slug - Slug to validate
 * @returns true if slug is valid
 */
export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
