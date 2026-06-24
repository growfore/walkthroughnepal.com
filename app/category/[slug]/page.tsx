import { getActivitiesByCategory } from "@/lib/api"
import Link from "next/link"
import { Mountain } from "lucide-react"
import { TripCard } from "@/components/trip-card"

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
      <section className="bg-navy py-16 text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-5xl font-bold">{label}</h1>
          <p className="mt-3 text-lg text-white/80">
            Explore our {label.toLowerCase()} packages in Nepal
          </p>
        </div>
      </section>

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
