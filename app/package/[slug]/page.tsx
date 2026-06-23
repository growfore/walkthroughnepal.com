import {
  Mountain, MapPin, Clock, ChevronRight, Star, Calendar, TrendingUp, Users, Home as HomeIcon,
  Download, Check, X, ArrowRight, ChevronLeft, Mail, Phone,
} from "lucide-react"
import Link from "next/link"
import { getActivityBySlug, img } from "@/lib/api"
import { decodeHtmlEntities } from "@/lib/html-decoder"

const API = process.env.API_URL ?? "https://api.essencetreksnepal.com"

const tabs = ["Overview", "Itinerary", "Includes", "Excludes", "What to Bring", "Useful Info", "Reviews", "Dates & Prices"]

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let pkg
  try {
    const res = await getActivityBySlug(slug)
    pkg = res.data
  } catch {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-navy">Package not found</h1>
          <Link href="/" className="mt-4 inline-block text-orange">Go back home</Link>
        </div>
      </div>
    )
  }

  const difficulty = pkg.difficultyLevel?.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) ?? "Moderate"

  const highlights = (pkg.highlights ?? []).slice(0, 4)

  const itinerary = (pkg.itinerary ?? []).map((d) => ({
    day: String(d.day).padStart(2, "0"),
    title: d.title,
    desc: decodeHtmlEntities(d.description),
    stay: d.accommodations?.join(", ") || "Tea House",
  }))

  const thumbnails = (pkg.images ?? []).slice(0, 5)
  const price = `$${pkg.price}`
  const days = pkg.duration
  const altitude = pkg.maximumAltitude
  const season = "Mar - May, Sep - Nov"
  const heroImg = img(pkg.images[0], API)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative">
        <div className="relative h-[520px] w-full overflow-hidden">
          <img src={heroImg} alt={pkg.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

          <div className="relative mx-auto flex items-center gap-2 px-4 pt-6 text-sm text-white/80">
            <Link href="/" className="hover:text-orange">Home</Link><ChevronRight className="h-3.5 w-3.5" />
            <a href="#" className="hover:text-orange">Treks</a><ChevronRight className="h-3.5 w-3.5" />
            <a href="#" className="hover:text-orange">Package</a><ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">{pkg.title}</span>
          </div>

          <div className="relative mx-auto mt-8 px-4 text-white">
            <span className="inline-block rounded bg-orange px-3 py-1 text-[11px] font-bold tracking-wider text-orange-foreground">
              {pkg.isFeatured ? "FEATURED" : "BEST SELLER"}
            </span>
            <h1 className="mt-4 text-5xl font-bold leading-tight md:text-6xl">{pkg.title}</h1>
            <div className="mt-3 flex items-center gap-2 text-white/90">
              <MapPin className="h-4 w-4 text-orange" /> {pkg.locations?.join(", ") || pkg.meetingPoint}
            </div>
            <div className="mt-3 flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < Math.round(pkg.averageRating) ? "fill-orange text-orange" : "text-white/30"}`} />
              ))}
              <span className="text-sm font-semibold">{pkg.averageRating || "New"}</span>
              <span className="text-sm text-white/80">({pkg.reviewCount || 0} Reviews)</span>
            </div>

            <div className="mt-7 flex flex-wrap gap-8 text-white/95">
              {[
                { icon: Clock, top: days, bot: "Duration" },
                { icon: TrendingUp, top: altitude, bot: "Max Altitude" },
                { icon: Mountain, top: difficulty, bot: "Difficulty" },
                { icon: Calendar, top: season, bot: "Best Season" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <s.icon className="h-6 w-6" />
                  <div className="text-sm leading-tight">
                    <div className="font-semibold">{s.top}</div>
                    {s.bot && <div className="text-xs text-white/70">{s.bot}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="bg-navy/95">
          <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-3">
            {thumbnails.map((src, i) => (
              <img key={i} src={img(src, API)} alt="Trek photo" className="h-20 w-32 flex-shrink-0 rounded object-cover" />
            ))}
            {pkg.images.length > 5 && (
              <div className="flex h-20 w-32 flex-shrink-0 flex-col items-center justify-center rounded bg-white/10 text-sm text-white">
                <span className="font-semibold">+{pkg.images.length - 5}</span>
                <span className="text-xs text-white/70">View all photos</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex flex-wrap gap-6 border-b border-border text-sm font-medium text-muted-foreground">
              {tabs.map((t, i) => (
                <a key={t} href={`#${t.toLowerCase()}`} className={`pb-3 ${i === 0 ? "border-b-2 border-orange text-orange" : "hover:text-navy"}`}>{t}</a>
              ))}
            </div>

            {/* Overview */}
            <div id="overview" className="mt-8">
              <h2 className="text-2xl font-bold text-navy">Overview</h2>
              <div
                className="mt-3 prose prose-sm max-w-none prose-p:leading-relaxed prose-p:text-muted-foreground prose-headings:text-navy prose-a:text-primary prose-strong:text-navy"
                dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(pkg.shortDescription) }}
              />

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <ul className="space-y-4">
                  {highlights.map((h) => (
                    <li key={h.slice(0, 40)} className="flex items-start gap-3 text-sm text-navy">
                      <Mountain className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange" />
                      <span dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(h) }} />
                    </li>
                  ))}
                </ul>

                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <img src={img(pkg.images[1], API) || "/images/nepal-map.png"} alt="Route map" className="h-72 w-full object-cover" />
                  <div className="px-3 py-2 text-right text-xs font-medium text-orange">View Full Map →</div>
                </div>
              </div>
            </div>

            {/* Short Itinerary */}
            <div id="itinerary" className="mt-12">
              <h2 className="text-2xl font-bold text-navy">Short Itinerary</h2>
              <div className="mt-5 space-y-3">
                {itinerary.slice(0, 6).map((d) => (
                  <div key={d.day} className="flex items-start gap-4 rounded-lg border border-border p-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-navy/15 text-navy">
                      <div className="text-center leading-tight">
                        <div className="text-[9px] font-semibold text-muted-foreground">Day</div>
                        <div className="text-sm font-bold">{d.day}</div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-navy">{d.title}</div>
                      <div className="mt-1 prose prose-sm max-w-none prose-p:m-0 prose-p:text-muted-foreground" dangerouslySetInnerHTML={{ __html: d.desc }} />
                    </div>
                    <div className="text-right text-xs text-muted-foreground shrink-0">
                      <div>Overnight</div>
                      <div className="flex items-center gap-1 font-medium text-navy"><HomeIcon className="h-3 w-3" /> {d.stay}</div>
                    </div>
                  </div>
                ))}
              </div>
              {itinerary.length > 6 && (
                <div className="mt-6 flex justify-center">
                  <button className="rounded-md border border-orange px-6 py-2.5 font-semibold text-orange transition hover:bg-orange hover:text-orange-foreground">
                    View Full Itinerary
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="text-sm text-muted-foreground">From</div>
              <div className="text-4xl font-bold text-navy">{price}</div>
              <div className="text-sm text-muted-foreground">per person</div>

              <button className="mt-5 w-full rounded-md bg-orange py-3 font-semibold text-orange-foreground hover:opacity-90">
                Check Availability
              </button>
              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border py-3 font-semibold text-navy hover:bg-secondary">
                <Download className="h-4 w-4" /> Download Itinerary
              </button>

              <ul className="mt-6 space-y-3 text-sm">
                {[
                  ["Trip Duration", days],
                  ["Max Altitude", `${altitude}`],
                  ["Trip Difficulty", difficulty],
                  ["Best Season", season],
                  ["Accommodation", pkg.accommodations?.join(", ") || "Tea House"],
                  ["Meals", "Breakfast, Lunch, Dinner"],
                  ["Group Size", `1 - ${pkg.guestCapacity || 12} Pax`],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0">
                    <span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-orange" /> {k}</span>
                    <span className="text-right font-medium text-navy">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-bold text-navy">What&#39;s Included</h3>
              <div className="prose prose-sm max-w-none prose-li:text-navy prose-li:marker:text-green-600">
                {(pkg.inclusions ?? []).map((section, i) => (
                  <div key={i} dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(section) }} />
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-bold text-navy">What&#39;s Excluded</h3>
              <div className="prose prose-sm max-w-none prose-li:text-navy prose-li:marker:text-red-500">
                {(pkg.exclusions ?? []).map((section, i) => (
                  <div key={i} dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(section) }} />
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-navy">Need Help Planning?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Our travel experts are here to help you plan your perfect trip.</p>
                  <div className="mt-3 space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-navy"><Phone className="h-4 w-4 text-orange" /> +977 984 123 4567</div>
                    <div className="flex items-center gap-2 text-navy"><Mail className="h-4 w-4 text-orange" /> info@walkthroughnepal.com</div>
                  </div>
                  <button className="mt-4 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-navy-foreground hover:opacity-90">
                    Talk To An Expert
                  </button>
                </div>
                <img src="/images/hero-trekker.jpg" alt="Travel expert" className="h-24 w-20 rounded-md object-cover" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Reviews + Dates */}
      <section className="pb-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-navy">Traveler Reviews</h3>
              <a href="#" className="flex items-center gap-1 text-sm font-medium text-orange">View All Reviews <ArrowRight className="h-3.5 w-3.5" /></a>
            </div>
            <div className="mt-5 grid gap-6 md:grid-cols-[auto_1fr]">
              <div className="text-center">
                <div className="text-5xl font-bold text-navy">{pkg.averageRating || "New"}</div>
                <div className="mt-1 flex justify-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(pkg.averageRating) ? "fill-orange text-orange" : "text-border"}`} />
                  ))}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{pkg.reviewCount || 0} Reviews</div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Reviews will appear here once travelers submit feedback for this package.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-bold text-navy">Upcoming Dates &amp; Prices</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Contact us for available dates and group departures for this package.
            </p>
            <button className="mt-4 rounded-md bg-navy px-4 py-2 text-sm font-semibold text-navy-foreground hover:opacity-90">
              Check Availability
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-lg bg-navy p-8 text-navy-foreground">
            <img src={heroImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
            <div className="relative grid items-center gap-6 md:grid-cols-[1fr_auto]">
              <div>
                <div className="text-2xl font-bold">Subscribe to Our Newsletter</div>
                <div className="mt-1 text-sm text-white/80">Get the latest updates on new trips, travel tips &amp; exclusive offers.</div>
              </div>
              <div className="flex w-full gap-2 md:w-auto">
                <input placeholder="Enter your email address" className="flex-1 rounded-md bg-white px-4 py-3 text-navy outline-none md:w-80" />
                <button className="rounded-md bg-orange px-6 py-3 font-semibold text-orange-foreground hover:opacity-90">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
