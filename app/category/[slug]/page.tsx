import { getActivitiesByCategory, img } from "@/lib/api"
import Link from "next/link"
import { Clock, TrendingUp, ArrowRight, Home as HomeIcon, Mountain, MapPin } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const label = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())

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
                <Link
                  key={a.slug}
                  href={`/package/${a.slug}`}
                  className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-48">
                    <img
                      src={img(a.images?.[0]) ?? "/images/trek-everest.jpg"}
                      alt={a.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded bg-orange px-2.5 py-1 text-[10px] font-bold text-orange-foreground">
                      {a.duration}
                    </span>
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-bold leading-snug text-navy">
                      {a.title.length > 60 ? a.title.substring(0, 60) + "..." : a.title}
                    </h2>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {a.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />{" "}
                        {a.difficultyLevel?.replace(/_/g, " ").replace(/\b\w/g, (l: string) => l.toUpperCase()) ?? "Moderate"}
                      </span>
                      {a.locations?.[0] && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {a.locations[0]}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                      <div>
                        <div className="text-[10px] text-muted-foreground">From</div>
                        <div className="text-lg font-bold text-navy">${a.price}</div>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-orange group-hover:underline">
                        View Details <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
