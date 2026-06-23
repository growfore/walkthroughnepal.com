import type { Activity, CMSPost, FeaturedTag, Pagination, Testimonial, TripCategory } from "./types"

const API = process.env.API_URL ?? "https://api.essencetreksnepal.com"
const CMS = process.env.CMS_API_URL ?? "https://cms.myeasyguide.com"

export function img(path: string | null | undefined, base = API): string {
  if (!path) return "/placholder-image.png"
  if (path.startsWith("http")) return path
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`
}

async function fetchJSON<T>(base: string, path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
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

export function getPublishedPosts(page = 1, limit = 10) {
  return fetchJSON<{ posts: CMSPost[]; pagination: Pagination }>(CMS, `/api/posts/published?page=${page}&limit=${limit}`)
}

export function getPostBySlug(slug: string) {
  return fetchJSON<{ post: CMSPost }>(CMS, `/api/posts/${slug}`)
}
