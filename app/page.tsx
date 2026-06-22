import {
  Mountain, Search, MapPin, Compass, Bird, Clock, TrendingUp, Home,
  ArrowRight, Users, ClipboardList, Heart, PhoneCall, Star,
  ChevronLeft, ChevronRight, Headphones,
} from "lucide-react"

const categories = [
  { img: "/images/cat-trekking.jpg", title: "Trekking", sub: "50+ Routes", cta: "Explore Treks" },
  { img: "/images/cat-cultural.jpg", title: "Cultural Tours", sub: "20+ Experiences", cta: "Explore Tours" },
  { img: "/images/cat-adventure.jpg", title: "Adventure Activities", sub: "15+ Activities", cta: "Explore Adventures" },
  { img: "/images/cat-wildlife.jpg", title: "Wildlife Safaris", sub: "8+ Destinations", cta: "Explore Wildlife" },
]

const treks = [
  { img: "/images/trek-everest.jpg", badge: "BEST SELLER", title: "Everest Base Camp Trek", days: "14 Days", level: "Moderate", stay: "Tea House", price: "$1,250", slug: "everest-base-camp-trek" },
  { img: "/images/trek-annapurna.jpg", badge: "POPULAR", title: "Annapurna Circuit Trek", days: "15 Days", level: "Moderate", stay: "Tea House", price: "$1,180", slug: "annapurna-circuit-trek" },
  { img: "/images/trek-abc.jpg", title: "Annapurna Base Camp Trek", days: "10 Days", level: "Moderate", stay: "Tea House", price: "$890", slug: "annapurna-base-camp-trek" },
  { img: "/images/trek-langtang.jpg", title: "Langtang Valley Trek", days: "8 Days", level: "Easy", stay: "Tea House", price: "$620", slug: "langtang-valley-trek" },
]

const reasons = [
  { icon: Users, title: "Local Experts", text: "Real Nepal based team with in-depth knowledge." },
  { icon: ClipboardList, title: "Flexible Itineraries", text: "Customize your trip to match your time and budget." },
  { icon: Heart, title: "Responsible Tourism", text: "We support local communities and sustainable travel." },
  { icon: PhoneCall, title: "24/7 Support", text: "We're with you before, during and after your trip." },
]

const blogs = [
  { img: "/placholder-image.png", tag: "TREKKING GUIDE", title: "Best Treks in Nepal", desc: "Discover the most beautiful treks in Nepal for every level of adventurer.", date: "May 12, 2024", read: "5 min read" },
  { img: "/placholder-image.png", tag: "TRAVEL TIPS", title: "When is the Best Time to Trek in Nepal?", desc: "A complete guide to seasons, weather and trekking conditions.", date: "May 10, 2024", read: "4 min read" },
  { img: "/placholder-image.png", tag: "TRAVEL GUIDE", title: "Everest Base Camp Trek Cost Breakdown", desc: "Detailed cost breakdown to help you plan your EBC trek budget.", date: "May 8, 2024", read: "6 min read" },
  { img: "/placholder-image.png", tag: "NEPAL GUIDE", title: "Nepal Visa Guide for Travelers", desc: "Everything you need to know about Nepal visa requirements.", date: "May 5, 2024", read: "3 min read" },
]

const testimonials = [
  { name: "Emma Thompson", country: "Australia", text: "The Everest Base Camp trek was the experience of a lifetime. Amazing guides, perfect planning!" },
  { name: "Liam Anderson", country: "United Kingdom", text: "Highly professional team with great local knowledge. Annapurna Circuit was stunning!" },
  { name: "Sophie Martin", country: "Canada", text: "From booking to the last day of our trip, everything was flawless. Highly recommend Walk Through Nepal!" },
]
export default function HomePage() {
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
              <h1 className="text-6xl font-bold leading-[1.05] md:text-7xl">Explore Nepal</h1>
              <h2 className="mt-1 text-5xl font-bold leading-[1.05] text-orange md:text-6xl">Beyond The Guidebook</h2>
              <p className="mt-6 max-w-xl text-lg text-white/85">
                Discover authentic treks, cultural journeys, wildlife adventures and local experiences across the Himalayas.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="rounded-md bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90">
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
              <div className="text-sm font-semibold text-navy">Where do you want to go?</div>
              <div className="text-xs text-muted-foreground">Find your perfect adventure in Nepal</div>
            </div>
            {[
              { icon: Mountain, label: "Trek" },
              { icon: MapPin, label: "Tour" },
              { icon: TrendingUp, label: "Peak Climbing" },
              { icon: Compass, label: "Adventure" },
              { icon: Bird, label: "Wildlife" },
            ].map((c) => (
              <button key={c.label} className="flex flex-col items-center gap-1 px-5 py-2 text-navy transition hover:text-orange">
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
              <div key={c.title} className="group relative h-64 cursor-pointer overflow-hidden rounded-lg">
                <img src={c.img} alt={c.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
            <a href="#" className="flex items-center gap-1 text-sm font-medium text-orange">View All Treks <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {treks.map((t) => (
              <div key={t.title} className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition hover:shadow-md">
                <div className="relative h-44">
                  <img src={t.img} alt={t.title} loading="lazy" className="h-full w-full object-cover" />
                  {t.badge && (
                    <span className="absolute left-3 top-3 rounded bg-orange px-2.5 py-1 text-[10px] font-bold text-orange-foreground">
                      {t.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-navy">{t.title}</h3>
                  <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {t.days}</span>
                    <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {t.level}</span>
                    <span className="flex items-center gap-1"><Home className="h-3 w-3" /> {t.stay}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <div>
                      <div className="text-[10px] text-muted-foreground">From</div>
                      <div className="text-lg font-bold text-navy">{t.price}</div>
                    </div>
                    <a href={`/package/${t.slug}`} className="flex items-center gap-1 text-sm font-medium text-orange">View Details <ArrowRight className="h-3.5 w-3.5" /></a>
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
            <h3 className="mb-6 text-2xl font-bold text-navy">Nepal At A Glance</h3>
            <img src="/images/nepal-map.png" alt="Map of Nepal" loading="lazy" className="w-full" />
            <button className="mt-6 flex items-center gap-2 rounded-md border border-navy px-4 py-2 text-sm font-medium text-navy transition hover:bg-navy hover:text-navy-foreground">
              Explore All Regions <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <div className="rounded-lg bg-navy p-8 text-navy-foreground">
            <h3 className="text-2xl font-bold">Why Travel With</h3>
            <div className="mb-6 text-2xl font-bold text-orange">Walk Through Nepal?</div>
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
              <h2 className="text-3xl font-bold text-navy">Travel Inspiration</h2>
              <span className="mt-2 block h-1 w-16 rounded-full bg-orange" />
            </div>
            <a href="#" className="flex items-center gap-1 text-sm font-medium text-orange">Visit Our Blog <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {blogs.map((b) => (
              <article key={b.title} className="overflow-hidden rounded-lg border border-border bg-card">
                <div className="relative h-40">
                  <img src={b.img} alt={b.title} loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded bg-navy px-2.5 py-1 text-[10px] font-bold text-navy-foreground">{b.tag}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold leading-snug text-navy">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{b.date}</span><span>•</span><span>{b.read}</span>
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
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="text-white/80">4.9/5 from 2,000+ Happy Travelers</span>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.name} className="text-sm">
                  <p className="italic text-white/90">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange/30 font-bold">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-semibold">{t.name}</div>
                      <div className="text-xs text-white/60">{t.country}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><ChevronLeft className="h-4 w-4" /></button>
            <button className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"><ChevronRight className="h-4 w-4" /></button>
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
                <div className="text-lg font-bold">Ready to start your adventure in Nepal?</div>
                <div className="text-sm opacity-90">Our travel experts are here to help you plan the perfect trip.</div>
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
