import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Enable experimental features if needed
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
    // Enable optimized navigation
    optimisticClientCache: true,
    // Faster dev server
    turbo: {
      loaders: {
        // Add custom loaders if needed
      },
      rules: {
        // Add custom rules if needed
      }
    }
  },
  
  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  },

  // Turbopack configuration (used when running with --turbopack)
  // Remove webpack config when using Turbopack

  // Enable strict mode
  reactStrictMode: true,

  // Disable powered by header
  poweredByHeader: false,

  // Compression
  compress: true,

  // Trailing slash
  trailingSlash: false,

  // Output configuration
  output: 'standalone',

  // Performance optimizations
  optimizeFonts: true,
  
  // Preload configuration for faster page transitions
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ];
  },
};

export default nextConfig;