import type { NextConfig } from "next"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/pdf": ["node_modules/@sparticuz/chromium/bin/**"],
    "/api/pdf/route": ["node_modules/@sparticuz/chromium/bin/**"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.walkthroughnepal.com", pathname: "/uploads/**" },
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
    ],
  },
  async rewrites() {
    return [
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
              "img-src 'self' data: blob: https://api.walkthroughnepal.com https://picsum.photos https://fastly.picsum.photos https://new.walkthroughnepal.com",
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
