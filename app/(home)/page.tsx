import type { Metadata } from "next"
import {
  Star,
  ArrowRight,
  Send,
  Users,
  ClipboardList,
  Heart,
  PhoneCall,
  Mountain,
  MapPin,
  Compass,
  ArrowUpRight,
  MessageCircle,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import type { FeaturedTag } from "@/lib/types"

export const metadata: Metadata = {
  title: "Walk Through Nepal",
  description:
    "Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas with Walk Through Nepal.",
  openGraph: {
    title: "Walk Through Nepal",
    description:
      "Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas.",
  },
}
import {
  getFeaturedTags,
  getTestimonials,
  getTripCategories,
  getPublishedPosts,
  img,
} from "@/lib/api"
import { CategoryScroll } from "@/components/category-scroll"
import { HorizontalScroll } from "@/components/horizontal-scroll"
import { TripCard } from "@/components/trip-card"
import { SectionHeader } from "@/components/section-header"
import { SearchBox } from "@/components/search-box"
import { BlogCard } from "@/components/blog-card"
import { AutoScroll } from "@/components/auto-scroll"

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
  let testimonialList: { name: string; country: string; text: string }[] = []
  let blogList: {
    slug: string
    image: string
    tag: string
    title: string
    description: string | null
    date: string
  }[] = []
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

  const popularTrips = featuredSections[0]?.activity?.slice(0, 4) ?? []

  try {
    const testimonials = await getTestimonials()
    testimonialList = testimonials.map((t) => ({
      name: t.author,
      country: "Nepal",
      text: t.content,
    }))
  } catch {}

  try {
    const { blogs } = await getPublishedPosts(1, 4)
    blogList = blogs.map((b) => ({
      slug: b.slug,
      image: img(b.coverImage),
      tag: b.category?.name?.toUpperCase() ?? "TRAVEL",
      title: b.title,
      description: b.metaDescription ?? null,
      date: new Date(b.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    }))
  } catch {}

  const reasons = [
    {
      icon: Users,
      title: "Local Experts",
      text: "Real Nepal based team with in-depth knowledge.",
    },
    {
      icon: ClipboardList,
      title: "Flexible Itineraries",
      text: "Customize your trip to match your time and budget.",
    },
    {
      icon: Heart,
      title: "Responsible Tourism",
      text: "We support local communities and sustainable travel.",
    },
    {
      icon: PhoneCall,
      title: "24/7 Support",
      text: "We're with you before, during and after your trip.",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero ── */}
      <section className="relative">
        <div className="relative h-[540px] w-full overflow-hidden">
          <img
            src="/manaslu-view.webp"
            alt="Trekker in Himalayas"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-black/20 to-transparent backdrop-blur-[2px]" />
          <div className="relative mx-auto flex h-full max-w-7xl items-center px-4">
            <div className="max-w-2xl text-white">
              <h1 className="text-6xl leading-[1.05] font-bold md:text-7xl">
                Explore Nepal
              </h1>
              <h2 className="mt-1 text-5xl leading-[1.05] font-bold text-orange md:text-6xl">
                Beyond The Guidebook
              </h2>
              <p className="mt-6 max-w-xl text-lg text-white/85">
                Discover authentic treks, cultural journeys, wildlife adventures
                and local experiences across the Himalayas.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative z-10 mx-auto -mt-10 max-w-2xl px-4">
          <SearchBox />
        </div>

        {/* Recommendation CTA */}
        <div className="mx-auto mt-8 max-w-2xl px-4 text-center">
          <Link href="/recommend" className="inline-flex items-center gap-2 rounded-full border-2 border-orange bg-orange/5 px-8 py-3 text-sm font-bold text-orange transition hover:bg-orange hover:text-white">
            Find Your Perfect Nepal Adventure <Sparkles className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* ── Explore by Category ── */}
      <section className="mt-12 pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader title="Explore by Category" align="center" />
          <CategoryScroll categories={categories} />
        </div>
      </section>

      {/* ── Featured Trips ── */}
      {featuredSections.filter((t) => t.activity?.length).map((tag) => (
        <section key={tag.slug} className="pb-16">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeader
              title={tag.name.split("::")[0] || tag.name}
              description={tag.description}
            />
            <HorizontalScroll>
              {tag.activity?.map((a) => (
                <div key={a.slug} className="w-72 shrink-0 snap-start">
                  <TripCard activity={a} compact />
                </div>
              ))}
            </HorizontalScroll>
            <div className="mt-8 text-center">
              <Link href="/explore" className="inline-flex items-center gap-1 rounded-full bg-orange px-6 py-3 text-sm font-semibold text-orange-foreground hover:opacity-90">
                Explore More <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* ── Ways to Travel ── */}
      <section className="pb-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold text-navy md:text-4xl">
              Ways to Travel
            </h2>
            <p className="mt-6 max-w-md leading-relaxed text-muted-foreground">
              Everyone is an explorer at heart. You just need to get out there to realize it.
              Our treks are designed for anyone who is a mountain enthusiast, despite prior
              experience. Likewise, the tours we provide are accessible to everyone, requiring
              minimal effort.
            </p>
            <Link
              href="/explore"
              className="mt-8 inline-block rounded-full border-2 border-navy px-8 py-3 text-sm font-bold tracking-wider text-navy hover:bg-navy hover:text-white transition-colors"
            >
              SEE ALL ACTIVITIES
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2">
            {[
              {
                icon: Mountain,
                title: "Trekking in Nepal",
                desc: "Trekking and Hiking Adventures in Remote Nepalese Terrain",
              },
              {
                icon: MapPin,
                title: "Tour in Nepal",
                desc: "Guided Private and Group Tours in Tourist Centers of Nepal",
              },
              {
                icon: Compass,
                title: "Day Activities",
                desc: "1 Day Sightseeing or Cultural Tours & Adventure Activities",
              },
              {
                icon: Mountain,
                title: "Peak Climbing",
                desc: "6000+ Meters Peak Climbing Expeditions in The Himalayas",
              },
            ].map((w) => (
              <div key={w.title} className="flex gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-navy/5">
                  <w.icon className="h-7 w-7 text-navy" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-extrabold text-navy">{w.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Plan Your Trip CTA ── */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-navy p-14 text-navy-foreground shadow-lg">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-orange/20">
                <Send className="h-8 w-8 text-orange" />
              </div>
              <div>
                <h3 className="text-2xl font-bold sm:text-3xl">
                  Ready to start your adventure?
                </h3>
                <p className="mt-2 text-base text-white/70 max-w-lg">
                  Tell us your preferences and we&apos;ll craft a custom
                  itinerary for you.
                </p>
              </div>
            </div>
            <Link
              href="/design-your-trip"
              className="inline-flex items-center gap-2 rounded-full bg-orange px-8 py-4 text-base font-bold text-orange-foreground shadow-md hover:shadow-xl hover:scale-105 transition-all"
            >
              Plan Your Trip <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <p className="text-sm font-semibold tracking-widest uppercase text-orange">
                Testimonials
              </p>
              <h2 className="mt-2 text-4xl font-bold text-navy md:text-5xl">
                What Our Travelers Say
              </h2>
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex text-orange">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span>4.9/5 &middot; {testimonialList.length}+ reviews</span>
              </div>
            </div>
            <AutoScroll className="max-h-[280px] space-y-10 overflow-y-auto pr-2 md:max-h-[420px]">
              {testimonialList.map((t, i) => (
                <div key={i} className="border-l-4 border-orange pl-6">
                  <p className="leading-relaxed text-foreground/85">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-3 font-semibold text-navy">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.country}</div>
                </div>
              ))}
            </AutoScroll>
          </div>
        </div>
      </section>

      {/* ── Travel Inspiration ── */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader title="Travel Inspiration" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {blogList.map((b) => (
              <BlogCard key={b.slug} {...b} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1 rounded-full border border-orange px-6 py-3 text-sm font-semibold text-orange hover:bg-orange hover:text-orange-foreground transition-colors"
            >
              Visit Our Blog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Travel Consultant CTA ── */}
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <div className="relative flex justify-center">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "repeating-linear-gradient(-45deg, transparent 0 12px, oklch(0.24 0.08 262 / 0.06) 12px 14px)",
              }}
              aria-hidden
            />
            <div className="relative">
              <div className="h-80 w-80 overflow-hidden rounded-full border-8 border-white shadow-xl">
                <img
                  src="/consultant.jpg"
                  alt="Travel Consultant"
                  width={700}
                  height={700}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-lg bg-orange px-8 py-3 text-center shadow-lg">
                <p className="font-extrabold text-white">Walk Through Nepal</p>
                <p className="text-xs text-white/90">Travel Consultant</p>
              </div>
            </div>
          </div>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-orange">
              <Mountain className="h-5 w-5" /> Looking for a Private Trip?
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-navy md:text-4xl">
              SAY HELLO TO YOUR TRAVEL CONSULTANT
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
                href="tel:+9779841234567"
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-6 py-3 font-bold text-navy hover:border-[#25D366]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366]">
                  <MessageCircle className="h-4 w-4 text-white" />
                </span>
                +977 984 123 4567
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

      {/* ── Selling Points ── */}
      <section className="border-b border-white/10 bg-navy py-16 text-navy-foreground">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div key={r.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange/10 text-orange">
                  <r.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-bold">{r.title}</h3>
                <p className="mt-1 text-sm text-white/70">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
