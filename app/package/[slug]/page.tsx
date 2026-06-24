import {
  Mountain, MapPin, Clock, ChevronRight, Star, Calendar, TrendingUp, Users, Home as HomeIcon,
  Download, Check, Plus, Minus, Mail, Phone, X, Info, Route, HelpCircle, MessageCircle,
  Utensils, Bus,
} from "lucide-react"
import Link from "next/link"
import { getActivityBySlug, img } from "@/lib/api"
import { decodeHtmlEntities } from "@/lib/html-decoder"
import { StickyWrapper } from "@/components/sticky-wrapper"
import { ItineraryList } from "@/components/itinerary-list"
import { Lightbox } from "@/components/lightbox"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

const tabs = [
  { label: "Overview", icon: Info },
  { label: "Itinerary", icon: Route },
  { label: "Includes", icon: Check },
  { label: "Excludes", icon: X },
  { label: "Useful Info", icon: HelpCircle },
  { label: "Reviews", icon: Star },
  { label: "FAQs", icon: MessageCircle },
]

function RatingStars({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`${size} ${i < Math.round(rating) ? "fill-orange text-orange" : "text-white/30"}`} />
      ))}
    </div>
  )
}

function FactBadge({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-6 w-6 shrink-0" />
      <div className="text-sm leading-tight">
        <div className="font-semibold">{value}</div>
        <div className="text-xs text-white/70">{label}</div>
      </div>
    </div>
  )
}

function SidebarFact({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0">
      <span className="flex items-center gap-2 text-muted-foreground"><Icon className="h-4 w-4 text-orange shrink-0" /> {label}</span>
      <span className="text-right font-semibold text-navy">{value}</span>
    </li>
  )
}

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
  const thumbnails = (pkg.images ?? []).slice(0, 5)
  const heroImg = img(pkg.images[0], API)

  const sidebarFacts = [
    { icon: Clock, label: "Duration", value: pkg.duration },
    { icon: TrendingUp, label: "Max Altitude", value: pkg.maximumAltitude },
    { icon: Mountain, label: "Difficulty", value: difficulty },
    { icon: Calendar, label: "Best Season", value: pkg.bestSeason },
    { icon: HomeIcon, label: "Accommodation", value: pkg.accommodations?.join(", ") || "Tea House" },
    { icon: Utensils, label: "Meals", value: pkg.meals },
    { icon: Users, label: "Group Size", value: pkg.groupSize || `${pkg.guestCapacity || 1} Pax` },
    { icon: Bus, label: "Transportation", value: pkg.transportation || "N/A" },
    { icon: MapPin, label: "Meeting Point", value: pkg.meetingPoint },
    { icon: MapPin, label: "Drop Off", value: pkg.dropOffPoint },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero ── */}
      <section className="relative">
        <div className="relative h-[520px] w-full overflow-hidden">
          <Lightbox src={heroImg} alt={pkg.title} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

          <div className="relative mx-auto flex max-w-7xl items-center gap-2 px-4 pt-6 text-sm text-white/80">
            <Link href="/" className="hover:text-orange">Home</Link><ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">{pkg.title}</span>
          </div>

          <div className="relative mx-auto mt-8 max-w-7xl px-4 text-white">
            <span className="inline-block rounded bg-orange px-3 py-1 text-[11px] font-bold tracking-wider text-orange-foreground">
              {pkg.isFeatured ? "FEATURED" : "BEST SELLER"}
            </span>
            <h1 className="mt-4 text-5xl font-bold leading-tight md:text-6xl">{pkg.title}</h1>
            <div className="mt-3 flex items-center gap-2 text-white/90">
              <MapPin className="h-4 w-4 text-orange" /> {pkg.locations?.join(", ") || pkg.meetingPoint}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <RatingStars rating={pkg.averageRating} />
              <span className="text-sm font-semibold">{pkg.averageRating || "New"}</span>
              <span className="text-sm text-white/80">({pkg.reviewCount || 0} Reviews)</span>
            </div>

            <div className="mt-7 flex flex-wrap gap-8 text-white/95">
              <FactBadge icon={Clock} label="Duration" value={pkg.duration} />
              <FactBadge icon={TrendingUp} label="Max Altitude" value={pkg.maximumAltitude} />
              <FactBadge icon={Mountain} label="Difficulty" value={difficulty} />
              <FactBadge icon={Calendar} label="Best Season" value={pkg.bestSeason} />
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        {thumbnails.length > 0 && (
          <div className="bg-navy/95">
            <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto scrollbar-hide px-4 py-3">
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
        )}
      </section>

      {/* ── Main content ── */}
      <section className="py-12 text-base font-medium leading-relaxed">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <StickyWrapper className="sticky z-10 py-3" offset={96}>
              <div className="flex flex-nowrap gap-1.5 overflow-x-auto scrollbar-hide rounded-2xl border border-border bg-card p-1.5 shadow-sm">
                {tabs.map((t, i) => {
                  const Icon = t.icon
                  return (
                    <a key={t.label} href={`#${t.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${i === 0 ? "bg-navy text-navy-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-navy"}`}
                    ><Icon className="h-4 w-4 shrink-0" />{t.label}</a>
                  )
                })}
              </div>
            </StickyWrapper>

            {/* ── Overview ── */}
            <div id="overview" className="mt-8">
              <h2 className="text-2xl font-bold text-navy">Overview</h2>
              <div
                className="mt-3 prose max-w-none prose-p:leading-relaxed prose-p:text-muted-foreground prose-headings:text-navy prose-a:text-primary prose-strong:text-navy"
                dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(pkg.shortDescription) }}
              />

              {pkg.fullDescription && (
                <div
                  className="mt-6 prose max-w-none prose-p:leading-relaxed prose-p:text-muted-foreground prose-headings:text-navy prose-a:text-primary prose-strong:text-navy"
                  dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(pkg.fullDescription) }}
                />
              )}

              {(pkg.highlights ?? []).length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-navy">Trip Highlights</h3>
                  <div className="mt-4 space-y-3">
                    {pkg.highlights
                      .flatMap((h) => {
                        const m = decodeHtmlEntities(h).match(/<li>(.*?)<\/li>/gi)
                        return m ? m.map((s) => s.replace(/<\/?li>/gi, "")) : [h]
                      })
                      .map((item, i) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-navy">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                          <span dangerouslySetInnerHTML={{ __html: item }} />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {pkg.map && (
                <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
                  <img src={img(pkg.map, API)} alt="Route map" className="h-72 w-full object-cover" />
                </div>
              )}
            </div>

            {/* ── Itinerary ── */}
            <div id="itinerary" className="mt-12 scroll-mt-24">
              <ItineraryList days={pkg.itinerary ?? []} />
            </div>

            {/* ── Includes ── */}
            <div id="includes" className="mt-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-navy">What&apos;s Included</h2>
              <div className="mt-4 rounded-lg border border-border bg-card p-6">
                <div className="prose prose-sm max-w-none prose-li:text-navy prose-li:marker:text-green-600">
                  {(pkg.inclusions ?? []).map((section, i) => (
                    <div key={i} dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(section) }} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Excludes ── */}
            <div id="excludes" className="mt-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-navy">What&apos;s Excluded</h2>
              <div className="mt-4 rounded-lg border border-border bg-card p-6">
                <div className="prose max-w-none prose-li:text-navy prose-li:marker:text-red-500">
                  {(pkg.exclusions ?? []).map((section, i) => (
                    <div key={i} dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(section) }} />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Useful Info ── */}
            {(pkg.additionalInfo ?? []).length > 0 && (
              <div id="useful-info" className="mt-12 scroll-mt-24">
                <h2 className="text-2xl font-bold text-navy">Useful Information</h2>
                <div className="mt-4 space-y-6">
                  {pkg.additionalInfo.map((info, i) => (
                    <div key={i}>
                      <h3 className="font-bold text-navy">{info.title}</h3>
                      <div className="mt-2 prose max-w-none prose-p:leading-relaxed prose-p:text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(info.description) }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Reviews ── */}
            <div id="reviews" className="mt-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-navy">Traveler Reviews</h2>
              <div className="mt-4 rounded-lg border border-border bg-card p-6">
                <div className="flex flex-wrap items-center gap-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-navy">{pkg.averageRating || "New"}</div>
                    <div className="mt-1 flex justify-center">
                      <RatingStars rating={pkg.averageRating} />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{pkg.reviewCount || 0} Reviews</div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {pkg.reviewCount > 0
                        ? "Reviews from travelers who have completed this trip."
                        : "No reviews yet. Be the first to share your experience!"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── FAQs ── */}
            {(pkg.faqs ?? []).length > 0 && (
              <div id="faqs" className="mt-12 scroll-mt-24">
                <h2 className="text-2xl font-bold text-navy">Frequently Asked Questions</h2>
                <div className="mt-4 space-y-3">
                  {pkg.faqs.map((faq, i) => (
                    <details key={i} className="group rounded-lg border border-border">
                      <summary className="flex cursor-pointer items-center justify-between p-4 font-semibold text-navy">
                        {faq.question}
                        <Plus className="h-4 w-4 shrink-0 group-open:hidden" />
                        <Minus className="h-4 w-4 shrink-0 hidden group-open:block" />
                      </summary>
                      <div className="border-t border-border px-4 py-3 prose max-w-none prose-p:leading-relaxed prose-p:text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(faq.answer) }}
                      />
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Video */}
            {pkg.videoUrl && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-navy">Video</h2>
                <div className="mt-4 aspect-video overflow-hidden rounded-lg">
                  <iframe src={pkg.videoUrl} className="h-full w-full" allowFullScreen title="Trip video" />
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <StickyWrapper className="sticky self-start space-y-6" offset={120}>
            {/* Price */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="text-sm text-muted-foreground">From</div>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl font-bold text-navy">${pkg.price}</div>
                {pkg.maxPrice && pkg.maxPrice !== pkg.price && (
                  <div className="text-lg text-muted-foreground line-through">${pkg.maxPrice}</div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">per person</div>

              <button className="mt-5 w-full rounded-md bg-orange py-3 font-semibold text-orange-foreground hover:opacity-90">
                Check Availability
              </button>
              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border py-3 font-semibold text-navy hover:bg-secondary">
                <Download className="h-4 w-4" /> Download Itinerary
              </button>

              <ul className="mt-6 space-y-3 text-sm">
                {sidebarFacts.map((f) => (
                  <SidebarFact key={f.label} {...f} />
                ))}
              </ul>
            </div>

            {/* Contact */}
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
          </StickyWrapper>
        </div>
      </section>

      {/* ── Newsletter ── */}
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
