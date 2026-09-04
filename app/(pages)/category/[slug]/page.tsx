import type { Metadata } from "next"
import { getActivitiesByCategory, getTripCategories } from "@/lib/api"
import { getI18n } from "@/lib/server-locale"
import type { Activity } from "@/lib/types"
import Link from "next/link"
import { Mountain } from "lucide-react"
import { TripCard } from "@/components/trip-card"
import { PageHero } from "@/components/page-hero"
import { BreadcrumbJsonLd } from "@/components/json-ld"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const label = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l: string) => l.toUpperCase())
  const desc = `Explore our ${label.toLowerCase()} packages in Nepal. Find authentic treks, tours, and adventures in the Himalayas.`
  return {
    title: `${label} Trips`,
    description: desc,
    keywords: [label, "Nepal trips", "Nepal trekking", `${label.toLowerCase()} Nepal`],
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      title: `${label} Trips | Walk Through Nepal`,
      description: desc,
      url: `https://walkthroughnepal.com/category/${slug}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${label} Trips in Nepal` }],
    },
  }
}

export const dynamic = "force-dynamic"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { locale } = await getI18n()
  let label = slug.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())

  try {
    const { data: { tripCategories } } = await getTripCategories(locale)
    const match = tripCategories.find((c) => c.categoryHandle === slug)
    if (match) label = match.categoryName
  } catch {}

  let activities: Activity[] = []

  try {
    const res = await getActivitiesByCategory(slug, locale)
    activities = res.data ?? []
  } catch {}

  return (
    <div className="min-h-screen">
      <BreadcrumbJsonLd items={[{ label: "Explore", href: "/explore" }, { label }]} />
      <PageHero title={label} description={`Explore our ${label.toLowerCase()} packages in Nepal`} breadcrumbs={[{ label: "Home", href: "/" }, { label }]} />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          {activities.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <Mountain className="mx-auto h-12 w-12 mb-4 opacity-40" />
              <p className="text-lg">No activities found in this category.</p>
              <Link href="/" className="mt-4 inline-block text-orange font-medium hover:underline">
                ← Back to Home
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((a) => (
                <TripCard key={a.slug} activity={a} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
