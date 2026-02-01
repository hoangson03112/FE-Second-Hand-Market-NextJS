import React from "react";

/** URL redirect sang backend OAuth Google. Cấu hình NEXT_PUBLIC_API_URL (vd: http://localhost:8080/eco-market). */
export const getGoogleLoginUrl = (): string => {
  const base = process.env.NEXT_PUBLIC_API_URL || "";
  return `${base.replace(/\/$/, "")}/auth/google`;
};

export const loginFeatures = [
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
        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
      })
    ),
    title: "Tìm kiếm thông minh",
    description: "Khám phá hàng nghìn sản phẩm chất lượng",
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
    title: "Bảo mật tuyệt đối",
    description: "Dữ liệu được mã hóa và bảo vệ an toàn",
    gradient: "bg-gradient-to-br from-taupe-500 to-taupe-600",
  },
];
