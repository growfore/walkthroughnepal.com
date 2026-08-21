import {
  getActivities,
  getFeaturedTags,
  getPublishedPosts,
  getTestimonials,
  getTripCategories,
  img,
  API_BASE,
} from "./api"
import type { FeaturedTag } from "./types"

export type HomeCategory = { img: string; title: string; sub: string; cta: string; handle: string }
export type HomeBlog = { slug: string; image: string; tag: string; title: string; description: string | null; date: string }
export type HomeTestimonial = { name: string; rating: number; text: string }
export type HomeDestination = { img: string; title: string; handle: string }

export type DepartureActivity = { id: string; slug: string; title: string }
export type DepartureSlot = {
  id: number
  departureDate: string
  price: string
  remainingSeats: number
  visible: boolean
  days: number
  maxGroupSize: number
  activity: { id: number; title: string; slug: string }
}
export type DepartureFilterMeta = { years: string[]; activityIds: number[]; months: number[]; days: number[] }

export async function getHomeCategories(): Promise<HomeCategory[]> {
  try {
    const {
      data: { tripCategories },
    } = await getTripCategories()
    // ponytail: one API call per category for counts — fine at ~6 categories
    const counts = await Promise.all(
      tripCategories.map(async (c) => {
        try {
          const { pagination } = await getActivities({ category: c.categoryHandle, limit: "1" })
          return pagination.total
        } catch {
          return 0
        }
      }),
    )
    return tripCategories
      .map((c, i) => ({
        img: img(c.categoryImage) ?? "/images/cat-trekking.jpg",
        title: c.categoryName,
        sub: c.categoryHandle
          .replace(/-/g, " ")
          .replace(/\b\w/g, (l: string) => l.toUpperCase()),
        cta: "Explore",
        handle: c.categoryHandle,
        _count: counts[i],
      }))
      .sort((a, b) => b._count - a._count)
      .map(({ img, title, sub, cta, handle }) => ({ img, title, sub, cta, handle }))
  } catch {
    return []
  }
}

export async function getHomeFeaturedTags(): Promise<FeaturedTag[]> {
  try {
    const {
      data: { featuredTags },
    } = await getFeaturedTags()
    return featuredTags
  } catch {
    return []
  }
}

export async function getHomeBlog(): Promise<HomeBlog[]> {
  try {
    const { posts } = await getPublishedPosts(1, 4)
    return posts.map((b) => ({
      slug: b.slug,
      image: img(b.coverImage),
      tag: b.category?.name?.toUpperCase() ?? "TRAVEL",
      title: b.title,
      description: b.metaDescription ?? null,
      date: b.publishedAt || b.createdAt,
    }))
  } catch {
    return []
  }
}

export async function getHomeTestimonials(): Promise<HomeTestimonial[]> {
  try {
    return (await getTestimonials())
      .slice(0, 6)
      .map((t) => ({
        name: t.author,
        rating: t.rating,
        text: t.content,
      }))
  } catch {
    return []
  }
}

export async function getHomeDestinations(): Promise<HomeDestination[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/city?page=1&limit=10`, { next: { revalidate: 3600 } })
    const json = await res.json()
    return (json.data?.cities ?? []).map((c: { cityName: string; cityHandle: string; cityImage: string }) => ({
      img: c.cityImage || "/manaslu-view.webp",
      title: c.cityName,
      handle: c.cityHandle,
    }))
  } catch {
    return []
  }
}

export async function getHomeDepartures(): Promise<{
  activities: DepartureActivity[]
  filterMeta: DepartureFilterMeta
  initialSlots: DepartureSlot[]
  totalCount: number
}> {
  try {
    const [actRes, slotRes] = await Promise.all([
      fetch(`${API_BASE}/api/v1/activity?page=1&limit=100`, { next: { revalidate: 3600 } }),
      fetch(`${API_BASE}/api/v1/slot?limit=500`, { next: { revalidate: 3600 } }),
    ])
    const [actJson, slotJson] = await Promise.all([actRes.json(), slotRes.json()])
    const activities: DepartureActivity[] = (actJson.data ?? [])
      .map((a: { id: number; slug: string; title: string }) => ({
        id: String(a.id),
        slug: a.slug,
        title: a.title,
      }))
      .sort((a: DepartureActivity, b: DepartureActivity) => a.title.localeCompare(b.title))
    const allSlots: DepartureSlot[] = (slotJson.data?.slots ?? []).filter((s: DepartureSlot) => s.visible)
    return {
      activities,
      filterMeta: {
        years: [...new Set(allSlots.map((s) => new Date(s.departureDate).getFullYear().toString()))].sort(),
        activityIds: [...new Set(allSlots.map((s) => s.activity.id))],
        months: [...new Set(allSlots.map((s) => new Date(s.departureDate).getMonth()))].sort((a, b) => a - b),
        days: [...new Set(allSlots.map((s) => s.days))].sort((a, b) => a - b),
      },
      initialSlots: allSlots.slice(0, 12),
      totalCount: allSlots.length,
    }
  } catch {
    return {
      activities: [],
      filterMeta: { years: [], activityIds: [], months: [], days: [] },
      initialSlots: [],
      totalCount: 0,
    }
  }
}
