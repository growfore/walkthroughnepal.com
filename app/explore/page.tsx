import { getActivities, getTripCategories } from "@/lib/api"
import Link from "next/link"
import { Mountain } from "lucide-react"
import { TripCard } from "@/components/trip-card"
import { PageHero } from "@/components/page-hero"

export const dynamic = "force-dynamic"

export default async function ExplorePage({ searchParams }: { searchParams: Promise<{ page?: string; category?: string }> }) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const categoryFilter = params.category || ""

  let categories: { handle: string; name: string }[] = []
  let activities: any[] = []
  let totalPages = 1

  try {
    const { data: { tripCategories } } = await getTripCategories()
    categories = tripCategories.map((c) => ({ handle: c.categoryHandle, name: c.categoryName }))
  } catch {}

  const filters: Record<string, string> = {}
  if (categoryFilter) filters.category = categoryFilter
  filters.limit = "12"
  filters.page = String(page)

  try {
    const res = await getActivities(filters)
    activities = res.data ?? []
    totalPages = res.pagination.totalPages
  } catch {}

  function pageUrl(p: number) {
    return `/explore?page=${p}${categoryFilter ? `&category=${categoryFilter}` : ""}`
  }

  return (
    <div className="min-h-screen">
      <PageHero title="Explore All Trips" description="Browse our complete collection of Nepal adventures" breadcrumbs={[{ label: "Home", href: "/" }, { label: "All Trips" }]} />

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4">
          {categories.length > 0 && (
            <div className="mb-10 flex flex-wrap items-center gap-2">
              <Link
                href="/explore"
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${!categoryFilter ? "bg-orange text-orange-foreground" : "border border-border text-navy hover:bg-border"}`}
              >
                All
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.handle}
                  href={`/explore?category=${c.handle}`}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${categoryFilter === c.handle ? "bg-orange text-orange-foreground" : "border border-border text-navy hover:bg-border"}`}
                >
                  {c.name}
                </Link>
              ))}
            </div>
          )}

          {activities.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <Mountain className="mx-auto h-12 w-12 mb-4 opacity-40" />
              <p className="text-lg">No trips found.</p>
              <Link href="/explore" className="mt-4 inline-block text-orange font-medium hover:underline">← Clear filters</Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((a) => (
                <TripCard key={a.slug} activity={a} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center gap-2">
              {page > 1 && (
                <Link href={pageUrl(page - 1)} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-navy hover:bg-border">
                  Previous
                </Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - page) <= 2 || p === 1 || p === totalPages)
                .map((p, i, arr) => (
                  <span key={p}>
                    {i > 0 && arr[i - 1] !== p - 1 && <span className="px-2 text-muted-foreground">...</span>}
                    <Link
                      href={pageUrl(p)}
                      className={`rounded-md px-4 py-2 text-sm font-medium ${p === page ? "bg-orange text-orange-foreground" : "border border-border text-navy hover:bg-border"}`}
                    >
                      {p}
                    </Link>
                  </span>
                ))}
              {page < totalPages && (
                <Link href={pageUrl(page + 1)} className="rounded-md border border-border px-4 py-2 text-sm font-medium text-navy hover:bg-border">
                  Next
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
