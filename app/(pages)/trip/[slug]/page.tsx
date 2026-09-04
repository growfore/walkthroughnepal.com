import type { Metadata } from "next"
import { headers } from "next/headers"
import {
  Mountain,
  Clock,
  ChevronRight,
  ChevronDown,
  Calendar,
  Users,
  Home as HomeIcon,
  Check,
  Mail,
  Phone,
  X,
  Utensils,
  Bus,
} from "lucide-react"
import { FAQSection } from "@/components/faq-section"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  getAllActivitySlugs,
  getPublishedActivityBySlug,
  getTestimonials,
  getSlots,
  img,
  parseItineraryVariants,
} from "@/lib/api"
import { siteConfig } from "@/lib/siteConfig"
import { getI18n } from "@/lib/server-locale"
import { buildTripAlternates, SITE_URL } from "@/lib/hreflang"
import { isLocaleCode, LOCALE_TERRITORY } from "@/lib/locales"
import { TouristTripJsonLd, FAQPageJsonLd, BreadcrumbJsonLd } from "@/components/json-ld"

type Props = { params: Promise<{ slug: string }> }

type GroupDiscountRule = {
  groupSize: number
  discount: number
  discountType: "PERCENTAGE" | "FLAT"
}

function groupDiscountTable(
  basePrice: number,
  rules?: GroupDiscountRule[],
): { pax: string; price: number }[] | null {
  if (!basePrice || !rules || rules.length === 0) return null
  const sorted = rules
    .filter((r) => r.groupSize >= 2 && r.discount > 0)
    .sort((a, b) => a.groupSize - b.groupSize)
  if (sorted.length === 0) return null

  let start = 2
  const rows = sorted.map((rule) => {
    const price =
      rule.discountType === "FLAT"
        ? rule.discount
        : Math.round(basePrice * (1 - rule.discount / 100))
    const row = {
      pax:
        start === rule.groupSize
          ? `${rule.groupSize} Pax`
          : `${start}-${rule.groupSize} Pax`,
      price,
    }
    start = rule.groupSize + 1
    return row
  })
  return [{ pax: "1 Pax", price: basePrice }, ...rows]
}

export function generateStaticParams() {
  return getAllActivitySlugs().then((slugs) => slugs.map((slug) => ({ slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params
    const h = await headers()
    const locale = h.get("x-locale") ?? "en"
    if (!isLocaleCode(locale)) return {}
    const pkg = await getPublishedActivityBySlug(slug, locale)
    if (!pkg) return {}
    const seo = pkg.seo
    const desc = seo?.metaDescription?.trim() || pkg.shortDescription?.replace(/<[^>]*>/g, "").slice(0, 160) || undefined
    const imageUrl = pkg.images?.[0] ? (pkg.images[0].startsWith("http") ? pkg.images[0] : `${SITE_URL}${pkg.images[0]}`) : `${SITE_URL}/opengraph-image`
    const { canonical, languages } = await buildTripAlternates(pkg.id, locale, slug)
    const ogLocale = LOCALE_TERRITORY[locale]
    return {
      title: seo?.metaTitle?.trim() || pkg.title,
      description: desc,
      keywords: seo?.metaKeywords
        ? seo.metaKeywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [pkg.title, "Nepal trek", pkg.difficultyLevel, pkg.bestSeason, "trekking package"].filter(Boolean),
      robots: seo?.metaRobots?.trim() || undefined,
      alternates: { canonical, languages },
      openGraph: {
        locale: ogLocale,
        title: pkg.title,
        description: desc,
        url: `${SITE_URL}${canonical}`,
        type: "article",
        images: [{ url: imageUrl, width: 1200, height: 630, alt: pkg.title }],
      },
      twitter: {
        card: "summary_large_image",
        title: pkg.title,
        description: desc,
        images: [imageUrl],
      },
    }
  } catch {
    return {}
  }
}
import { renderRichText } from "@/lib/html-decoder"
import { resolveContentImages } from "@/lib/api"
import { parseRichList, type RichSegment } from "@/lib/forms"
import { StickyWrapper } from "@/components/sticky-wrapper"
import { SectionNav } from "@/components/section-nav"
import { ItineraryList } from "@/components/itinerary-list"
import { DownloadItineraryButton } from "@/components/download-itinerary-button"
import { HorizontalGallery } from "@/components/horizontal-gallery"
import { ReviewsCarousel } from "@/components/reviews-carousel"
import { AltitudeChart } from "@/components/altitude-chart"
import { CustomizeTripCTA } from "@/components/customize-trip-cta"
import { TripPageClient } from "@/components/trip-page-client"
import { getIcon } from "@/lib/icons"

const sectionIds = [
  "overview",
  "departures",
  "itinerary",
  "cost-breakdown",
  "includes",
  "excludes",
  "map",
  "packing-list",
  "useful-info",
  "faqs",
]

function SegmentBlock({
  segments,
  Icon,
  iconClass,
  textClass,
}: {
  segments: RichSegment[]
  Icon: typeof Check
  iconClass: string
  textClass: string
}) {
  return segments.map((seg, i) =>
    seg.type === "prose" ? (
      <div
        key={i}
        className="prose prose-lg w-full max-w-none wrap-break-word **:wrap-break-word"
        dangerouslySetInnerHTML={{ __html: resolveContentImages(seg.html) }}
      />
    ) : (
      <div key={i} className={`flex items-start gap-3 text-lg ${textClass}`}>
        <Icon className={`mt-1.5 h-4 w-4 shrink-0 ${iconClass}`} />
        <span
          className="wrap-break-word"
          dangerouslySetInnerHTML={{ __html: resolveContentImages(seg.html) }}
        />
      </div>
    ),
  )
}

export default async function PackagePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const h = await headers()
  const locale = h.get("x-locale") ?? "en"
  if (!isLocaleCode(locale)) notFound()
  const { t } = await getI18n()

  let pkg
  try {
    pkg = await getPublishedActivityBySlug(slug, locale)
    if (!pkg) notFound()
  } catch {
    notFound()
  }

  const itineraryVariants = parseItineraryVariants(pkg.itinerary as unknown)

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

  // ponytail: no client-side date filter — the CMS `visible` flag is the gate
  const upcomingSlots = slots
    .filter((s) => s.visible)
    .sort(
      (a, b) =>
        new Date(a.departureDate).getTime() -
        new Date(b.departureDate).getTime()
    )

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TouristTripJsonLd
        title={pkg.title}
        description={pkg.shortDescription || ""}
        image={pkg.images?.[0] ? img(pkg.images[0]) : "/opengraph-image"}
        price={pkg.price}
        maxPrice={pkg.maxPrice}
        duration={pkg.duration}
        difficulty={difficulty}
        bestSeason={pkg.bestSeason || ""}
        slug={slug}
      />
      <BreadcrumbJsonLd items={[{ label: pkg.title, href: `/trip/${slug}` }]} />
      {(pkg.faqs ?? []).flatMap((g) => g.faqs).length > 0 && (
        <FAQPageJsonLd
          items={(pkg.faqs ?? []).flatMap((g) =>
            g.faqs.map((f) => ({ question: f.question, answer: f.answer }))
          )}
        />
      )}
      {/* ── Hero Gallery ── */}
      <section className="-mt-[40px] pb-0 md:-mt-[100px]">
        <HorizontalGallery images={pkg.images} title={pkg.title} />
      </section>

      {/* ── Sticky section nav ── */}
      <SectionNav sectionIds={sectionIds} />

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
                <span className="min-w-0 truncate text-navy">{pkg.title}</span>
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
                  { icon: Utensils, label: "Meals", value: pkg.meals },
                ],
                [
                  { icon: Mountain, label: "Difficulty", value: difficulty },
                  {
                    icon: Users,
                    label: "Group Size",
                    value: pkg.groupSize || `${pkg.guestCapacity || 1} Pax`,
                  },
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
                className="prose prose-lg mt-3 w-full max-w-none wrap-break-word **:wrap-break-word"
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
                  <SegmentBlock
                    segments={pkg.highlights.flatMap((h) => parseRichList(renderRichText(h)))}
                    Icon={Check}
                    iconClass="text-success"
                    textClass="text-navy"
                  />
                </div>
            </div>
            )}

            {/* ── Reviews ── */}
            {testimonials && testimonials.length > 0 &&
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
            }

            {/* ── Full Description ── */}
            {pkg.fullDescription && (
              <div className="mt-12 scroll-mt-40">
                <div
                  className="prose prose-lg w-full max-w-none wrap-break-word **:wrap-break-word"
                  dangerouslySetInnerHTML={{
                    __html: resolveContentImages(renderRichText(pkg.fullDescription)),
                  }}
                />
              </div>
            )}

            {/* ── Tier Pricing Cards + Departures ── */}
            <TripPageClient
              tiers={pkg.tier}
              hasSlots={upcomingSlots.length > 0}
              slots={upcomingSlots}
              slug={slug}
              tripTitle={pkg.title}
            />

            {/* ── Itinerary ── */}
            <div id="itinerary" className="mt-12 scroll-mt-40">
              <ItineraryList variants={itineraryVariants ?? []} />
            </div>

            {/* ── Price Breakdown ── */}
            {pkg.priceBreakdown && (
              <div id="cost-breakdown" className="mt-12 scroll-mt-40">
                <div
                  className="prose prose-lg w-full max-w-none wrap-break-word **:wrap-break-word"
                  dangerouslySetInnerHTML={{
                    __html: resolveContentImages(renderRichText(pkg.priceBreakdown)),
                  }}
                />
              </div>
            )}



            {/* ── Includes ── */}
            <div id="includes" className="mt-12 scroll-mt-40">
              <h2 className="text-2xl font-bold text-navy md:text-3xl">
                What&apos;s Included
              </h2>
              <div className="mt-6 space-y-3">
                <SegmentBlock
                  segments={(pkg.inclusions ?? []).flatMap((h) => parseRichList(renderRichText(h)))}
                  Icon={Check}
                  iconClass="text-success"
                  textClass="text-navy"
                />
              </div>
            </div>

            {/* ── Excludes ── */}
            <div id="excludes" className="mt-12 scroll-mt-40">
              <h2 className="text-2xl font-bold text-navy md:text-3xl">
                What&apos;s Excluded
              </h2>
              <div className="mt-6 space-y-3">
                <SegmentBlock
                  segments={(pkg.exclusions ?? []).flatMap((h) => parseRichList(renderRichText(h)))}
                  Icon={X}
                  iconClass="text-error"
                  textClass="text-navy"
                />
              </div>
            </div>

            {/* ── Map ── */}
                       {pkg.map && (
                         <div id="map" className="mt-12 scroll-mt-40">
                           <div
                             className="prose prose-lg mt-4 w-full max-w-none wrap-break-word **:wrap-break-word"
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


            {/* ── Packing List ── */}
            {pkg.whatToBring && pkg.whatToBring.categories.length > 0 && (
              <div id="packing-list" className="mt-12 scroll-mt-40">
                <h2 className="text-2xl font-bold text-navy md:text-3xl">
                  Packing List
                </h2>
                {pkg.whatToBring.description && (
                  <div
                    className="prose prose-lg mt-4 w-full max-w-none wrap-break-word **:wrap-break-word"
                    dangerouslySetInnerHTML={{
                      __html: resolveContentImages(renderRichText(pkg.whatToBring.description)),
                    }}
                  />
                )}
                <div className="mt-6 space-y-6">
                  {pkg.whatToBring.categories.map((cat, i) => {
                    const Icon = getIcon(cat.icon)
                    return (
                      <div key={i}>
                        <h3 className="flex items-center gap-2 text-lg font-bold text-navy">
                          <Icon className="h-5 w-5" />
                          {cat.name}
                        </h3>
                        <div className="mt-2 space-y-3">
                          <SegmentBlock
                            segments={cat.content.flatMap((h) => parseRichList(renderRichText(h)))}
                            Icon={Check}
                            iconClass="text-muted-foreground"
                            textClass="text-ink"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Useful Info ── */}
            {(pkg.additionalInfo ?? []).length > 0 && (
              <div id="useful-info" className="mt-12 scroll-mt-40">
                <h2 className="text-2xl font-bold text-navy md:text-3xl">
                  Useful Info
                </h2>
                <Accordion type="multiple" className="mt-4 space-y-3">
                  {pkg.additionalInfo.map((info, i) => (
                    <AccordionItem key={i} value={`info-${i}`} className="rounded-lg border border-border">
                      <AccordionTrigger className="px-4 py-4 text-base font-semibold text-navy hover:no-underline focus-visible:ring-0 [&[data-open]>svg]:rotate-0">
                        {info.title}
                      </AccordionTrigger>
                      <AccordionContent forceMount className="data-[state=closed]:hidden">
                        <div
                          className="prose prose-lg w-full max-w-none border-t border-border px-4 py-3 wrap-break-word **:wrap-break-word prose-p:text-muted-foreground"
                          dangerouslySetInnerHTML={{
                            __html: resolveContentImages(renderRichText(info.description)),
                          }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}

            {/* ── Customize CTA ── */}
            <div className="mt-12">
              <CustomizeTripCTA slug={slug} />
            </div>

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

                {pkg.showGroupDiscount !== false && groupDiscountTable(pkg.price, pkg.groupDiscount) && (
                  <details className="group mt-3">
                    <summary className="flex w-full cursor-pointer list-none items-center justify-between rounded-md border border-border bg-muted/40 px-3 py-2 text-sm font-semibold text-navy [&::-webkit-details-marker]:hidden">
                      {t("See group booking discount")}
                      <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-2 overflow-hidden rounded-md border border-border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            <th className="px-3 py-2">{t("No. of people")}</th>
                            <th className="px-3 py-2">{t("Price per person")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupDiscountTable(pkg.price, pkg.groupDiscount)?.map((row) => (
                            <tr key={row.pax} className="border-b border-border last:border-0">
                              <td className="px-3 py-2 text-navy">{row.pax}</td>
                              <td className="px-3 py-2 text-navy">
                                USD {row.price.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                )}

                <Link
                  href={`/inquiry?trip=${slug}`}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-orange px-4 py-3 font-semibold text-orange-foreground hover:opacity-90 underline text-lg"
                >
                  Inquire Now
                </Link>
                <a
                  href="#departures"
                  className="mt-2 text-lg flex w-full items-center justify-center gap-2 rounded-lg border border-navy bg-transparent px-4 py-3  font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
                >
                  Check Availability
                </a>
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
                    <Phone className="h-4 w-4 text-orange" /> {siteConfig.phoneNumbers[0].phone}
                  </div>
                  <div className="flex items-center gap-2 text-navy">
                    <Mail className="h-4 w-4 text-orange" />{" "}
                    {siteConfig.email}
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

      {/* ── FAQs (full width) ── */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <FAQSection
          id="faqs"
          groups={pkg.faqs ?? []}
        />
      </section>

      {/* Video (full width) */}
      {pkg.videoUrl && (
        <section className="mx-auto max-w-7xl px-4 pb-12">
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
        </section>
      )}

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
          <Link
              href={`/inquiry?trip=${slug}`}
              className="shrink-0 rounded-lg bg-orange px-6 py-3 text-sm font-bold text-orange-foreground hover:opacity-90"
            >
              Inquire Now
            </Link>
        </div>
      </div>
    </div>
  )
}
