import { getActivitiesByType, getTripTypes } from "@/lib/api"
import type { Activity } from "@/lib/types"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Mountain } from "lucide-react"
import { TripCard } from "@/components/trip-card"
import { PageHero } from "@/components/page-hero"
import { BreadcrumbJsonLd } from "@/components/json-ld"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  let label = slug.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())
  try {
    const res = await getTripTypes()
    const match = res.data.tripTypes.find((t) => t.tripTypeHandle === slug)
    if (match) label = match.tripTypeName
  } catch {}
  const desc = `Explore our ${label.toLowerCase()} packages in Nepal. Find authentic Himalayan adventures.`
  return {
    title: `${label} Trips`,
    description: desc,
    keywords: [label, "Nepal trips", `${label.toLowerCase()} Nepal`, "adventure travel"],
    alternates: { canonical: `/activity/${slug}` },
    openGraph: {
      title: `${label} Trips | Walk Through Nepal`,
      description: desc,
      url: `https://walkthroughnepal.com/activity/${slug}`,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${label} Trips in Nepal` }],
    },
  }
}

export default async function ActivitiesByTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let typeName: string | null = null
  try {
    const res = await getTripTypes()
    const match = res.data.tripTypes.find((t) => t.tripTypeHandle === slug)
    if (!match) notFound()
    typeName = match.tripTypeName
  } catch {
    notFound()
  }

  let activities: Activity[] = []
  try {
    const res = await getActivitiesByType(slug)
    activities = res.data ?? []
  } catch {}

  return (
    <div className="min-h-screen">
      <BreadcrumbJsonLd items={[{ label: "Explore", href: "/explore" }, { label: "Activities", href: "/explore" }, { label: typeName }]} />
      <PageHero title={typeName} description={`Explore our ${typeName.toLowerCase()} packages in Nepal`} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Activities", href: "/explore" }, { label: typeName }]} />

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          {activities.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              <Mountain className="mx-auto h-12 w-12 mb-4 opacity-40" />
              <p className="text-lg">No activities found in this type.</p>
              <Link href="/explore" className="mt-4 inline-block text-orange font-medium hover:underline">
                ← Browse all activities
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
