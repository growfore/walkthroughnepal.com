import type { MetadataRoute } from "next"

const SITE_URL = "https://walkthroughnepal.com"
const API_BASE = process.env.API_URL ?? "https://api.walkthroughnepal.com"
const CMS_API_BASE = process.env.CMS_API_URL ?? "https://cms.walkthroughnepal.com"

async function fetchJSON<T>(path: string, base: string = API_BASE): Promise<T | null> {
  try {
    const res = await fetch(`${base}${path}`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/explore`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/design-your-trip`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/our-team`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/departure`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/inquiry`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/recommend`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ]

  // Dynamic: trip pages
  const tripPages: MetadataRoute.Sitemap = []
  try {
    const actRes = await fetchJSON<{ data: Array<{ id: number; slug: string; updatedAt: string }> }>(
      `/api/v1/activity?page=1&limit=500`
    )
    const acts = actRes?.data
    if (Array.isArray(acts)) {
      for (const a of acts) {
        if (a.slug) {
          tripPages.push({
            url: `${SITE_URL}/trip/${a.slug}`,
            lastModified: a.updatedAt || now,
            changeFrequency: "weekly",
            priority: 0.8,
          })
        }
      }
    }
  } catch {}

  // Dynamic: blog posts
  const blogPages: MetadataRoute.Sitemap = []
  try {
    const blogRes = await fetchJSON<{ posts: Array<{ slug: string; updatedAt: string }> }>(
      `/api/posts/published?page=1&limit=500`,
      CMS_API_BASE
    )
    if (blogRes?.posts) {
      for (const b of blogRes.posts) {
        blogPages.push({
          url: `${SITE_URL}/blog/${b.slug}`,
          lastModified: b.updatedAt || now,
          changeFrequency: "monthly",
          priority: 0.6,
        })
      }
    }
  } catch {}

  // Dynamic: categories
  const categoryPages: MetadataRoute.Sitemap = []
  try {
    const catRes = await fetchJSON<{ data: { tripCategories: Array<{ categoryHandle: string }> } }>(
      "/api/v1/trip-category"
    )
    if (catRes?.data?.tripCategories) {
      for (const c of catRes.data.tripCategories) {
        categoryPages.push({
          url: `${SITE_URL}/category/${c.categoryHandle}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      }
    }
  } catch {}

  // Dynamic: activity types
  const activityPages: MetadataRoute.Sitemap = []
  try {
    const typeRes = await fetchJSON<{ data: { tripTypes: Array<{ tripTypeHandle: string }> } }>(
      "/api/v1/trip-type"
    )
    if (typeRes?.data?.tripTypes) {
      for (const t of typeRes.data.tripTypes) {
        activityPages.push({
          url: `${SITE_URL}/activity/${t.tripTypeHandle}`,
          lastModified: now,
          changeFrequency: "weekly",
          priority: 0.7,
        })
      }
    }
  } catch {}

  // Dynamic: info pages
  const infoPages: MetadataRoute.Sitemap = []
  try {
    const infoRes = await fetchJSON<{ data: { pages: Array<{ slug: string; updatedAt: string }> } }>(
      "/api/v1/info-page?page=1&limit=500"
    )
    const pages = infoRes?.data?.pages
    if (Array.isArray(pages)) {
      for (const p of pages) {
        infoPages.push({
          url: `${SITE_URL}/${p.slug}`,
          lastModified: p.updatedAt || now,
          changeFrequency: "monthly",
          priority: 0.5,
        })
      }
    }
  } catch {}

  return [
    ...staticPages,
    ...tripPages,
    ...blogPages,
    ...categoryPages,
    ...activityPages,
    ...infoPages,
  ]
}
