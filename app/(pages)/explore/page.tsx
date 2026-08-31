import type { Metadata } from "next"
import { getActivities, getTripCategories, getTripTypes } from "@/lib/api"
import { getI18n } from "@/lib/server-locale"
import type { Activity } from "@/lib/types"
import Link from "next/link"
import { Mountain } from "lucide-react"
import { TripCard } from "@/components/trip-card"
import { PageHero } from "@/components/page-hero"
import { ExploreFilters } from "@/components/explore-filters"
import { BreadcrumbJsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  title: "Explore All Trips",
  description:
    "Browse our complete collection of Nepal trekking and travel packages. Find the perfect Himalayan adventure for your next journey.",
  keywords: ["Nepal trips", "explore Nepal", "trekking packages", "Himalayan adventures", "Nepal travel"],
  alternates: { canonical: "/explore" },
  openGraph: {
    title: "Explore All Trips | Walk Through Nepal",
    description:
      "Browse our complete collection of Nepal trekking and travel packages.",
    url: "https://walkthroughnepal.com/explore",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Explore Nepal Trips" }],
  },
}

export const dynamic = "force-dynamic"

type SearchParams = { page?: string; category?: string; type?: string; min?: string; max?: string; search?: string }

export default async function ExplorePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const { locale } = await getI18n()
  const page = Number(params.page) || 1
  const categoryFilter = params.category || ""
  const typeFilter = params.type || ""
  const minFilter = params.min || ""
  const maxFilter = params.max || ""
  const searchFilter = params.search || ""

  let categories: { handle: string; name: string }[] = []
  let tripTypes: { handle: string; name: string }[] = []
  let activities: Activity[] = []
  let totalCount = 0
  let totalPages = 1

  try {
    const { data: { tripCategories } } = await getTripCategories(locale)
    categories = tripCategories.map((c) => ({ handle: c.categoryHandle, name: c.categoryName }))
  } catch {}

  try {
    const { data: { tripTypes: types } } = await getTripTypes(locale)
    tripTypes = types.map((t) => ({ handle: t.tripTypeHandle, name: t.tripTypeName }))
  } catch {}

  const filters: Record<string, string> = {}
  if (categoryFilter) filters.category = categoryFilter
  if (typeFilter) filters.type = typeFilter
  if (minFilter) filters.min = minFilter
  if (maxFilter) filters.max = maxFilter
  if (searchFilter) filters.search = searchFilter
  filters.limit = "12"
  filters.page = String(page)

  try {
    const res = await getActivities(filters, locale)
    activities = res.data ?? []
    totalCount = res.pagination.total
    totalPages = res.pagination.totalPages
  } catch {}

  function pageUrl(pg: number) {
    const p = new URLSearchParams()
    p.set("page", String(pg))
    if (categoryFilter) p.set("category", categoryFilter)
    if (typeFilter) p.set("type", typeFilter)
    if (minFilter) p.set("min", minFilter)
    if (maxFilter) p.set("max", maxFilter)
    if (searchFilter) p.set("search", searchFilter)
    return `/explore?${p.toString()}`
  }

  return (
    <div className="min-h-screen">
      <BreadcrumbJsonLd items={[{ label: "All Trips" }]} />
      <PageHero title="Explore All Trips" description="Browse our complete collection of Nepal adventures" breadcrumbs={[{ label: "Home", href: "/" }, { label: "All Trips" }]} />

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4">

          <ExploreFilters
            categories={categories}
            tripTypes={tripTypes}
            active={{ category: categoryFilter, type: typeFilter, min: minFilter, max: maxFilter, search: searchFilter }}
          />

          {activities.length > 0 && (
            <p className="mb-6 text-sm text-muted-foreground">
              Showing {activities.length} of {totalCount} trips
            </p>
          )}
          {activities.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <Mountain className="mx-auto h-12 w-12 mb-4 opacity-40" />
              <p className="text-lg">No trips found.</p>
              <Link href="/explore" className="mt-4 inline-block text-orange font-medium hover:underline">&larr; Clear filters</Link>
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
