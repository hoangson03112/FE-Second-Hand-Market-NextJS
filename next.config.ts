import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,

  // Caching & security headers
  async headers() {
    const headers: { source: string; headers: { key: string; value: string }[] }[] = [];

    if (isProd) {
      headers.push(
        {
          source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        {
          source: "/_next/static/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        },
        {
          source: "/fonts/:path*",
          headers: [
            {
              key: "Cache-Control",
              value: "public, max-age=31536000, immutable",
            },
          ],
        }
      );
    }

    headers.push({
      source: "/:path*",
      headers: [
        {
          key: "X-DNS-Prefetch-Control",
          value: "on",
        },
        {
          key: "X-Frame-Options",
          value: "SAMEORIGIN",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "origin-when-cross-origin",
        },
      ],
    });

    return headers;
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
