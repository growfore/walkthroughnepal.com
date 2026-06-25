import { getActivitiesByCategory } from "@/lib/api"
import Link from "next/link"
import type { Metadata } from "next"
import { Mountain } from "lucide-react"
import { TripCard } from "@/components/trip-card"
import { PageHero } from "@/components/page-hero"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const label = slug.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())
  return { title: `${label} — Walk Through Nepal`, description: `Explore our ${label.toLowerCase()} packages in Nepal.` }
}

export default async function ActivitiesByTypePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const label = slug.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())

  let activities: any[] = []

  try {
    const res = await getActivitiesByCategory(slug)
    activities = res.data ?? []
  } catch {}

  return (
    <div className="min-h-screen">
      <PageHero title={label} description={`Explore our ${label.toLowerCase()} packages in Nepal`} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Activities", href: "/explore" }, { label }]} />

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
