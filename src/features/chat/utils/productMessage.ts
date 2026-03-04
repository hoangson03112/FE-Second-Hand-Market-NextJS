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
  /Xin chào! Tôi quan tâm đến sản phẩm:\n\n📦 (.+)\n💰 (.+)\n(?:🖼️|�️) (.*)\n(?:🔗|�🔗) (.+)/;

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
