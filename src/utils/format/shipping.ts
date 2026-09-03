

export type ShippingMethodType = "local_pickup" | "ghn" | "unknown";

const GHN_NAME_MAP: Record<string, string> = {
  nhanh: "Giao hàng nhanh",
  express: "Giao hàng nhanh",
  "giao hàng nhanh": "Giao hàng nhanh",
  chuẩn: "Giao hàng tiêu chuẩn",
  chuan: "Giao hàng tiêu chuẩn",
  standard: "Giao hàng tiêu chuẩn",
  "giao hàng chuẩn": "Giao hàng tiêu chuẩn",
  "tiêu chuẩn": "Giao hàng tiêu chuẩn",
};


export function formatShippingMethod(method: string | null | undefined): string {
  if (!method) return "Chưa cập nhật";

  const trimmed = method.trim();
  const lower = trimmed.toLowerCase();

  if (lower === "local_pickup") return "Gặp mặt trực tiếp";

  if (lower.startsWith("ghn")) {
    const dashIdx = trimmed.indexOf(" - ");
    if (dashIdx === -1) return "GHN - Giao hàng tiêu chuẩn";

    const suffix = trimmed.slice(dashIdx + 3).trim();
    const mapped = GHN_NAME_MAP[suffix.toLowerCase()];
    return `GHN - ${mapped ?? suffix}`;
  }

  return trimmed;
}


export function getShippingMethodType(method: string | null | undefined): ShippingMethodType {
  if (!method) return "unknown";
  const lower = method.trim().toLowerCase();
  if (lower === "local_pickup") return "local_pickup";
  if (lower.startsWith("ghn")) return "ghn";
  return "unknown";
}
