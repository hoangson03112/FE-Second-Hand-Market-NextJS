import React from "react";

export const registerFeatures = [
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
        d: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
      })
    ),
    title: "Cộng đồng lớn",
    description: "Kết nối với hàng nghìn người dùng",
    gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
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
    title: "An toàn & Bảo mật",
    description: "Dữ liệu được bảo vệ tuyệt đối",
    gradient: "bg-gradient-to-br from-primary to-primary-dark",
  },
];
