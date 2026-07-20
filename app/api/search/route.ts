import { NextRequest, NextResponse } from "next/server"
import { img, API_BASE } from "@/lib/api"

type SearchResult = { title: string; slug: string; type: "trip" | "blog"; image: string; subtitle: string }

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim()
  if (!q || q.length < 2) return NextResponse.json({ trips: [], blogs: [] })

  const [tripsRes, blogsRes] = await Promise.allSettled([
    fetch(`${API_BASE}/api/v1/activity?search=${encodeURIComponent(q)}&limit=5`),
    fetch(`${API_BASE}/api/v1/blogs/published?search=${encodeURIComponent(q)}&limit=3`),
  ])

  const trips: SearchResult[] =
    tripsRes.status === "fulfilled" && tripsRes.value.ok
      ? ((await tripsRes.value.json()).data ?? []).map((a: { title: string; slug: string; images: string[]; duration: string }) => ({
          title: a.title,
          slug: a.slug,
          type: "trip" as const,
          image: img(a.images?.[0]),
          subtitle: a.duration,
        }))
      : []

  const blogs: SearchResult[] =
    blogsRes.status === "fulfilled" && blogsRes.value.ok
      ? ((await blogsRes.value.json()).blogs ?? []).map((b: { title: string; slug: string; coverImage: string; publishedAt?: string; createdAt: string }) => ({
          title: b.title,
          slug: b.slug,
          type: "blog" as const,
          image: img(b.coverImage),
          subtitle: new Date(b.publishedAt ?? b.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }))
      : []

  return NextResponse.json({ trips, blogs })
}
