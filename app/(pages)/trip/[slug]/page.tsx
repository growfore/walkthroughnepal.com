import type { Metadata } from "next"
import {
  Mountain,
  Clock,
  ChevronRight,
  Star,
  Calendar,
  Users,
  Home as HomeIcon,
  Check,
  Mail,
  Phone,
  X,
  Info,
  Route,
  HelpCircle,
  MessageCircle,
  Utensils,
  Bus,
} from "lucide-react"
import { SectionNav } from "@/components/section-nav"
import { FAQSection } from "@/components/faq-section"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getActivityBySlug, getTestimonials, getSlots, img } from "@/lib/api"
import { BookDialog } from "@/components/book-dialog"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const res = await getActivityBySlug(slug)
    const pkg = res.data
    return {
      title: pkg.title,
      description:
        pkg.shortDescription?.replace(/<[^>]*>/g, "").slice(0, 160) ||
        undefined,
      alternates: { canonical: `/trip/${slug}` },
    }
  } catch {
    return {}
  }
}
import { decodeHtmlEntities } from "@/lib/html-decoder"
import { StickyWrapper } from "@/components/sticky-wrapper"
import { ItineraryList } from "@/components/itinerary-list"
import { Lightbox } from "@/components/lightbox"
import { DownloadItineraryButton } from "@/components/download-itinerary-button"
import { ThumbnailGallery } from "@/components/thumbnail-gallery"
import { ReviewsCarousel } from "@/components/reviews-carousel"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

const tabs = [
  { label: "Overview", icon: Info },
  { label: "Itinerary", icon: Route },
  { label: "Includes", icon: Check },
  { label: "Excludes", icon: X },
  { label: "Departures", icon: Calendar },
  { label: "Useful Info", icon: HelpCircle },
  { label: "Reviews", icon: Star },
  { label: "FAQs", icon: MessageCircle },
]

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let pkg
  try {
    const res = await getActivityBySlug(slug)
    pkg = res.data
  } catch {
    notFound()
  }

  const difficulty =
    pkg.difficultyLevel
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()) ?? "Moderate"
  const heroImg = img(pkg.images[0], API)

  let testimonials: { author: string; content: string }[] = []
  try {
    testimonials = (await getTestimonials()).map((t) => ({
      author: t.author,
      content: t.content,
    }))
  } catch {}

  let slots: import("@/lib/types").Slot[] = []
  try {
    const slotRes = await getSlots(pkg.id)
    slots = slotRes.data.slots
  } catch {}

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const upcomingSlots = slots
    .filter((s) => s.visible && new Date(s.departureDate) >= today)
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime())

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero ── */}
      <section className="relative">
        <div className="relative h-[400px] w-full overflow-hidden md:h-[480px]">
          <Lightbox src={heroImg} alt={pkg.title} />
          {pkg.images.length > 0 && (
            <ThumbnailGallery images={pkg.images} apiUrl={API} />
          )}
        </div>
      </section>

      {/* ── Main content ── */}
      <section className="pb-20 pt-12 text-lg leading-relaxed font-medium lg:pb-12">
        <SectionNav />

        <div className="mx-auto grid max-w-7xl min-w-0 gap-8 px-4 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            {/* ── Title & Breadcrumb ── */}
            <div className="mb-6">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-orange">Home</Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-navy">{pkg.title}</span>
              </nav>

              <span className="mt-4 inline-block rounded-full bg-orange px-3 py-1 text-[11px] font-bold tracking-wider text-orange-foreground">
                {pkg.isFeatured ? "FEATURED" : "BEST SELLER"}
              </span>

              <h1 className="mt-3 text-3xl leading-tight font-bold text-navy md:text-5xl">
                {pkg.title}
              </h1>

            </div>

            {/* ── Facts ── */}
            <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                [
                  { icon: Clock, label: "Duration", value: pkg.duration },
                  { icon: Mountain, label: "Difficulty", value: difficulty },
                ],
                [
                  { icon: () => <span className="text-sm font-bold">↑</span>, label: "Max Altitude", value: pkg.maximumAltitude },
                  { icon: Calendar, label: "Best Season", value: pkg.bestSeason },
                ],
                [
                  { icon: HomeIcon, label: "Accommodation", value: pkg.accommodations?.join(", ") || "Tea House" },
                  { icon: Utensils, label: "Meals", value: pkg.meals },
                ],
                [
                  { icon: Users, label: "Group Size", value: pkg.groupSize || `${pkg.guestCapacity || 1} Pax` },
                  { icon: Bus, label: "Transportation", value: pkg.transportation || "N/A" },
                ],
              ].map((group, gi) => (
                <div key={gi} className="rounded-lg bg-[#DFEFE6] p-3">
                  {group.map((f) => {
                    const Icon = f.icon
                    return (
                      <div key={f.label} className="flex items-start gap-2 py-1 first:pb-1.5">
                        <Icon className="h-4 w-4 shrink-0 text-navy/60" />
                        <div className="min-w-0 text-sm leading-tight">
                          <div className="font-semibold text-navy">{f.value}</div>
                          <div className="text-xs text-navy/50">{f.label}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Mobile tabs */}
            <div className="lg:hidden">
              <StickyWrapper className="sticky z-10 py-3" offset={96}>
                <div className="scrollbar-hide flex flex-nowrap gap-1.5 overflow-x-auto rounded-2xl border border-border bg-card p-1.5 shadow-sm">
                  {tabs.map((t, i) => {
                    const Icon = t.icon
                    return (
                      <a
                        key={t.label}
                        href={`#${t.label.toLowerCase().replace(/\s+/g, "-")}`}
                        className={`inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-base font-semibold whitespace-nowrap transition-colors ${i === 0 ? "bg-navy text-navy-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-navy"}`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {t.label}
                      </a>
                    )
                  })}
                </div>
              </StickyWrapper>
            </div>

            {/* ── Overview ── */}
            <div id="overview" className="mt-8">
              <h2 className="text-2xl font-bold text-navy md:text-3xl">
                Overview
              </h2>
              <div
                className="prose prose-lg mt-3 w-full max-w-none wrap-break-word **:wrap-break-word prose-headings:text-navy prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-navy"
                dangerouslySetInnerHTML={{
                  __html: decodeHtmlEntities(pkg.shortDescription),
                }}
              />

              {pkg.fullDescription && (
                <div
                  className="prose prose-lg mt-6 w-full max-w-none wrap-break-word **:wrap-break-word prose-headings:text-navy prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-navy"
                  dangerouslySetInnerHTML={{
                    __html: decodeHtmlEntities(pkg.fullDescription),
                  }}
                />
              )}

              {(pkg.highlights ?? []).length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-navy">
                    Trip Highlights
                  </h3>
                  <div className="mt-4 space-y-3">
                    {pkg.highlights
                      .flatMap((h) => {
                        const m =
                          decodeHtmlEntities(h).match(/<li>(.*?)<\/li>/gi)
                        return m
                          ? m.map((s) => s.replace(/<\/?li>/gi, ""))
                          : [h]
                      })
                      .map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 text-lg text-navy"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                          <span
                            className="wrap-break-word"
                            dangerouslySetInnerHTML={{ __html: item.replace(/&nbsp;/g, " ") }}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {pkg.map && (
                <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card">
                  <img
                    src={img(pkg.map, API)}
                    alt="Route map"
                    className="h-72 w-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* ── Reviews ── */}
            <div id="reviews" className="mt-12 scroll-mt-24">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-navy md:text-3xl">
                    Traveler Reviews
                  </h2>
                </div>
              </div>

              <ReviewsCarousel items={testimonials} />
            </div>

            {/* ── Itinerary ── */}
            <div id="itinerary" className="mt-12 scroll-mt-24">
              <ItineraryList days={pkg.itinerary ?? []} />
            </div>

            {/* ── Includes ── */}
            <div id="includes" className="mt-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-navy md:text-3xl">
                What&apos;s Included
              </h2>
              <div className="mt-4 rounded-lg border border-border bg-card p-6">
                <div className="prose prose-lg w-full max-w-none wrap-break-word **:wrap-break-word prose-li:text-navy prose-li:marker:text-green-600">
                  {(pkg.inclusions ?? []).map((section, i) => (
                    <div
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: decodeHtmlEntities(section),
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Excludes ── */}
            <div id="excludes" className="mt-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-navy md:text-3xl">
                What&apos;s Excluded
              </h2>
              <div className="mt-4 rounded-lg border border-border bg-card p-6">
                <div className="prose prose-lg w-full max-w-none wrap-break-word **:wrap-break-word prose-li:text-navy prose-li:marker:text-red-500">
                  {(pkg.exclusions ?? []).map((section, i) => (
                    <div
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: decodeHtmlEntities(section),
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* ── Upcoming Departures ── */}
            {upcomingSlots.length > 0 && (
              <div id="departures" className="mt-16 scroll-mt-24">
                <h2 className="text-2xl font-bold text-navy md:text-3xl">
                  Upcoming Departures
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Choose your preferred departure date
                </p>
                <div className="mt-6 overflow-hidden rounded-xl border border-border shadow-sm">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-5 py-3.5 text-left text-sm font-semibold text-navy">Date</th>
                        <th className="px-5 py-3.5 text-left text-sm font-semibold text-navy">Price</th>
                        <th className="px-5 py-3.5 text-left text-sm font-semibold text-navy">Availability</th>
                        <th className="px-5 py-3.5 text-right text-sm font-semibold text-navy">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {upcomingSlots.map((s) => (
                        <tr key={s.id} className="transition-colors hover:bg-muted/30">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-orange shrink-0" />
                              <span className="font-medium text-navy">
                                {new Date(s.departureDate).toLocaleDateString("en-US", { weekday: "short", month: "long", day: "numeric", year: "numeric" })}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-lg font-bold text-navy">${Number(s.price).toLocaleString()}</span>
                            <span className="text-sm text-muted-foreground"> / person</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.remainingSeats > 5 ? "bg-success-soft text-success" : s.remainingSeats > 0 ? "bg-warning-soft text-warning" : "bg-red-50 text-red-600"}`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${s.remainingSeats > 5 ? "bg-success" : s.remainingSeats > 0 ? "bg-warning" : "bg-red-600"}`} />
                              {s.remainingSeats > 5 ? `${s.remainingSeats} seats` : s.remainingSeats > 0 ? `Only ${s.remainingSeats} left` : "Full"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <BookDialog slot={s} activityId={pkg.id} activityTitle={pkg.title} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── Useful Info ── */}
            {(pkg.additionalInfo ?? []).length > 0 && (
              <div id="useful-info" className="mt-12 scroll-mt-24">
                <h2 className="text-2xl font-bold text-navy md:text-3xl">
                  Useful Information
                </h2>
                <div className="mt-4 space-y-6">
                  {pkg.additionalInfo.map((info, i) => (
                    <div key={i}>
                      <h3 className="font-bold text-navy">{info.title}</h3>
                      <div
                        className="prose prose-lg mt-2 w-full max-w-none wrap-break-word **:wrap-break-word prose-p:leading-relaxed prose-p:text-muted-foreground"
                        dangerouslySetInnerHTML={{
                          __html: decodeHtmlEntities(info.description),
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── FAQs ── */}
            <FAQSection
              items={pkg.faqs ?? []}
              prose
              className="mt-12 scroll-mt-24"
            />

            {/* Video */}
            {pkg.videoUrl && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-navy md:text-3xl">
                  Video
                </h2>
                <div className="mt-4 aspect-video overflow-hidden rounded-lg">
                  <iframe
                    src={pkg.videoUrl}
                    className="h-full w-full"
                    allowFullScreen
                    title="Trip video"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <StickyWrapper
            className="sticky space-y-6 self-start max-lg:static"
            offset={120}
          >
            {/* Price */}
            <div id="price-card" className="rounded-lg border border-border bg-card shadow-sm">
              <div className="p-4 sm:p-5">
                {pkg.maxPrice && pkg.maxPrice !== pkg.price && (
                  <span className="mb-2 inline-block rounded-full bg-success-soft px-2 py-0.5 text-xs font-bold text-success">
                    Save ${pkg.maxPrice - pkg.price}
                  </span>
                )}
                <div className="text-sm text-muted-foreground">From</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-navy">
                    ${pkg.price}
                  </span>
                  {pkg.maxPrice && pkg.maxPrice !== pkg.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${pkg.maxPrice}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">per person</div>

                <a
                  href={`mailto:info@walkthroughnepal.com?subject=Inquiry%20about%20${encodeURIComponent(pkg.title)}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-navy px-4 py-3 text-sm font-semibold text-navy-foreground hover:opacity-90"
                >
                  <Mail className="h-4 w-4" /> Send Inquiry
                </a>
              </div>

              <div className="border-t border-border px-4 py-3 sm:px-5">
                <DownloadItineraryButton
                  title={pkg.title}
                  slug={slug}
                  itinerary={pkg.itinerary ?? []}
                  duration={pkg.duration}
                  difficulty={difficulty}
                  maxAltitude={pkg.maximumAltitude}
                  bestSeason={pkg.bestSeason}
                  accommodations={pkg.accommodations?.join(", ") || "Tea House"}
                  meals={pkg.meals}
                  groupSize={pkg.groupSize || `${pkg.guestCapacity || 1} Pax`}
                  transportation={pkg.transportation || "N/A"}
                  meetingPoint={pkg.meetingPoint}
                  dropOffPoint={pkg.dropOffPoint}
                  shortDescription={pkg.shortDescription}
                  fullDescription={pkg.fullDescription}
                  highlights={pkg.highlights}
                  additionalInfo={pkg.additionalInfo}
                  faqs={pkg.faqs}
                />
              </div>
            </div>

            {/* Contact */}
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <img
                src="/images/hero-trekker.jpg"
                alt="Travel expert"
                className="h-32 w-full object-cover"
              />
              <div className="p-6 pt-4">
                <h3 className="font-bold text-navy">Need Help Planning?</h3>
                <p className="mt-1 text-lg text-muted-foreground">
                  Our travel experts are here to help you plan your perfect
                  trip.
                </p>
                <div className="mt-3 space-y-1 text-lg">
                  <div className="flex items-center gap-2 text-navy">
                    <Phone className="h-4 w-4 text-orange" /> +977 984 123
                    4567
                  </div>
                  <div className="flex items-center gap-2 text-navy">
                    <Mail className="h-4 w-4 text-orange" />{" "}
                    info@walkthroughnepal.com
                  </div>
                </div>
                <button className="mt-4 rounded-md bg-navy px-5 py-3 text-base font-semibold text-navy-foreground hover:opacity-90">
                  Talk To An Expert
                </button>
              </div>
            </div>
          </StickyWrapper>
        </div>
      </section>

      {/* Mobile sticky booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white p-3 shadow-lg lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-muted-foreground">From</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-navy">${pkg.price}</span>
              {pkg.maxPrice && pkg.maxPrice !== pkg.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${pkg.maxPrice}
                </span>
              )}
              <span className="text-xs text-muted-foreground">/person</span>
            </div>
          </div>
          <a href="#price-card" className="rounded-md bg-orange px-6 py-3 font-semibold whitespace-nowrap text-orange-foreground hover:opacity-90">
            View Dates
          </a>
        </div>
      </div>
    </div>
  )
}
