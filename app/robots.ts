import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/favicon.ico", "/icon", "/apple-icon", "/opengraph-image"],
        disallow: ["/api/", "/trip/*/print", "/departure/failed", "/departure/success", "/*?"],
      },
    ],
    sitemap: "https://walkthroughnepal.com/sitemap.xml",
  }
}
