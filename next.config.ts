import type { NextConfig } from "next"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

const nextConfig: NextConfig = {
  serverExternalPackages: ["@sparticuz/chromium"],
  outputFileTracingIncludes: {
    "/api/pdf": ["node_modules/@sparticuz/chromium/bin/**"],
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
        ],
      },
    ]
  },
}

export default nextConfig
