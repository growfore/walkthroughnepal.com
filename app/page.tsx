import {
  Mountain,
  Search,
  MapPin,
  Compass,
  Bird,
  Clock,
  TrendingUp,
  Users,
  ArrowRight,
  ClipboardList,
  Heart,
  PhoneCall,
  Star,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Home,
} from "lucide-react"
import Link from "next/link"
import type { Activity } from "@/lib/types"
import {
  getFeaturedTags,
  getActivities,
  getTestimonials,
  getTripCategories,
  getPublishedPosts,
  img,
} from "@/lib/api"

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim()
}

export default async function HomePage() {
  const [
    {
      data: { tripCategories },
    },
    testimonials,
    { blogs },
  ] = await Promise.all([
    getTripCategories(),
    getTestimonials(),
    getPublishedPosts(1, 4),
  ])

  let activities: Activity[] = []
  try {
    const { data: { featuredTags } } = await getFeaturedTags()
    activities = featuredTags.find((t) => t.slug === "popular-treks")?.activity ?? []
  } catch {
    const { data } = await getActivities({ limit: "4" })
    activities = data
  }

  const categories = tripCategories.slice(0, 4).map((c) => ({
    img: c.categoryImage ?? "/images/cat-trekking.jpg",
    title: c.categoryName,
    sub: c.categoryHandle.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    cta: "Explore",
  }))

  const treks = activities.map((a) => ({
    img: a.images[0] ?? "/images/trek-everest.jpg",
    badge: a.duration,
    title: a.title,
    days: a.duration,
    level:
      a.difficultyLevel
        ?.replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()) ?? "Moderate",
    stay: "Tea House",
    price: `$${a.price}`,
    slug: a.slug,
  }))

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

  const blogList = blogs.map((b) => ({
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

  const testimonialList = testimonials.map((t) => ({
    name: t.author,
    country: "Nepal",
    text: t.content,
  }))

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section className="relative">
        <div className="relative h-[640px] w-full overflow-hidden">
          <img
            src="/images/hero-trekker.jpg"
            alt="Trekker in Himalayas"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
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
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-md bg-orange px-6 py-3 font-semibold text-orange-foreground hover:opacity-90">
                  Find Your Adventure
                </button>
                <button className="flex items-center gap-2 rounded-md border border-white/70 px-6 py-3 font-semibold text-white hover:bg-white/10">
                  Talk To An Expert <Headphones className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick search bar */}
        <div className="relative z-10 mx-auto -mt-12 max-w-7xl px-4">
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card p-4 shadow-xl">
            <div className="min-w-[220px] flex-1 px-4 py-2">
              <div className="text-sm font-semibold text-navy">
                Where do you want to go?
              </div>
              <div className="text-xs text-muted-foreground">
                Find your perfect adventure in Nepal
              </div>
            </div>
            {[
              { icon: Mountain, label: "Trek" },
              { icon: MapPin, label: "Tour" },
              { icon: TrendingUp, label: "Peak Climbing" },
              { icon: Compass, label: "Adventure" },
              { icon: Bird, label: "Wildlife" },
            ].map((c) => (
              <button
                key={c.label}
                className="flex flex-col items-center gap-1 px-5 py-2 text-navy transition hover:text-orange"
              >
                <c.icon className="h-5 w-5" />
                <span className="text-xs font-medium">{c.label}</span>
              </button>
            ))}
            <button className="flex items-center gap-2 rounded-md bg-navy px-6 py-3 font-semibold text-navy-foreground hover:opacity-90">
              <Search className="h-4 w-4" /> Search
            </button>
          </div>
        </div>
      </section>

      {/* Explore by Category */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-10 text-center">
            <h2 className="relative inline-block text-3xl font-bold text-navy">
              Explore by Category
              <span className="mx-auto mt-2 block h-1 w-16 rounded-full bg-orange" />
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <div
                key={c.title}
                className="group relative h-64 cursor-pointer overflow-hidden rounded-lg"
              >
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                  <h3 className="text-xl font-bold">{c.title}</h3>
                  <div className="text-sm text-white/80">{c.sub}</div>
                  <div className="mt-2 flex items-center gap-1 text-sm font-medium text-orange">
                    {c.cta} <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Treks */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-3xl font-bold text-navy">Popular Treks</h2>
            <a
              href="#"
              className="flex items-center gap-1 text-sm font-medium text-orange"
            >
              View All Treks <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {treks.map((t) => (
              <div
                key={t.title}
                className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-44">
                  <img
                    src={t.img}
                    alt={t.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-3 left-3 rounded bg-orange px-2.5 py-1 text-[10px] font-bold text-orange-foreground">
                    {t.badge}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-navy">
                    {t.title.substring(0, 50) + "..."}
                  </h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {t.days}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> {t.level}
                    </span>
                    <span className="flex items-center gap-1">
                      <Home className="h-3 w-3" /> {t.stay}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <div>
                      <div className="text-[10px] text-muted-foreground">
                        From
                      </div>
                      <div className="text-lg font-bold text-navy">
                        {t.price}
                      </div>
                    </div>
                    <a
                      href={`/package/${t.slug}`}
                      className="flex items-center gap-1 text-sm font-medium text-orange"
                    >
                      View Details <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nepal at a Glance + Why */}
      <section className="pb-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-lg border border-border bg-[#fcfaf3] p-8">
            <h3 className="mb-6 text-2xl font-bold text-navy">
              Nepal At A Glance
            </h3>
            <img
              src="/images/nepal-map.png"
              alt="Map of Nepal"
              loading="lazy"
              className="w-full"
            />
            <button className="mt-6 flex items-center gap-2 rounded-md border border-navy px-4 py-2 text-sm font-medium text-navy transition hover:bg-navy hover:text-navy-foreground">
              Explore All Regions <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="rounded-lg bg-navy p-8 text-navy-foreground">
            <h3 className="text-2xl font-bold">Why Travel With</h3>
            <div className="mb-6 text-2xl font-bold text-orange">
              Walk Through Nepal?
            </div>
            <div className="space-y-5">
              {reasons.map((r) => (
                <div key={r.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-orange/60 text-orange">
                    <r.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold">{r.title}</div>
                    <div className="text-sm text-white/70">{r.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Travel Inspiration */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold text-navy">
                Travel Inspiration
              </h2>
              <span className="mt-2 block h-1 w-16 rounded-full bg-orange" />
            </div>
            <Link
              href="/blog"
              className="flex items-center gap-1 text-sm font-medium text-orange"
            >
              Visit Our Blog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
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

      {/* Testimonials */}
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

      {/* CTA */}
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
            <button className="flex items-center gap-2 rounded-md border border-white px-5 py-2.5 font-semibold hover:bg-white/10">
              Talk To An Expert <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
