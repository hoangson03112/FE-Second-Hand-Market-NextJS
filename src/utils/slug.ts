
export function generateSlug(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}


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


export function extractIdFromSlug(url: string): string | null {
  const match = url.match(/\/([^/]+)(?:\/[^/]*)?$/);
  return match ? match[1] : null;
}


export function buildProductUrl(id: string, name: string): string {
  const slug = generateSlug(name);
  return `/products/${id}/${slug}`;
}


export function buildCategoryUrl(slug: string): string {
  const cleanSlug = slug.includes("/") ? slug : generateSlug(slug);
  return `/categories/${cleanSlug}`;
}


export function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
