import type { Order } from "@/types/order";

export function getProductImage(
  product: Order["products"][number]["productId"] | undefined,
  imageErrorMap: Record<string, boolean>,
  orderId: string
): string {
  if (imageErrorMap[orderId]) return "/images/product-placeholder.svg";
  if (!product) return "/images/product-placeholder.svg";

  const avatar = product.avatar;
  if (typeof avatar === "string" && avatar.trim()) {
    return avatar;
  }
  if (
    avatar &&
    typeof avatar === "object" &&
    "url" in avatar &&
    typeof avatar.url === "string" &&
    avatar.url.trim()
  ) {
    return avatar.url;
  }

  const firstImage = product.images?.[0];
  if (
    firstImage &&
    typeof firstImage === "object" &&
    "url" in firstImage &&
    typeof firstImage.url === "string" &&
    firstImage.url.trim()
  ) {
    return firstImage.url;
  }

  return "/images/product-placeholder.svg";
}
