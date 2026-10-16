import type { NextConfig } from "next"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

const nextConfig: NextConfig = {
  images: {
    // q100 keeps source fidelity; savings come from AVIF/WebP + right-sized widths
    qualities: [100],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: "https", hostname: "api.walkthroughnepal.com" },
      { protocol: "https", hostname: "cms.walkthroughnepal.com" },
      { protocol: "https", hostname: "walkthroughnepal.com" },
      { protocol: "https", hostname: "new.walkthroughnepal.com" },
      { protocol: "https", hostname: "growfore.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.googletagmanager.com https://embed.tawk.to https://*.tawk.to",
              "style-src 'self' 'unsafe-inline' https://embed.tawk.to",
              "img-src 'self' data: blob: https://api.walkthroughnepal.com https://cms.walkthroughnepal.com https://walkthroughnepal.com https://picsum.photos https://fastly.picsum.photos https://new.walkthroughnepal.com https://growfore.com https://*.tawk.to https://www.googletagmanager.com https://*.google-analytics.com",
              "connect-src 'self' https://api.walkthroughnepal.com https://challenges.cloudflare.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com https://*.tawk.to wss://*.tawk.to",
              "frame-src https://challenges.cloudflare.com https://*.tawk.to",
              "font-src 'self' https://embed.tawk.to",
            ].join("; "),
          },
        ],
      },
    ]
  },
}

export default nextConfig
