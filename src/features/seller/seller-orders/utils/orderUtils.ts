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

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Chưa thanh toán",
  paid: "Đã thanh toán",
  refunded: "Đã hoàn tiền",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getPaymentStatusLabel(status: string | undefined | null): string {
  if (!status) return "Không xác định";
  return PAYMENT_STATUS_LABELS[status] || status;
}

export function getBuyerName(order: Order): string {
  const buyer = (order as unknown as { buyerId?: unknown }).buyerId;
  if (isRecord(buyer) && typeof buyer.fullName === "string" && buyer.fullName.trim()) {
    return buyer.fullName;
  }
  return "—";
}

export function getBuyerEmail(order: Order): string {
  const buyer = (order as unknown as { buyerId?: unknown }).buyerId;
  if (isRecord(buyer) && typeof buyer.email === "string" && buyer.email.trim()) {
    return buyer.email;
  }
  return "—";
}

export function getBuyerPhone(order: Order): string {
  const buyer = (order as unknown as { buyerId?: unknown }).buyerId;
  if (isRecord(buyer) && typeof buyer.phoneNumber === "string" && buyer.phoneNumber.trim()) {
    return buyer.phoneNumber;
  }
  return "—";
}
