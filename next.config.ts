import type { NextConfig } from "next"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.walkthroughnepal.com", pathname: "/uploads/**" },
      { protocol: "https", hostname: "cms.walkthroughnepal.com", pathname: "/uploads/**" },
      { protocol: "https", hostname: "cms.walkthroughnepal.com", pathname: "/api/uploads/**" },
      { protocol: "https", hostname: "cms.walkthroughnepal.com", pathname: "/wp-content/**" },
      { protocol: "https", hostname: "walkthroughnepal.com", pathname: "/wp-content/**" },
      {
        protocol: "https",
        hostname: "api.growfore.com",
        pathname: "/api/v1/uploads/**",
      },
      {
        protocol: "https",
        hostname: "growfore.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/cms/uploads/:path*",
        destination: "https://cms.walkthroughnepal.com/api/uploads/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: `${API}/uploads/:path*`,
      },
    ]
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://api.walkthroughnepal.com https://cms.walkthroughnepal.com https://walkthroughnepal.com https://picsum.photos https://fastly.picsum.photos https://new.walkthroughnepal.com",
              "connect-src 'self' https://api.walkthroughnepal.com",
              "frame-src https://challenges.cloudflare.com",
              "font-src 'self'",
            ].join("; "),
          },
        ],
      },
    ]
  },
}

export default nextConfig
