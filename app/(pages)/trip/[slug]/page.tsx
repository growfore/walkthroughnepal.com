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
  MessageSquare,
  Utensils,
  Bus,
  Sparkles,
  DollarSign,
  Map,
  Pointer,
  Backpack,
} from "lucide-react"
import { FAQSection } from "@/components/faq-section"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getActivityBySlug, getTestimonials, getSlots } from "@/lib/api"

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
import { renderRichText } from "@/lib/html-decoder"
import { resolveContentImages } from "@/lib/api"
import { StickyWrapper } from "@/components/sticky-wrapper"
import { ItineraryList } from "@/components/itinerary-list"
import { DownloadItineraryButton } from "@/components/download-itinerary-button"
import { HorizontalGallery } from "@/components/horizontal-gallery"
import { ReviewsCarousel } from "@/components/reviews-carousel"
import { AltitudeChart } from "@/components/altitude-chart"
import { CustomizeTripCTA } from "@/components/customize-trip-cta"
import { TierPricingCards } from "@/components/tier-pricing-cards"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

const tabs = [
  { label: "Overview", icon: Info },
  { label: "Itinerary", icon: Route },
  { label: "Cost Breakdown", icon: DollarSign },
  { label: "Map", icon: Map },
  { label: "Includes", icon: Check },
  { label: "Excludes", icon: X },
  { label: "Departures", icon: Calendar },
  { label: "Packing List", icon: Backpack },
  { label: "Useful Info", icon: HelpCircle },
  { label: "FAQs", icon: MessageSquare },
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

  const rawItinerary = pkg.itinerary as any
  const itineraryVariants: import("@/lib/types").ItineraryVariant[] =
    Array.isArray(rawItinerary) &&
    rawItinerary.length > 0 &&
    !("days" in rawItinerary[0])
      ? [
          {
            id: "default",
            name: "Standard",
            description: "",
            isDefault: true,
            days: rawItinerary,
          },
        ]
      : rawItinerary

  const difficulty =
    pkg.difficultyLevel
      ?.replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase()) ?? "Moderate"
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
    .sort(
      (a, b) =>
        new Date(a.departureDate).getTime() -
        new Date(b.departureDate).getTime()
    )

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero Gallery ── */}
      <section className="-mt-[40px] pb-0 md:-mt-[100px]">
        <HorizontalGallery images={pkg.images} apiUrl={API} />
      </section>

      {/* ── Sticky section nav ── */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="relative">
          <div className="mx-auto scrollbar-hide flex max-w-7xl flex-nowrap gap-1 overflow-x-auto py-3">
            {tabs.map((t) => {
              const Icon = t.icon
              return (
                <a
                  key={t.label}
                  href={`#${t.label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold whitespace-nowrap text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {t.label}
                </a>
              )
            })}
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
            <div className="h-6 w-6 animate-pulse rounded-full bg-muted text-muted-foreground grid place-items-center">
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <section className="pt-4 pb-20 text-lg leading-relaxed font-medium lg:pb-12">
        <div className="mx-auto grid max-w-7xl min-w-0 gap-8 px-4 lg:grid-cols-3">
          <div className="min-w-0 lg:col-span-2">
            {/* ── Title & Breadcrumb ── */}
            <div className="mb-6">
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-orange">
                  Home
                </Link>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-navy">{pkg.title}</span>
              </nav>

              <span className="mt-4 inline-block rounded-full bg-orange px-3 py-1 text-[11px] font-bold tracking-wider text-orange-foreground">
                {pkg.isFeatured ? "FEATURED" : "BEST SELLER"}
              </span>

              <h1 className="mt-3 text-2xl leading-tight font-bold text-navy md:text-4xl">
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
                  {
                    icon: () => <span className="text-sm font-bold">↑</span>,
                    label: "Max Altitude",
                    value: pkg.maximumAltitude,
                  },
                  {
                    icon: Calendar,
                    label: "Best Season",
                    value: pkg.bestSeason,
                  },
                ],
                [
                  {
                    icon: HomeIcon,
                    label: "Accommodation",
                    value: pkg.accommodations?.join(", ") || "Tea House",
                  },
                  { icon: Utensils, label: "Meals", value: pkg.meals },
                ],
                [
                  {
                    icon: Users,
                    label: "Group Size",
                    value: pkg.groupSize || `${pkg.guestCapacity || 1} Pax`,
                  },
                  {
                    icon: Bus,
                    label: "Transportation",
                    value: pkg.transportation || "N/A",
                  },
                ],
              ].map((group, gi) => (
                <div key={gi} className="rounded-lg bg-success-soft p-3">
                  {group.map((f) => {
                    const Icon = f.icon
                    return (
                      <div
                        key={f.label}
                        className="flex items-start gap-2 py-1 first:pb-1.5"
                      >
                        <Icon className="h-4 w-4 shrink-0 text-navy/60" />
                        <div className="min-w-0 text-sm leading-tight">
                          <div className="font-semibold text-navy">
                            {f.value}
                          </div>
                          <div className="text-xs text-navy/50">{f.label}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* ── Overview ── */}
            <div id="overview" className="mt-8 scroll-mt-40">
              <div
                className="prose prose-lg mt-3 w-full max-w-none wrap-break-word **:wrap-break-word **:text-ink"
                dangerouslySetInnerHTML={{
                  __html: resolveContentImages(renderRichText(pkg.shortDescription)),
                }}
              />
            </div>

            {/* ── Highlights ── */}
            {(pkg.highlights ?? []).length > 0 && (
              <div id="highlights" className="mt-12 scroll-mt-40">
                <h2 className="text-2xl font-bold text-navy md:text-3xl">
                  Trip Highlights
                </h2>
                <div className="mt-6 space-y-3">
                  {pkg.highlights
                    .flatMap((h) => {
                      const m = renderRichText(h).match(/<li>(.*?)<\/li>/gi)
                      return m ? m.map((s) => s.replace(/<\/?li>/gi, "")) : [h]
                    })
                    .map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 text-lg text-navy"
                      >
                        <Check className="mt-1.5 h-4 w-4 shrink-0 text-success" />
                        <span
                          className="wrap-break-word"
                          dangerouslySetInnerHTML={{
                            __html: item.replace(/&nbsp;/g, " "),
                          }}
                        />
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* ── Reviews ── */}
            <div id="reviews" className="mt-12 scroll-mt-40">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-navy md:text-3xl">
                    Traveler Reviews
                  </h2>
                </div>
              </div>

              <ReviewsCarousel items={testimonials} />
            </div>

            {/* ── Full Description ── */}
            {pkg.fullDescription && (
              <div className="mt-12 scroll-mt-40">
                <div
                  className="prose prose-lg w-full max-w-none wrap-break-word **:wrap-break-word **:text-ink"
                  dangerouslySetInnerHTML={{
                    __html: resolveContentImages(renderRichText(pkg.fullDescription)),
                  }}
                />
              </div>
            )}

            {/* ── Tier Pricing Cards ── */}
            {pkg.tier?.length > 0 && (
              <div className="mt-12 scroll-mt-40">
                <TierPricingCards tiers={pkg.tier} />
              </div>
            )}

            {/* ── Itinerary ── */}
            <div id="itinerary" className="mt-12 scroll-mt-40">
              <ItineraryList variants={itineraryVariants ?? []} />
            </div>

            {/* ── Price Breakdown ── */}
            {pkg.priceBreakdown && (
              <div id="cost-breakdown" className="mt-12 scroll-mt-40">
                <div
                  className="prose prose-lg w-full max-w-none wrap-break-word **:wrap-break-word **:text-ink"
                  dangerouslySetInnerHTML={{
                    __html: resolveContentImages(renderRichText(pkg.priceBreakdown)),
                  }}
                />
              </div>
            )}

            {/* ── Map ── */}
            {pkg.map && (
              <div id="map" className="mt-12 scroll-mt-40">
                <div
                  className="prose prose-lg mt-4 w-full max-w-none wrap-break-word **:wrap-break-word **:text-ink"
                  dangerouslySetInnerHTML={{
                    __html: resolveContentImages(renderRichText(pkg.map)),
                  }}
                />
              </div>
            )}

            {/* ── Altitude Profile ── */}
            {pkg.altitudeChart?.length > 0 && (
              <div className="mt-12 scroll-mt-40">
                <h2 className="text-2xl font-bold text-navy md:text-3xl">
                  Altitude Profile
                </h2>
                <div className="mt-4 overflow-x-auto rounded-lg border border-border bg-card p-4">
                  <AltitudeChart data={pkg.altitudeChart} />
                </div>
              </div>
            )}

            {/* ── Includes ── */}
            <style dangerouslySetInnerHTML={{ __html: `
              .prose li {
                position: relative;
                list-style: none;
                padding-left: 1.75rem;
              }
              .prose li::before {
                position: absolute;
                top: 0.15em;
                left: 0;
                display: grid;
                height: 1.25rem;
                width: 1.25rem;
                place-items: center;
                content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23162B38' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 14a8 8 0 0 1-8 8'/%3E%3Cpath d='M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2'/%3E%3Cpath d='M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1'/%3E%3Cpath d='M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10'/%3E%3Cpath d='M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15'/%3E%3C/svg%3E");
                transform: rotate(90deg);
              }
              #includes .prose li::before {
                content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2316a34a' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E");
                transform: none;
              }
              #excludes .prose li::before {
                content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23dc2626' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M18 6 6 18'/%3E%3Cpath d='m6 6 12 12'/%3E%3C/svg%3E");
                transform: none;
              }
              #packing-list .prose li::before {
                content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23162B38' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 6h4l2 4-2 4h-4'/%3E%3Cpath d='M14 6h4l2 4-2 4h-4'/%3E%3C/svg%3E");
                transform: none;
              }
              .prose table { display: block; overflow-x: auto; max-width: 100%; }
              .prose table th, .prose table td { white-space: nowrap; }
            ` }} />
            <div id="includes" className="mt-12 scroll-mt-40">
              <h2 className="text-2xl font-bold text-navy md:text-3xl">
                What&apos;s Included
              </h2>
              <div className="prose prose-lg mt-4 w-full max-w-none wrap-break-word **:wrap-break-word prose-li:relative prose-li:list-none prose-li:pl-8 prose-li:text-ink prose-li:before:absolute prose-li:before:top-[0.15em] prose-li:before:left-0 prose-li:before:grid prose-li:before:h-5 prose-li:before:w-5 prose-li:before:place-items-center prose-li:before:rounded-full">
                {(pkg.inclusions ?? []).map((section, i) => (
                  <div
                    key={i}
                    dangerouslySetInnerHTML={{
                      __html: resolveContentImages(renderRichText(section)),
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── Excludes ── */}
            <div id="excludes" className="mt-12 scroll-mt-40">
              <h2 className="text-2xl font-bold text-navy md:text-3xl">
                What&apos;s Excluded
              </h2>
              <div className="prose prose-lg mt-4 w-full max-w-none wrap-break-word **:wrap-break-word prose-li:relative prose-li:list-none prose-li:pl-8 prose-li:text-ink prose-li:before:absolute prose-li:before:top-[0.15em] prose-li:before:left-0 prose-li:before:grid prose-li:before:h-5 prose-li:before:w-5 prose-li:before:place-items-center prose-li:before:rounded-full">
                {(pkg.exclusions ?? []).map((section, i) => (
                  <div
                    key={i}
                    dangerouslySetInnerHTML={{
                      __html: resolveContentImages(renderRichText(section)),
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── Upcoming Departures ── */}
            {upcomingSlots.length > 0 && (
              <div id="departures" className="mt-16 scroll-mt-40">
                <h2 className="text-2xl font-bold text-navy md:text-3xl">
                  Upcoming Departures
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Choose your preferred departure date
                </p>
                <div className="mt-6 overflow-x-auto rounded-xl border border-border shadow-sm">
                  {/* Desktop table */}
                  <table className="hidden w-full border-collapse sm:table">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">
                          Date
                        </th>
                        <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">
                          Price
                        </th>
                        <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">
                          Availability
                        </th>
                        <th className="border border-border px-5 py-3.5 text-left text-sm font-semibold text-ink">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingSlots.map((s) => (
                        <tr
                          key={s.id}
                          className="transition-colors hover:bg-muted/30"
                        >
                          <td className="border border-border px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 shrink-0 text-orange" />
                              <span className="font-medium text-ink">
                                {new Date(s.departureDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    weekday: "short",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </span>
                            </div>
                          </td>
                          <td className="border border-border px-5 py-4">
                            <span className="text-lg font-bold text-ink">
                              ${Number(s.price).toLocaleString()}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {" "}
                              / person
                            </span>
                            <span className="ml-2 rounded-md bg-orange/10 px-1.5 py-0.5 text-xs font-semibold text-orange">
                              {s.days} {s.days === 1 ? "day" : "days"}
                            </span>
                          </td>
                          <td className="border border-border px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.remainingSeats > 5 ? "bg-success-soft text-success" : s.remainingSeats > 0 ? "bg-warning-soft text-warning" : "bg-red-50 text-red-600"}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${s.remainingSeats > 5 ? "bg-success" : s.remainingSeats > 0 ? "bg-warning" : "bg-red-600"}`}
                              />
                              {s.remainingSeats > 5
                                ? `${s.remainingSeats} seats`
                                : s.remainingSeats > 0
                                  ? `Only ${s.remainingSeats} left`
                                  : "Full"}
                            </span>
                          </td>
                          <td className="border border-border px-5 py-4 text-left">
                            {s.remainingSeats < 1 ? (
                              <span className="inline-block cursor-not-allowed rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">
                                Full
                              </span>
                            ) : (
                              <Link
                                href={`/booking?trip=${slug}&slot=${s.id}`}
                                className="inline-block rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-orange-foreground transition-all hover:opacity-90 hover:shadow-md"
                              >
                                Book Now
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Mobile cards */}
                  <div className="divide-y divide-border sm:hidden">
                    {upcomingSlots.map((s) => (
                      <div key={s.id} className="space-y-2 p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 items-center gap-2">
                            <Calendar className="h-4 w-4 shrink-0 text-orange" />
                            <span className="text-sm font-medium text-navy">
                              {new Date(s.departureDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          {s.remainingSeats < 1 ? (
                            <span className="inline-block cursor-not-allowed rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-muted-foreground">
                              Full
                            </span>
                          ) : (
                            <Link
                              href={`/booking?trip=${slug}&slot=${s.id}`}
                              className="inline-block rounded-lg bg-orange px-4 py-2 text-sm font-semibold text-orange-foreground transition-all hover:opacity-90 hover:shadow-md"
                            >
                              Book Now
                            </Link>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-navy">
                            ${Number(s.price).toLocaleString()}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            / person
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-orange/10 px-1.5 py-0.5 text-xs font-semibold text-orange">
                            {s.days} {s.days === 1 ? "day" : "days"}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${s.remainingSeats > 5 ? "bg-success-soft text-success" : s.remainingSeats > 0 ? "bg-warning-soft text-warning" : "bg-red-50 text-red-600"}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${s.remainingSeats > 5 ? "bg-success" : s.remainingSeats > 0 ? "bg-warning" : "bg-red-600"}`}
                            />
                            {s.remainingSeats > 5
                              ? `${s.remainingSeats} seats`
                              : s.remainingSeats > 0
                                ? `Only ${s.remainingSeats} left`
                                : "Full"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {(pkg.whatToBring ?? []).length > 0 && (
              <div id="packing-list" className="mt-12 scroll-mt-40">
                <div className="prose prose-lg mt-4 w-full max-w-none wrap-break-word **:wrap-break-word prose-li:relative prose-li:list-none prose-li:pl-8 prose-li:text-ink prose-li:before:absolute prose-li:before:top-[0.15em] prose-li:before:left-0 prose-li:before:grid prose-li:before:h-5 prose-li:before:w-5 prose-li:before:place-items-center prose-li:before:rounded-full">
                  {(pkg.whatToBring ?? []).map((section, i) => (
                    <div
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: resolveContentImages(renderRichText(section)),
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Useful Info ── */}
            {(pkg.additionalInfo ?? []).length > 0 && (
              <div id="useful-info" className="mt-12 scroll-mt-40">
                <div className="space-y-6">
                  {pkg.additionalInfo.map((info, i) => (
                    <div key={i}>
                      <h2 className="font-bold text-ink text-2xl md:text-3xl">{info.title}</h2>
                      <div
                        className="prose prose-lg mt-2 w-full max-w-none wrap-break-word **:wrap-break-word **:text-ink"
                        dangerouslySetInnerHTML={{
                          __html: resolveContentImages(renderRichText(info.description)),
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Customize CTA ── */}
            <div className="mt-12">
              <CustomizeTripCTA slug={slug} />
            </div>

            {/* ── FAQs ── */}
            <FAQSection
              id="faqs"
              items={pkg.faqs ?? []}
              prose
              className="mt-12 scroll-mt-40"
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
            className="sticky space-y-4 self-start max-lg:static"
            offset={100}
          >
            {/* Price */}
            <div
              id="price-card"
              className="rounded-lg border border-border bg-card shadow-sm"
            >
              <div className="p-4 sm:p-5">
                {pkg.maxPrice && pkg.maxPrice !== pkg.price && (
                  <span className="mb-2 inline-block rounded-full bg-success-soft px-2 py-0.5 text-xs font-bold text-success">
                    Save ${pkg.maxPrice - pkg.price}
                  </span>
                )}
                <div className="text-sm text-muted-foreground">Starts from</div>
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

                {upcomingSlots.length > 0 ? (
                  <a
                    href="#departures"
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-orange px-4 py-3 text-sm font-semibold text-orange-foreground hover:opacity-90"
                  >
                    Book Now
                  </a>
                ) : (
                  <Link
                    href={`/inquiry?trip=${slug}`}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-orange px-4 py-3 text-sm font-semibold text-orange-foreground hover:opacity-90"
                  >
                    Send Inquiry
                  </Link>
                )}
              </div>

              <div className="border-t border-border px-4 py-3 sm:px-5">
                <DownloadItineraryButton title={pkg.title} slug={slug} />
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-lg border border-border bg-card">
              <div className="p-6">
                <h3 className="font-bold text-navy">Need Help Planning?</h3>
                <p className="mt-1 text-lg text-muted-foreground">
                  Our travel experts are here to help you plan your perfect
                  trip.
                </p>
                <div className="mt-3 space-y-1 text-lg">
                  <div className="flex items-center gap-2 text-navy">
                    <Phone className="h-4 w-4 text-orange" /> +977 984 123 4567
                  </div>
                  <div className="flex items-center gap-2 text-navy">
                    <Mail className="h-4 w-4 text-orange" />{" "}
                    info@walkthroughnepal.com
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="mt-4 block rounded-md bg-navy px-5 py-3 text-center text-base font-semibold text-navy-foreground hover:opacity-90"
                >
                  Talk To An Expert
                </Link>
              </div>
            </div>
          </StickyWrapper>
        </div>
      </section>

      {/* Mobile sticky booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background px-4 py-3 shadow-lg lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">From</div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-navy">
                ${pkg.price}
              </span>
              {pkg.maxPrice && pkg.maxPrice !== pkg.price && (
                <span className="text-xs text-muted-foreground line-through">
                  ${pkg.maxPrice}
                </span>
              )}
              <span className="text-xs text-muted-foreground">/person</span>
            </div>
          </div>
          {upcomingSlots.length > 0 ? (
            <Link
              href={`/booking?trip=${slug}&slot=${upcomingSlots[0].id}`}
              className="shrink-0 rounded-lg bg-orange px-6 py-3 text-sm font-bold text-orange-foreground hover:opacity-90"
            >
              Book Now
            </Link>
          ) : (
            <Link
              href={`/inquiry?trip=${slug}`}
              className="shrink-0 rounded-lg bg-orange px-6 py-3 text-sm font-bold text-orange-foreground hover:opacity-90"
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
