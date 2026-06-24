import { NextRequest, NextResponse } from "next/server"
import { img } from "@/lib/api"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim()
  if (!q || q.length < 2) return NextResponse.json({ trips: [], blogs: [] })

  const [tripsRes, blogsRes] = await Promise.allSettled([
    fetch(`${API}/api/v1/activity?search=${encodeURIComponent(q)}&limit=5`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    }),
    fetch(`${API}/api/v1/blogs/published?search=${encodeURIComponent(q)}&limit=3`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    }),
  ])

  const trips = tripsRes.status === "fulfilled" && tripsRes.value.ok
    ? (await tripsRes.value.json()).data?.map((a: any) => ({
        title: a.title,
        slug: a.slug,
        type: "trip" as const,
        image: img(a.images?.[0]),
        subtitle: a.duration,
      })) ?? []
    : []

  const blogs = blogsRes.status === "fulfilled" && blogsRes.value.ok
    ? (await blogsRes.value.json()).blogs?.map((b: any) => ({
        title: b.title,
        slug: b.slug,
        type: "blog" as const,
        image: img(b.coverImage),
        subtitle: new Date(b.publishedAt ?? b.createdAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        }),
      })) ?? []
    : []

  return NextResponse.json({ trips, blogs })
}
