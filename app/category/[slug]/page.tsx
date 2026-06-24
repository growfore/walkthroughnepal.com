import { getActivitiesByCategory } from "@/lib/api"
import Link from "next/link"
import { Mountain } from "lucide-react"
import { TripCard } from "@/components/trip-card"
import { PageHero } from "@/components/page-hero"

export const dynamic = "force-dynamic"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const label = slug.replace(/-/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase())

  let activities: any[] = []

  try {
    const res = await getActivitiesByCategory(slug)
    activities = res.data ?? []
  } catch {}

  return (
    <div className="min-h-screen">
      <PageHero title={label} description={`Explore our ${label.toLowerCase()} packages in Nepal`} />

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
