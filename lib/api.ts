import type { Activity, CMSPost, FeaturedTag, InfoPage, Pagination, Slot, Testimonial, TripCategory, TripType } from "./types"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

export function img(path: string | null | undefined, _base?: string): string {
  if (!path) return "/placeholder-image.png"
  const p = path.trim()
  if (p.startsWith("http://") || p.startsWith("https://")) return p
  if (p.startsWith("//")) return `https:${p}`
  // ponytail: same-domain proxy via rewrite at /uploads/*
  if (p.startsWith("/")) return p
  return `/${p}`
}

export function resolveContentImages(html: string, _base?: string): string {
  // ponytail: images served via rewrite at /uploads/* — no URL resolution needed
  return html
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

export function getTeamMembers() {
  return fetchJSON<{ message: string; data: any }>(API, "/api/v1/team")
}

export function getActivitiesByCategory(categoryHandle: string) {
  return getActivities({ category: categoryHandle })
}

export function getActivitiesByType(typeSlug: string) {
  return getActivities({ type: typeSlug })
}

export function getTripTypes() {
  return fetchJSON<{ message: string; data: { tripTypes: TripType[] } }>(API, "/api/v1/trip-type")
}

export function getPublishedPosts(page = 1, limit = 10, search?: string, category?: string) {
  let url = `/api/v1/blogs/published?page=${page}&limit=${limit}`
  if (search) url += `&search=${encodeURIComponent(search)}`
  if (category) url += `&category=${encodeURIComponent(category)}`
  return fetchJSON<{ blogs: CMSPost[]; pagination: Pagination }>(API, url)
}

export function getPostBySlug(slug: string) {
  return fetchJSON<CMSPost>(API, `/api/v1/blogs/${slug}`)
}

export function getInfoPageBySlug(slug: string) {
  return fetchJSON<{ infoPage: InfoPage }>(API, `/api/v1/info-page/slug/${slug}`)
}

export function getSlots(activityId: number) {
  return fetchJSON<{ message: string; data: { slots: Slot[] } }>(API, `/api/v1/slot?activityId=${activityId}`)
}
