import type { Activity, CMSPost, FeaturedTag, Pagination, Testimonial, TripCategory } from "./types"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

export function img(path: string | null | undefined, base = API): string {
  if (!path) return "/placeholder-image.png"
  const p = path.trim()
  if (p.startsWith("http://") || p.startsWith("https://")) return p
  if (p.startsWith("//")) return `https:${p}`
  const sep = p.startsWith("/") ? "" : "/"
  const b = base.endsWith("/") ? base.slice(0, -1) : base
  return `${b}${sep}${p}`
}

export function resolveContentImages(html: string, base = API): string {
  return html.replace(
    /(<img[^>]+src\s*=\s*)["']\/(?!\/)/gi,
    (m, prefix) => `${prefix}"${base}/`
  )
}

async function fetchJSON<T>(base: string, path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
      ...options?.headers,
    },
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error(`API ${res.status} on ${path}`)
  return res.json()
}

export function getActivities(filters?: Record<string, string>) {
  const qs = filters ? "?" + new URLSearchParams(filters).toString() : ""
  return fetchJSON<{ message: string; data: Activity[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(API, `/api/v1/activity${qs}`)
}

export function getActivityBySlug(slug: string) {
  return fetchJSON<{ message: string; data: Activity }>(API, `/api/v1/activity/slug/${slug}`)
}

export function getTripCategories() {
  return fetchJSON<{ message: string; data: { tripCategories: TripCategory[] } }>(API, "/api/v1/trip-category")
}

export function getTestimonials() {
  return fetchJSON<Testimonial[]>(API, "/api/v1/testimonial")
}

export function getFeaturedTags() {
  return fetchJSON<{ data: { featuredTags: FeaturedTag[] } }>(API, "/api/v1/featured?includeActivity=true")
}

export function getActivitiesByCategory(categoryHandle: string) {
  return getActivities({ category: categoryHandle })
}

export function getPublishedPosts(page = 1, limit = 10) {
  return fetchJSON<{ blogs: CMSPost[]; pagination: Pagination }>(API, `/api/v1/blogs/published?page=${page}&limit=${limit}`)
}

export function getPostBySlug(slug: string) {
  return fetchJSON<CMSPost>(API, `/api/v1/blogs/${slug}`)
}
