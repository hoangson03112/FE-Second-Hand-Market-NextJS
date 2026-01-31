import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GHN_API_URL: process.env.NEXT_PUBLIC_GHN_API_URL,
    NEXT_PUBLIC_GHN_CAL_FEE_URL: process.env.NEXT_PUBLIC_GHN_CAL_FEE_URL,
    NEXT_PUBLIC_GHN_TOKEN: process.env.NEXT_PUBLIC_GHN_TOKEN, 
    NEXT_PUBLIC_GHN_SHOP_ID: process.env.NEXT_PUBLIC_GHN_SHOP_ID,
  },
};

export default nextConfig;
