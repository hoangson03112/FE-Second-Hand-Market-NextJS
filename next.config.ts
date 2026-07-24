import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // Work around Next.js dev runtime crash:
    // "Could not find ... segment-explorer-node.js#SegmentViewNode"
    devtoolSegmentExplorer: false,
  },

  // ESLint is run separately (eslint-config-next + @rushstack/eslint-patch
  // are incompatible with ESLint v9 flat config when invoked by next build).
  // Run: npx eslint src --ext .ts,.tsx
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "img.vietqr.io", pathname: "/**" },
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
  // NOTE: no `env` block here. Next.js already exposes every `NEXT_PUBLIC_*`
  // var to the client automatically, and the old block also leaked the secret
  // GHN token into the browser bundle. GHN now goes through the /api/ghn proxy.
};

export default nextConfig;
