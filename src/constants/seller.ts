import React from "react";

/**
 * Seller-related constants
 * Become seller, verification, and product limits
 */

// ============================================================================
// Seller Limits
// ============================================================================

/** Giới hạn số sản phẩm cho người bán chưa verify */
export const UNVERIFIED_SELLER_PRODUCT_LIMIT = 5;

// ============================================================================
// Become Seller Features
// ============================================================================

export const becomeSellerFeatures = [
  {
    icon: React.createElement(
      "svg",
      {
        className: "w-6 h-6 text-white",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      })
    ),
    title: "Bán hàng dễ dàng",
    description: "Đăng sản phẩm, quản lý đơn và nhận thanh toán ngay trên nền tảng",
    gradient: "bg-gradient-to-br from-primary to-primary-dark",
  },
  {
    icon: React.createElement(
      "svg",
      {
        className: "w-6 h-6 text-white",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
      },
      React.createElement("path", {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
      })
    ),
    title: "Xác minh an toàn",
    description: "Thông tin CCCD và ngân hàng được bảo mật, duyệt trong 24h",
    gradient: "bg-gradient-to-br from-taupe-500 to-taupe-600",
  },
];
