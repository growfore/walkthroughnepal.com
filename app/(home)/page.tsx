import type { Metadata } from "next"
import {
  Star,
  ChevronRight,
  Users,
  ArrowUpRight,
  MessageCircle,
  Sparkles,
  MapPin,
  Shield,
  HeartHandshake,
} from "lucide-react"
import Link from "next/link"
import type { FeaturedTag } from "@/lib/types"

export const metadata: Metadata = {
  title: "Walk Through Nepal — Authentic Himalayan Adventures",
  description:
    "Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas with Walk Through Nepal. 20+ years of local expertise, 50+ destinations, 5000+ happy travelers.",
  keywords: [
    "Nepal trekking",
    "Himalayan adventure",
    "Nepal travel agency",
    "trekking packages Nepal",
    "Nepal tour operator",
  ],
  openGraph: {
    title: "Walk Through Nepal — Authentic Himalayan Adventures",
    description:
      "Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas.",
    url: "https://walkthroughnepal.com",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Walk Through Nepal — Authentic Himalayan Adventures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Walk Through Nepal — Authentic Himalayan Adventures",
    description:
      "Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas.",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "/" },
}
import {
  getFeaturedTags,
  getTripCategories,
  getPublishedPosts,
  getTestimonials,
  img,
  API_BASE,
} from "@/lib/api"
import { WebSiteJsonLd } from "@/components/json-ld"
import { CategoryScroll } from "@/components/category-scroll"
import { HorizontalScroll } from "@/components/horizontal-scroll"
import { TripCard } from "@/components/trip-card"
import { SectionHeader } from "@/components/section-header"
import { BlogCard } from "@/components/blog-card"
import { SearchSection } from "@/components/search-section"
import { DeparturesPage } from "@/components/departures-page"
import { ScrollButtons } from "@/components/scroll-buttons"
import { TestimonialCard } from "@/components/testimonial-card"
import { siteConfig } from "@/lib/siteConfig"
import HeroSection from "./hero"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  let categories: {
    img: string
    title: string
    sub: string
    cta: string
    handle: string
  }[] = []
  let featuredSections: FeaturedTag[] = []
  let blogList: {
    slug: string
    image: string
    tag: string
    title: string
    description: string | null
    date: string
  }[] = []
  let testimonials: { name: string; rating: number; text: string }[] = []
  try {
    testimonials = (await getTestimonials())
      .slice(0, 6)
      .map((t) => ({
        name: t.author,
        rating: t.rating,
        text: t.content,
      }))
  } catch {}
  try {
    const {
      data: { tripCategories },
    } = await getTripCategories()
    categories = tripCategories.map((c) => ({
      img: img(c.categoryImage) ?? "/images/cat-trekking.jpg",
      title: c.categoryName,
      sub: c.categoryHandle
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l: string) => l.toUpperCase()),
      cta: "Explore",
      handle: c.categoryHandle,
    }))
  } catch {}

  try {
    const {
      data: { featuredTags },
    } = await getFeaturedTags()
    featuredSections = featuredTags
  } catch {}

  const heroTag = featuredSections.find((t) => t.activity?.length)
  const heroActivity = heroTag
    ? { ...heroTag.activity[0], tag: heroTag.name.split("::")[0] || heroTag.name }
    : null

  try {
    const { posts } = await getPublishedPosts(1, 4)
    blogList = posts.map((b) => ({
      slug: b.slug,
      image: img(b.coverImage),
      tag: b.category?.name?.toUpperCase() ?? "TRAVEL",
      title: b.title,
      description: b.metaDescription ?? null,
      date: b.publishedAt || b.createdAt,
    }))
  } catch {}

  let destinations: { img: string; title: string; handle: string }[] = []
  try {
    const res = await fetch(`${API_BASE}/api/v1/city?page=1&limit=10`, { next: { revalidate: 3600 } })
    const json = await res.json()
    destinations = (json.data?.cities ?? []).map((c: { cityName: string; cityHandle: string; cityImage: string }) => ({
      img: c.cityImage || "/manaslu-view.webp",
      title: c.cityName,
      handle: c.cityHandle,
    }))
  } catch {}

  type SlotRaw = {
    id: number; departureDate: string; price: string; remainingSeats: number; visible: boolean
    days: number; maxGroupSize: number
    activity: { id: number; title: string; slug: string }
  }
  type ActivityMeta = { id: string; slug: string; title: string }
  let departuresActivities: ActivityMeta[] = []
  let departuresFilterMeta = { years: [] as string[], activityIds: [] as number[], months: [] as number[], days: [] as number[] }
  let initialSlots: SlotRaw[] = []
  let departuresCount = 0
  try {
    const [actRes, slotRes] = await Promise.all([
      fetch(`${API_BASE}/api/v1/activity?page=1&limit=100`, { next: { revalidate: 3600 } }),
      fetch(`${API_BASE}/api/v1/slot?limit=500`, { next: { revalidate: 3600 } }),
    ])
    const [actJson, slotJson] = await Promise.all([actRes.json(), slotRes.json()])
    departuresActivities = (actJson.data ?? []).map((a: { id: number; slug: string; title: string }) => ({
      id: String(a.id), slug: a.slug, title: a.title,
    })).sort((a: ActivityMeta, b: ActivityMeta) => a.title.localeCompare(b.title))
    const allSlots: SlotRaw[] = (slotJson.data?.slots ?? []).filter((s: SlotRaw) => s.visible)
    departuresFilterMeta = {
      years: [...new Set(allSlots.map(s => new Date(s.departureDate).getFullYear().toString()))].sort(),
      activityIds: [...new Set(allSlots.map(s => s.activity.id))],
      months: [...new Set(allSlots.map(s => new Date(s.departureDate).getMonth()))].sort((a, b) => a - b),
      days: [...new Set(allSlots.map(s => s.days))].sort((a, b) => a - b),
    }
    initialSlots = allSlots.slice(0, 12)
    departuresCount = allSlots.length
  } catch {}


  return (
    <div className="min-h-screen bg-background text-foreground">
      <WebSiteJsonLd />

      <HeroSection/>

      {/* ── Featured Trips ── */}
      {featuredSections.filter((t) => t.activity?.length).map((tag) => (
        <section key={tag.slug} className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeader
              title={tag.name.split("::")[0] || tag.name}
              description={tag.description}
            />
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tag.activity?.map((a) => (
                <TripCard key={a.slug} activity={a} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/explore" className="inline-flex items-center gap-1 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-orange-foreground hover:opacity-90">
                Explore More <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      ))}


      {/* ── Explore by Category ── */}
      <section className="mt-12 pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader title="Explore by Category" rightAction={<ScrollButtons targetId="category-scroll" />} />
          <CategoryScroll categories={categories} id="category-scroll" />
        </div>
      </section>

      {/* ── Search Section ── */}
      <SearchSection categories={categories} />

      {/* ── Destinations ── */}
      {destinations.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeader
              title="Destinations"
              description="Explore our curated destinations across Nepal"
              rightAction={<ScrollButtons targetId="destinations-scroll" />}
            />
            <HorizontalScroll id="destinations-scroll" headerRight>
              {destinations.map((d) => (
                <Link
                  key={d.handle}
                  href={`/explore?city=${d.handle}`}
                  className="group relative w-64 shrink-0 snap-start overflow-hidden rounded-xl"
                >
                  <img
                    src={d.img}
                    alt={d.title}
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="font-semibold text-white">{d.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-white/80">View trips <ChevronRight className="h-4 w-4" /></p>
                  </div>
                </Link>
              ))}
            </HorizontalScroll>
          </div>
        </section>
      )}

      {/* ── Departures ── */}
      <section className="bg-muted py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            title="Upcoming Departures"
            description="Join a scheduled group departure for your next adventure"
            link={{ href: "/departure", label: "View All" }}
          />
          <div className="mt-10">
            <DeparturesPage
              activities={departuresActivities}
              filterMeta={departuresFilterMeta}
              initialSlots={initialSlots}
              totalCount={departuresCount}
            />
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/departure"
              className="inline-flex items-center gap-1 rounded-full border border-orange px-6 py-3 text-sm font-semibold text-orange hover:bg-orange hover:text-orange-foreground transition-colors"
            >
              View All Departures <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── About Us ── */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <div className="flex justify-center">
            <div className="relative flex gap-1">
              <div className="h-100 w-80 overflow-hidden border-8 border-white shadow-xl left-2">
                <img
                  src="/narphu-trek.webp"
                  alt="Trekking in the Nar Phu Valley, Nepal"
                  width={700}
                  height={700}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase text-orange">
              About Walk Through Nepal
            </p>
            <h2 className="mt-3 text-3xl font-bold text-navy md:text-4xl">
              Local Experts. Authentic Himalayan Adventures.
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
              Founded by local trekking guides, we&apos;ve spent{" "}
              {siteConfig.experience} leading adventurers through the Himalayas —
              from the bustling streets of Kathmandu to the remote trails of the Nar
              Phu Valley. Every journey is designed to immerse you in Nepal&apos;s
              rich culture, breathtaking landscapes, and warm hospitality.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {[
                { icon: Users, value: "20+", label: "Years Experience" },
                { icon: MapPin, value: "50+", label: "Destinations" },
                { icon: Shield, value: "5,000+", label: "Happy Travelers" },
                { icon: HeartHandshake, value: "100%", label: "Local Team" },
              ].map((s) => (
                <div key={s.label} className="text-center bg-primary rounded-sm text-white p-4">
                  <s.icon className="mx-auto h-6 w-6 text-orange" />
                  <p className="mt-2 text-xl font-bold ">{s.value}</p>
                  <p className="text-xs">{s.label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-1 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-orange-foreground hover:opacity-90"
            >
              More About Us <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-widest uppercase text-orange">
              Testimonials
            </p>
            <h2 className="mt-2 text-3xl font-bold text-navy md:text-4xl">
              What Our Travelers Say
            </h2>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="flex text-orange">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span>4.9/5 · Trusted by 2,000+ travelers</span>
            </div>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Travel Inspiration ── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader title="Travel Inspiration" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {blogList.map((b) => (
              <BlogCard
                key={b.slug} {...b} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 rounded-full border border-orange px-6 py-3 text-sm font-semibold text-orange hover:bg-orange hover:text-orange-foreground transition-colors"
            >
              Visit Our Blog <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Travel Consultant ── */}
      <section className="py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <div className="flex justify-center">
            <div className="relative">
              <div className="h-100 w-80 overflow-hidden  border-8 border-white shadow-xl">
                <img
                  src="/manaslu-view.webp"
                  alt="Travel Consultant"
                  width={700}
                  height={700}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-orange">
               Looking for a Private Trip?
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-navy md:text-4xl">
              Say Hello to your Travel Consultant
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
              Planning your holiday? Our travel experts are here to craft the perfect
              personalized package just for you! Whether you have questions or need guidance,
              don&apos;t hesitate to reach out &mdash; we&apos;re ready to assist you every step
              of the way.
            </p>
            <p className="mt-6 font-bold text-navy">Need Assistance? Call Us.</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <a
                href={`tel:${siteConfig.phoneNumbers[0].tel ?? siteConfig.whatsAppNumber}`}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-6 py-3 font-bold text-navy hover:border-[#25D366]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]">
                  <MessageCircle className="h-4 w-4 text-white" />
                </span>
                {siteConfig.phoneNumbers[0].phone}
              </a>
              <Link
                href="/design-your-trip"
                className="flex items-center gap-2 rounded-lg border border-navy bg-card px-6 py-3 font-bold text-navy hover:bg-navy hover:text-white transition-colors"
              >
                Plan Your Trip <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ── Floating Recommend Button ── */}
      <Link
        href="/recommend"
        className="group fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-orange text-white shadow-sm transition-all hover:bg-orange/90 hover:text-white"
      >
        <Sparkles className="h-5 w-5" />
        <span className="pointer-events-none absolute bottom-full right-0 mb-2 whitespace-nowrap rounded-lg bg-navy px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          Find Your Perfect Adventure
        </span>
      </Link>
    </div>
  )
}
