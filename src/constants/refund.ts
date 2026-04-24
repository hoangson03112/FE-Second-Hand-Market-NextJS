/**
 * Refund-related constants
 */
import {
  IconTool,
  IconRepeat,
  IconFileSearch,
  IconPackage,
  IconMoodSad,
  IconDots,
} from "@tabler/icons-react";

export const REFUND_REASON_OPTIONS = [
  { value: "damaged", label: "Hàng bị hỏng", icon: IconTool, desc: "Sản phẩm bị vỡ hoặc hỏng khi nhận" },
  { value: "wrong_item", label: "Giao sai hàng", icon: IconRepeat, desc: "Nhận sai sản phẩm, màu hoặc kích thước" },
  { value: "not_as_described", label: "Không đúng mô tả", icon: IconFileSearch, desc: "Sản phẩm khác so với mô tả trên trang" },
  { value: "missing_parts", label: "Thiếu phụ kiện", icon: IconPackage, desc: "Thiếu linh kiện hoặc phụ kiện đi kèm" },
  { value: "quality_issue", label: "Chất lượng kém", icon: IconMoodSad, desc: "Chất lượng thực tế kém hơn kỳ vọng" },
  { value: "other", label: "Lý do khác", icon: IconDots, desc: "Lý do khác chưa được liệt kê ở trên" },
] as const;

export const REFUND_MAX_IMAGES = 10;
export const REFUND_MAX_VIDEOS = 3;

/**
 * Khớp cấu hình GHN (`payment_type_id: 1`): cước đơn hoàn về người bán do shop/seller chịu.
 * Dùng cho copy buyer & seller (đơn GHN).
 */
export const REFUND_GHN_RETURN_SHIPPING_PAID_BY_SELLER =
  "Phí vận chuyển đơn hoàn về người bán do người bán chịu (theo GHN); người mua không trả phí ship hoàn.";
