/**
 * Chuẩn hóa hiển thị phương thức thanh toán + giao dịch.
 * Hệ thống có 2 hình thức giao dịch:
 * 1. Trực tiếp — gặp mặt tại địa điểm 2 bên thống nhất
 * 2. Giao hàng GHN — COD (thanh toán khi nhận) hoặc chuyển khoản
 */

/**
 * Trả về nhãn tiếng Việt đầy đủ: hình thức giao dịch + phương thức thanh toán.
 * @param paymentMethod - cod | bank_transfer | momo | vnpay
 * @param options.shippingMethod - local_pickup | GHN - ...
 * @param options.isLocalPickup - true nếu giao dịch trực tiếp (dùng khi không có shippingMethod)
 */
export function formatPaymentMethod(
  paymentMethod: string | null | undefined,
  options?: { shippingMethod?: string; isLocalPickup?: boolean }
): string {
  if (!paymentMethod) return "Chưa cập nhật";
  const pay = paymentMethod.trim().toLowerCase();
  const isLocal =
    options?.isLocalPickup ??
    (options?.shippingMethod?.trim().toLowerCase() === "local_pickup");

  if (isLocal) return "Giao dịch trực tiếp";
  if (pay === "cod") return "Thanh toán khi nhận hàng (COD)";
  if (pay === "bank_transfer") return "Chuyển khoản ngân hàng";
  return `Giao hàng GHN — ${formatPaymentOnly(paymentMethod)}`;
}

/**
 * Chỉ format phương thức thanh toán, không kèm hình thức giao dịch.
 */
function formatPaymentOnly(method: string | null | undefined): string {
  if (!method) return "Chưa cập nhật";
  const m = method.trim().toLowerCase();
  const map: Record<string, string> = {
    cod: "Thanh toán khi nhận hàng (COD)",
    bank_transfer: "Chuyển khoản ngân hàng",
  };
  return map[m] ?? method;
}
