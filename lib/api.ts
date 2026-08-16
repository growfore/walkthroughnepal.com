import { cache } from "react"
import type { Activity, CMSPost, FeaturedTag, InfoPage, ItineraryVariant, Pagination, Slot, Testimonial, TeamMember, TripCategory, TripType } from "./types"
import type { SiteConfig } from "./siteConfig"

export const API_BASE = process.env.API_URL ?? "https://api.walkthroughnepal.com"
export const CMS_API_BASE = process.env.CMS_API_URL ?? "https://cms.walkthroughnepal.com"
// ponytail: client components can't read non-NEXT_PUBLIC env vars
export const PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_URL ?? API_BASE

export function img(path: string | null | undefined): string {
  if (!path) return "/placeholder-image.png"
  const p = path.trim()
  // full URLs are external sources — render as-is, no proxy, no prepend
  if (p.startsWith("http://") || p.startsWith("https://")) return p
  if (p.startsWith("//")) return `https:${p}`
  // ponytail: /wp-content/ and /api/uploads/ are CMS media, proxied via /cms/uploads/* rewrite
  if (p.startsWith("/wp-content/")) return `/cms${p.replace(/^\/wp-content/, "")}`
  if (p.startsWith("/api/uploads/")) return `/cms${p.replace(/^\/api/, "")}`
  // /uploads/* is API media, proxied via existing /uploads/* rewrite
  if (p.startsWith("/")) return p
  return `/${p}`
}

export function resolveContentImages(html: string): string {
  return html.replace(/src="([^"]+)"/g, (match, src: string) => {
    if (/^(?:https?:\/\/|\/\/|\/)/.test(src)) return `src="${img(src)}"`
    return match
  })
}

async function fetchJSON<T>(path: string, options?: RequestInit, base: string = API_BASE): Promise<T> {
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
  return fetchJSON<{ message: string; data: Activity[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(`/api/v1/activity${qs}`)
}

// cache(): dedupe the API call across generateStaticParams/generateMetadata/page renders
export const getActivityBySlug = cache(async (slug: string) => {
  return fetchJSON<{ message: string; data: Activity }>(`/api/v1/activity/slug/${slug}`)
})

export async function getAllActivitySlugs(): Promise<string[]> {
  try {
    const res = await fetchJSON<{ data: Array<{ slug: string }> }>("/api/v1/activity?page=1&limit=500")
    return (res.data ?? []).map((a) => a.slug).filter(Boolean)
  } catch {
    return []
  }
}

export function getTripCategories() {
  return fetchJSON<{ message: string; data: { tripCategories: TripCategory[] } }>("/api/v1/trip-category")
}

export function getTestimonials() {
  return fetchJSON<Testimonial[]>("/api/v1/testimonial")
}

export function getFeaturedTags() {
  return fetchJSON<{ data: { featuredTags: FeaturedTag[] } }>("/api/v1/featured?includeActivity=true")
}

export interface FeaturedActivity {
  id: number
  slug: string
  title: string
  price: number
  duration: string
  images: string[]
  difficultyLevel: string
}

export function getFeaturedActivitiesByTag(tagSlug: string) {
  return fetchJSON<{ message: string; data: { featuredTag: { activity: FeaturedActivity[] } } }>(
    `/api/v1/featured/${encodeURIComponent(tagSlug)}?includeActivity=true`,
  )
}

export function getTeamMembers() {
  return fetchJSON<{ message: string; data: TeamMember[] }>("/api/v1/team")
}

export function getActivitiesByCategory(categoryHandle: string) {
  return getActivities({ category: categoryHandle })
}

export function getActivitiesByType(typeSlug: string) {
  return getActivities({ type: typeSlug })
}

export function getTripTypes() {
  return fetchJSON<{ message: string; data: { tripTypes: TripType[] } }>("/api/v1/trip-type")
}

export function getPublishedPosts(page = 1, limit = 10, search?: string, category?: string) {
  let url = `/api/posts/published?page=${page}&limit=${limit}`
  if (search) url += `&search=${encodeURIComponent(search)}`
  if (category) url += `&category=${encodeURIComponent(category)}`
  return fetchJSON<{ posts: CMSPost[]; pagination: Pagination }>(url, undefined, CMS_API_BASE)
}

export async function getPostBySlug(slug: string) {
  const res = await fetchJSON<{ post: CMSPost }>(`/api/posts/${encodeURIComponent(slug)}`, undefined, CMS_API_BASE)
  return res.post
}

export async function getAllPostSlugs(): Promise<string[]> {
  try {
    const res = await fetchJSON<{ posts: Array<{ slug: string }> }>("/api/posts/published?page=1&limit=500", undefined, CMS_API_BASE)
    return (res?.posts ?? []).map((p) => p.slug).filter(Boolean)
  } catch {
    return []
  }
}

export const getInfoPageBySlug = cache(async (slug: string) => {
  return fetchJSON<{ infoPage: InfoPage }>(`/api/v1/info-page/slug/${slug}`)
})

export async function getAllInfoPageSlugs(): Promise<string[]> {
  try {
    const res = await fetchJSON<{ data: { pages: Array<{ slug: string }> } }>("/api/v1/info-page?page=1&limit=500")
    const pages = res?.data?.pages
    if (!Array.isArray(pages)) return []
    return pages.map((p) => p.slug).filter(Boolean)
  } catch {
    return []
  }
}

export function getSlots(activityId: number) {
  return fetchJSON<{ message: string; data: { slots: Slot[] } }>(`/api/v1/slot?activityId=${activityId}`)
}

export interface FooterItem {
  label: string
  url: string
  children?: Array<{ label: string; url: string }>
}

export const getSiteConfig = cache(async (): Promise<SiteConfig | null> => {
  try {
    const res = await fetchJSON<{ success: boolean; data: { config: SiteConfig } }>("/api/v1/site-config")
    return res?.data?.config ?? null
  } catch {
    return null
  }
})

export const getFooterItems = cache(async (): Promise<FooterItem[]> => {
  try {
    const res = await fetchJSON<{ data: { items: FooterItem[] } }>("/api/v1/footer")
    return res?.data?.items ?? []
  } catch {
    return []
  }
})

export function parseItineraryVariants(rawItinerary: unknown): ItineraryVariant[] {
  if (Array.isArray(rawItinerary) && rawItinerary.length > 0 && !("days" in (rawItinerary as Record<string, unknown>[])[0])) {
    return [
      {
        id: "default",
        name: "Standard",
        description: "",
        isDefault: true,
        days: rawItinerary as ItineraryVariant["days"],
      },
    ]
  }
  return rawItinerary as ItineraryVariant[]
}
