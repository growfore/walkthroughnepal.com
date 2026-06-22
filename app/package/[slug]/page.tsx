import {
  Mountain, MapPin, Clock, ChevronRight, Star, Calendar, TrendingUp, Users, Home as HomeIcon,
  Download, Check, X, ArrowRight, ChevronLeft, Mail, Phone,
} from "lucide-react"
import Link from "next/link"

const tabs = ["Overview", "Itinerary", "Includes", "Excludes", "What to Bring", "Useful Info", "Reviews", "Dates & Prices"]

const highlights = [
  { icon: Mountain, text: "Scenic mountain flights" },
  { icon: Users, text: "Sherpa culture & villages" },
  { icon: TrendingUp, text: "Sagarmatha National Park" },
  { icon: HomeIcon, text: "Tea house accommodation" },
]

const itinerary = [
  { day: "01", title: "Arrival in Kathmandu (1,400m)", desc: "Meet our representative and transfer to hotel. Evening briefing.", stay: "Hotel" },
  { day: "02", title: "Fly to Lukla (2,860m) & Trek to Phakding (2,610m)", desc: "Scenic flight to Lukla and easy trek to Phakding village.", stay: "Tea House" },
  { day: "03", title: "Trek to Namche Bazaar (3,440m)", desc: "Walk through pine forests and cross suspension bridges.", stay: "Tea House" },
  { day: "04", title: "Acclimatization in Namche Bazaar", desc: "Rest day for acclimatization and short hike to Everest View Hotel.", stay: "Tea House" },
  { day: "05", title: "Trek to Tengboche (3,860m)", desc: "Visit Tengboche Monastery and enjoy mountain views.", stay: "Tea House" },
  { day: "06", title: "Trek to Dingboche (4,410m)", desc: "Scenic trek with views of Ama Dablam.", stay: "Tea House" },
]

const included = [
  "Airport pick up & drop off",
  "Kathmandu – Lukla – Kathmandu flights",
  "All necessary trekking permits",
  "Accommodation in tea houses",
  "Meals (BLD) during the trek",
  "Experienced English speaking guide",
  "Porter (1 porter for 2 trekkers)",
  "First aid kit & medical supplies",
]

const excluded = [
  "Nepal Visa fee",
  "Travel insurance",
  "Lunch & Dinner in Kathmandu",
  "Hot shower, Wi-Fi & battery charging",
  "Tips for guide & porter",
  "Personal expenses",
]

const dates = [
  { range: "Mar 20 - Apr 02, 2025", days: "14 Days", price: "$1,250" },
  { range: "Apr 10 - Apr 23, 2025", days: "14 Days", price: "$1,250" },
  { range: "Sep 15 - Sep 28, 2025", days: "14 Days", price: "$1,250" },
]

const packages: Record<string, { title: string; subtitle: string; hero: string; price: string; days: string; altitude: string; difficulty: string; season: string }> = {
  "everest-base-camp-trek": {
    title: "Everest Base Camp Trek",
    subtitle: "Everest Region, Nepal",
    hero: "/images/trek-everest.jpg",
    price: "$1,250",
    days: "14 Days",
    altitude: "5,364m",
    difficulty: "Moderate",
    season: "Mar - May, Sep - Nov",
  },
}

const thumbnails = [
  "/images/trek-everest.jpg",
  "/images/trek-annapurna.jpg",
  "/images/trek-abc.jpg",
  "/images/trek-langtang.jpg",
]

export default async function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const pkg = packages[slug]

  if (!pkg) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-navy">Package not found</h1>
          <Link href="/" className="mt-4 inline-block text-orange">Go back home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative">
        <div className="relative h-[520px] w-full overflow-hidden">
          <img src={pkg.hero} alt={pkg.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/10" />

          <div className="relative mx-auto flex items-center gap-2 px-4 pt-6 text-sm text-white/80">
            <Link href="/" className="hover:text-orange">Home</Link><ChevronRight className="h-3.5 w-3.5" />
            <a href="#" className="hover:text-orange">Treks</a><ChevronRight className="h-3.5 w-3.5" />
            <a href="#" className="hover:text-orange">Everest Region</a><ChevronRight className="h-3.5 w-3.5" />
            <span className="text-white">{pkg.title}</span>
          </div>

          <div className="relative mx-auto mt-8 px-4 text-white">
            <span className="inline-block rounded bg-orange px-3 py-1 text-[11px] font-bold tracking-wider text-orange-foreground">BEST SELLER</span>
            <h1 className="mt-4 text-5xl font-bold leading-tight md:text-6xl">{pkg.title}</h1>
            <div className="mt-3 flex items-center gap-2 text-white/90">
              <MapPin className="h-4 w-4 text-orange" /> {pkg.subtitle}
            </div>
            <div className="mt-3 flex items-center gap-2">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-orange text-orange" />)}
              <span className="text-sm font-semibold">4.9</span>
              <span className="text-sm text-white/80">(250+ Reviews)</span>
            </div>

            <div className="mt-7 flex flex-wrap gap-8 text-white/95">
              {[
                { icon: Clock, top: pkg.days, bot: "" },
                { icon: TrendingUp, top: pkg.altitude, bot: "Max Altitude" },
                { icon: Mountain, top: pkg.difficulty, bot: "Difficulty" },
                { icon: Calendar, top: pkg.season, bot: "Best Season" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <s.icon className="h-6 w-6" />
                  <div className="text-sm leading-tight">
                    <div className="font-semibold">{s.top}</div>
                    {s.bot && <div className="text-xs text-white/70">{s.bot}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="bg-navy/95">
          <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-3">
            {thumbnails.map((src, i) => (
              <img key={i} src={src} alt="Trek photo" className="h-20 w-32 flex-shrink-0 rounded object-cover" />
            ))}
            <div className="flex h-20 w-32 flex-shrink-0 flex-col items-center justify-center rounded bg-white/10 text-sm text-white">
              <span className="font-semibold">+15</span>
              <span className="text-xs text-white/70">View all photos</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex flex-wrap gap-6 border-b border-border text-sm font-medium text-muted-foreground">
              {tabs.map((t, i) => (
                <a key={t} href={`#${t.toLowerCase()}`} className={`pb-3 ${i === 0 ? "border-b-2 border-orange text-orange" : "hover:text-navy"}`}>{t}</a>
              ))}
            </div>

            {/* Overview */}
            <div id="overview" className="mt-8">
              <h2 className="text-2xl font-bold text-navy">Overview</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Experience the adventure of a lifetime to the foot of the world&#39;s highest peak. Walk through Sherpa villages,
                suspension bridges and breathtaking landscapes on this iconic 14-day Everest Base Camp Trek.
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <ul className="space-y-3">
                  {highlights.map((h) => (
                    <li key={h.text} className="flex items-center gap-3 text-sm text-navy">
                      <h.icon className="h-5 w-5 text-orange" /> {h.text}
                    </li>
                  ))}
                  <div className="mt-2 rounded-lg border border-orange/30 bg-orange/10 p-4">
                    <div className="mb-2 font-semibold text-orange">Trip Highlight</div>
                    <ul className="space-y-1.5 pl-5 text-sm text-navy list-disc">
                      <li>Stand at the foot of Mount Everest (5,364m)</li>
                      <li>Visit the famous Tengboche Monastery</li>
                      <li>Experience Sherpa culture and hospitality</li>
                      <li>Breathtaking views of Everest, Lhotse, Nuptse & Ama Dablam</li>
                    </ul>
                  </div>
                </ul>

                <div className="overflow-hidden rounded-lg border border-border bg-card">
                  <img src="/images/nepal-map.jpg" alt="Route map" className="h-72 w-full object-cover" />
                  <div className="px-3 py-2 text-right text-xs font-medium text-orange">View Full Map →</div>
                </div>
              </div>
            </div>

            {/* Short Itinerary */}
            <div id="itinerary" className="mt-12">
              <h2 className="text-2xl font-bold text-navy">Short Itinerary</h2>
              <div className="mt-5 space-y-3">
                {itinerary.map((d) => (
                  <div key={d.day} className="flex items-start gap-4 rounded-lg border border-border p-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-navy/15 text-navy">
                      <div className="text-center leading-tight">
                        <div className="text-[9px] font-semibold text-muted-foreground">Day</div>
                        <div className="text-sm font-bold">{d.day}</div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-navy">{d.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{d.desc}</div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <div>Overnight</div>
                      <div className="flex items-center gap-1 font-medium text-navy"><HomeIcon className="h-3 w-3" /> {d.stay}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <button className="rounded-md border border-orange px-6 py-2.5 font-semibold text-orange transition hover:bg-orange hover:text-orange-foreground">
                  View Full Itinerary
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="text-sm text-muted-foreground">From</div>
              <div className="text-4xl font-bold text-navy">{pkg.price}</div>
              <div className="text-sm text-muted-foreground">per person</div>

              <button className="mt-5 w-full rounded-md bg-orange py-3 font-semibold text-orange-foreground hover:opacity-90">
                Check Availability
              </button>
              <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border py-3 font-semibold text-navy hover:bg-secondary">
                <Download className="h-4 w-4" /> Download Itinerary
              </button>

              <ul className="mt-6 space-y-3 text-sm">
                {[
                  ["Trip Duration", pkg.days],
                  ["Max Altitude", `${pkg.altitude} (Everest Base Camp)`],
                  ["Trip Difficulty", pkg.difficulty],
                  ["Best Season", pkg.season],
                  ["Accommodation", "Tea House"],
                  ["Meals", "Breakfast, Lunch, Dinner"],
                  ["Group Size", "1 - 12 Pax"],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0">
                    <span className="flex items-center gap-2 text-muted-foreground"><Clock className="h-4 w-4 text-orange" /> {k}</span>
                    <span className="text-right font-medium text-navy">{v}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-bold text-navy">What&#39;s Included</h3>
              <ul className="space-y-2.5 text-sm">
                {included.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-navy">
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" /> {i}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-bold text-navy">What&#39;s Excluded</h3>
              <ul className="space-y-2.5 text-sm">
                {excluded.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-navy">
                    <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" /> {i}
                  </li>
                ))}
              </ul>
            </div>

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
                <img src="/cover.jpg" alt="Travel expert" className="h-24 w-20 rounded-md object-cover" />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Reviews + Dates */}
      <section className="pb-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-navy">Traveler Reviews</h3>
              <a href="#" className="flex items-center gap-1 text-sm font-medium text-orange">View All Reviews <ArrowRight className="h-3.5 w-3.5" /></a>
            </div>
            <div className="mt-5 grid gap-6 md:grid-cols-[auto_1fr]">
              <div className="text-center">
                <div className="text-5xl font-bold text-navy">4.9</div>
                <div className="mt-1 flex justify-center gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-orange text-orange" />)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">250+ Reviews</div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange/20 font-bold text-orange">E</div>
                  <div>
                    <div className="text-sm font-semibold text-navy">Emma Thompson</div>
                    <div className="text-xs text-muted-foreground">Australia</div>
                  </div>
                </div>
                <div className="mt-2 flex gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-orange text-orange" />)}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  &ldquo;The Everest Base Camp trek was the experience of a lifetime. Amazing guides, perfect planning and unforgettable views!&rdquo;
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-1">
                <span className="h-1.5 w-4 rounded-full bg-orange" />
                <span className="h-1.5 w-1.5 rounded-full bg-border" />
                <span className="h-1.5 w-1.5 rounded-full bg-border" />
                <span className="h-1.5 w-1.5 rounded-full bg-border" />
              </div>
              <div className="flex gap-2">
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border"><ChevronLeft className="h-4 w-4" /></button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-border"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-lg font-bold text-navy">Upcoming Dates &amp; Prices</h3>
            <div className="mt-5 space-y-3">
              {dates.map((d) => (
                <div key={d.range} className="grid items-center gap-4 border-b border-border py-3 last:border-0 md:grid-cols-[1fr_auto_auto_auto]">
                  <div className="text-sm font-medium text-navy">{d.range}</div>
                  <div className="text-xs text-muted-foreground">{d.days}</div>
                  <div className="text-sm font-bold text-navy">{d.price}</div>
                  <button className="rounded border border-orange px-3 py-1.5 text-xs font-semibold text-orange transition hover:bg-orange hover:text-orange-foreground">Book Now</button>
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm font-medium text-orange">Custom Date? Private Trip Available →</div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="relative overflow-hidden rounded-lg bg-navy p-8 text-navy-foreground">
            <img src={pkg.hero} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
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
