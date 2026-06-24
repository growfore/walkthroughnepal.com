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
import type { FeaturedTag, TeamMember } from "@/lib/types"
import {
  getFeaturedTags,
  getTestimonials,
  getTripCategories,
  getPublishedPosts,
  getTeamMembers,
  img,
} from "@/lib/api"
import { CategoryScroll } from "@/components/category-scroll"
import { HorizontalScroll } from "@/components/horizontal-scroll"
import { TripCard } from "@/components/trip-card"
import { SectionHeader } from "@/components/section-header"
import { TeamCard } from "@/components/team-card"
import { SearchBox } from "@/components/search-box"

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
    img: string
    tag: string
    title: string
    desc: string
    date: string
    read: string
  }[] = []
  let teamMembers: TeamMember[] = []

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
      img: img(b.coverImage),
      tag: b.category?.name?.toUpperCase() ?? "TRAVEL",
      title: b.title,
      desc: b.metaDescription ?? stripHtml(b.content).slice(0, 120) + "...",
      date: new Date(b.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      read: "Blog",
    }))
  } catch {}

  try {
    const res = await getTeamMembers()
    const grouped = res.data
    if (grouped && typeof grouped === "object") {
      teamMembers = (Object.values(grouped) as any[])
        .flat()
        .slice(0, 4)
        .map((m: any) => ({ ...m, department: null }))
    }
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
        <div className="relative h-[480px] w-full overflow-hidden">
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

      {/* ── Selling Points ── */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((r) => (
              <div
                key={r.title}
                className="rounded-lg border border-border bg-card p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange/10 text-orange">
                  <r.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-bold text-navy">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Explore by Category ── */}
      <section className="pb-20">
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
              link={{ href: "/explore", label: "Explore More" }}
            />
            <HorizontalScroll>
              {tag.activity?.map((a) => (
                <div key={a.slug} className="w-72 shrink-0 snap-start">
                  <TripCard activity={a} compact />
                </div>
              ))}
            </HorizontalScroll>
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

      {/* ── Travel Inspiration ── */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader
            title="Travel Inspiration"
            link={{ href: "/blog", label: "Visit Our Blog" }}
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {blogList.map((b) => (
              <article
                key={b.title}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="relative h-40">
                  <img
                    src={b.img}
                    alt={b.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-3 left-3 rounded bg-navy px-2.5 py-1 text-[10px] font-bold text-navy-foreground">
                    {b.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="leading-snug font-bold text-navy">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{b.date}</span>
                    <span>•</span>
                    <span>{b.read}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative rounded-lg bg-navy p-10 text-navy-foreground">
            <div className="mb-8 flex flex-wrap items-center gap-5">
              <h3 className="text-2xl font-bold">What Our Travelers Say</h3>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex text-orange">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-white/80">
                  4.9/5 from {testimonialList.length}+ Happy Travelers
                </span>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonialList.map((t) => (
                <div key={t.name} className="text-sm">
                  <p className="text-white/90 italic">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange/30 font-bold">
                      {t.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-white/60">{t.country}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Meet Our Team ── */}
      {teamMembers.length > 0 && (
        <section className="pb-20">
          <div className="mx-auto max-w-7xl px-4">
            <SectionHeader title="Meet Our Experts" align="center" />
            <HorizontalScroll>
              {teamMembers.map((m) => (
                <TeamCard key={m.id} member={m} />
              ))}
            </HorizontalScroll>
          </div>
        </section>
      )}

      {/* ── Final CTA ── */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-orange p-6 text-orange-foreground">
            <div className="flex items-center gap-4">
              <Headphones className="h-10 w-10" />
              <div>
                <div className="text-lg font-bold">
                  Ready to start your adventure in Nepal?
                </div>
                <div className="text-sm opacity-90">
                  Our travel experts are here to help you plan the perfect trip.
                </div>
              </div>
            </div>
            <Link
              href="/design-your-trip"
              className="flex items-center gap-2 rounded-full border border-white px-5 py-2.5 font-semibold hover:bg-white/10"
            >
              Talk To An Expert <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
