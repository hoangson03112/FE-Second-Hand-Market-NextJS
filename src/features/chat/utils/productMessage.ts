export interface ParsedProductMessage {
  isProductMessage: boolean;
  productId?: string;
  productName?: string;
  productPrice?: number;
  productSlug?: string;
  productImage?: string;
}

export interface BuildProductMessageInput {
  name: string;
  price: number;
  image?: string;
  url: string;
}

const PRODUCT_MESSAGE_REGEX =
  /Xin chào! Tôi quan tâm đến sản phẩm:\n\n📦 (.+)\n💰 (.+)\n🖼️ (.*)\n🔗 (.+)/;

export function buildProductMessage({
  name,
  price,
  image,
  url,
}: BuildProductMessageInput) {
  const priceText = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

  return `Xin chào! Tôi quan tâm đến sản phẩm:\n\n📦 ${name}\n💰 ${priceText}\n🖼️ ${image || ""}\n🔗 ${url}`;
}

// ─── Order message ────────────────────────────────────────────────────────────

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  picked_up: "Đã lấy hàng",
  shipping: "Đang giao",
  out_for_delivery: "Đang giao tận nơi",
  delivered: "Đã giao",
  completed: "Hoàn thành",
  failed: "Giao thất bại",
  returned: "Đã hoàn hàng",
  cancelled: "Đã hủy",
};

export interface BuildOrderMessageInput {
  orderId: string;
  status: string;
  ghnOrderCode?: string;
  products: Array<{ name: string; quantity: number; price: number }>;
  totalAmount: number;
}

export function buildOrderMessage({
  orderId,
  status,
  ghnOrderCode,
  products,
  totalAmount,
}: BuildOrderMessageInput): string {
  const fmt = (v: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);

  const statusLabel = ORDER_STATUS_LABELS[status] || status;
  const orderCode = ghnOrderCode ? `\nMã vận đơn GHN: ${ghnOrderCode}` : "";
  const productLines = products
    .map((p) => `  • ${p.name} ×${p.quantity} — ${fmt(p.price)}`)
    .join("\n");

  return `Xin chào! Tôi muốn hỏi về đơn hàng:\n\n🛍 Mã đơn: #${orderId.slice(-8).toUpperCase()}${orderCode}\n📋 Trạng thái: ${statusLabel}\n📦 Sản phẩm:\n${productLines}\n💰 Tổng: ${fmt(totalAmount)}`;
}

// ─── Parse product message ────────────────────────────────────────────────────

export function parseProductMessage(text: string): ParsedProductMessage {
  const match = text.match(PRODUCT_MESSAGE_REGEX);

  if (!match) return { isProductMessage: false };

  const [, name, priceStr, image, url] = match;
  const urlMatch = url.match(/\/products\/([^/]+)\/([^/]+)/);

  if (!urlMatch) return { isProductMessage: false };

  const [, id, slug] = urlMatch;

  return {
    isProductMessage: true,
    productId: id,
    productName: name,
    productPrice: parseInt(priceStr.replace(/[^\d]/g, ""), 10),
    productSlug: slug,
    productImage: image || undefined,
  };
}
