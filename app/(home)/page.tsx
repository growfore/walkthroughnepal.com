import type { Metadata } from "next"
import {
  Star,
  ArrowRight,
  Headphones,
  Users,
  ClipboardList,
  Heart,
  PhoneCall,
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

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim()
}

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
    description: string
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
      description:
        b.metaDescription ?? stripHtml(b.content).slice(0, 120) + "...",
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
      </section>

      {/* ── Explore by Category ── */}
      <section className="mt-12 pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader title="Explore by Category" align="center" />
          <CategoryScroll categories={categories} />
        </div>
      </section>

      {/* ── Featured Trips ── */}
      {featuredSections.map((tag) => (
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

      {/* ── Plan Your Trip CTA ── */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-6 rounded-lg bg-navy p-10 text-navy-foreground">
            <div className="flex items-center gap-4">
              <Headphones className="h-12 w-12 shrink-0 text-orange" />
              <div>
                <h3 className="text-2xl font-bold">
                  Ready to start your adventure?
                </h3>
                <p className="mt-1 text-sm text-white/70">
                  Tell us your preferences and we&apos;ll craft a custom
                  itinerary for you.
                </p>
              </div>
            </div>
            <Link
              href="/design-your-trip"
              className="inline-flex items-center gap-2 rounded-full border border-white px-6 py-3 font-semibold hover:bg-white/10"
            >
              Plan Your Trip <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative overflow-hidden bg-muted py-24 md:py-32">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 10% 30%, #CB7040 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 90% 70%, #1A3F4F 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4">
          <div className="mb-14 text-center">
            <p className="mb-2 text-sm font-semibold tracking-widest uppercase text-orange">
              Testimonials
            </p>
            <h2 className="text-3xl font-bold text-navy md:text-4xl">
              What Our Travelers Say
            </h2>
            <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="flex text-orange">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <span>4.9/5 &middot; {testimonialList.length}+ reviews</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonialList.map((t, i) => (
              <div key={i} className="relative flex flex-col border border-border bg-card p-8">
                <svg
                  className="absolute -top-1 -left-1 h-8 w-8 text-orange/20"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10H14.017zM0 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151C7.546 6.068 5.983 8.789 5.983 11H10v10H0z" />
                </svg>
                <p className="mt-6 flex-1 text-sm leading-relaxed text-muted-foreground italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="mb-4 mt-6 flex gap-0.5">
                  {[...Array(5)].map((_, idx) => (
                    <svg key={idx} className="h-4 w-4 text-orange" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="mt-auto flex items-center gap-3 border-t border-border pt-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-navy">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-navy">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.country}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Travel Inspiration ── */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            title="Travel Inspiration"
            link={{ href: "/blog", label: "Visit Our Blog" }}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {blogList.map((b) => (
              <BlogCard key={b.slug} {...b} />
            ))}
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
