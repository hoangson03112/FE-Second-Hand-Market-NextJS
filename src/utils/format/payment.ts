

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


function formatPaymentOnly(method: string | null | undefined): string {
  if (!method) return "Chưa cập nhật";
  const m = method.trim().toLowerCase();
  const map: Record<string, string> = {
    cod: "Thanh toán khi nhận hàng (COD)",
    bank_transfer: "Chuyển khoản ngân hàng",
  };
  return map[m] ?? method;
}
