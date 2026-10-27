import type { Metadata } from "next"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, ChevronRight, Users, FileCheck, Route, HeartHandshake, Map as MapIcon, MessageCircle } from "lucide-react"
import { PageHero } from "@/components/page-hero"
import { BreadcrumbJsonLd } from "@/components/json-ld"
import { getAllActivitySlugs } from "@/lib/api"
import { siteConfig } from "@/lib/siteConfig"
import { affiliations, companyRegistration } from "@/lib/affiliations"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Walk Through Nepal is a Pokhara-based trekking company founded by locals Sudip and Sabina. Safe, permit-compliant, flexible treks across Everest, Annapurna, Langtang, Manaslu, Mustang and beyond.",
  keywords: [
    "Walk Through Nepal",
    "Pokhara trekking company",
    "Nepal trekking company",
    "about Walk Through Nepal",
    "local Nepal guides",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | Walk Through Nepal",
    description:
      "Your trusted trekking partner in the Himalayas. A small, Pokhara-based team of local guides building treks around your pace.",
    url: "https://walkthroughnepal.com/about",
  },
}

export const dynamic = "force-dynamic"

const values = [
  {
    title: "Safety First",
    desc: "Every itinerary factors in proper acclimatization, and our guides are trained in first aid and altitude sickness response.",
  },
  {
    title: "Transparency",
    desc: "Accurate permit fees (TIMS, ACAP, RAP), realistic itinerary timelines, and no hidden costs.",
  },
  {
    title: "Local Impact",
    desc: "Fair wages for guides and porters, and partnerships with family-run teahouses along the trail.",
  },
  {
    title: "Sustainability",
    desc: "Leave No Trace practices and reduced single-use plastic on every trek.",
  },
  {
    title: "Flexibility",
    desc: "Multiple itinerary lengths for our most popular treks, so you can choose what fits your schedule.",
  },
]

// slug: expected /trip/{slug}; linked only once that package is published
const regions: Array<{ name: string; treks: Array<{ name: string; slug: string }> }> = [
  {
    name: "Everest Region",
    treks: [
      { name: "Everest Base Camp Trek", slug: "everest-base-camp-trek" },
      { name: "Gokyo Lake Trek", slug: "gokyo-lake-trek" },
      { name: "Everest Three Passes Trek", slug: "everest-three-passes-trek" },
      { name: "Everest Panorama Trek", slug: "everest-panorama-trek" },
      { name: "Everest Base Camp Heli Trek", slug: "everest-base-camp-heli-trek" },
    ],
  },
  {
    name: "Annapurna Region",
    treks: [
      { name: "Annapurna Circuit Trek (12/14/16 Days)", slug: "annapurna-circuit-trek" },
      { name: "Annapurna Base Camp Trek", slug: "annapurna-base-camp-trek" },
      { name: "Tilicho Lake Trek", slug: "tilicho-lake-trek" },
      { name: "Ghorepani Poon Hill Trek", slug: "ghorepani-poon-hill-trek" },
      { name: "Mardi Himal Trek", slug: "mardi-himal-trek" },
      { name: "Khopra Danda Trek", slug: "khopra-danda-trek" },
    ],
  },
  {
    name: "Langtang Region",
    treks: [
      { name: "Langtang Valley Trek", slug: "langtang-valley-trek" },
      { name: "Langtang Gosaikunda Trek", slug: "langtang-gosaikunda-trek" },
      { name: "Tamang Heritage Trail", slug: "tamang-heritage-trail" },
      { name: "Helambu Trek", slug: "helambu-trek" },
    ],
  },
  {
    name: "Manaslu Region",
    treks: [
      { name: "Manaslu Circuit Trek", slug: "manaslu-circuit-trek" },
      { name: "Tsum Valley Trek", slug: "tsum-valley-trek" },
    ],
  },
  {
    name: "Mustang Region",
    treks: [
      { name: "Upper Mustang Trek", slug: "upper-mustang-trek" },
      { name: "Muktinath Darshan Tour", slug: "muktinath-darshan-tour" },
      { name: "Upper Mustang Tiji Festival Tour", slug: "upper-mustang-tiji-festival-tour" },
    ],
  },
  {
    name: "Off-the-Beaten-Path & Remote Treks",
    treks: [
      { name: "Upper Dolpo Trek", slug: "upper-dolpo-trek" },
      { name: "Lower Dolpo Trek", slug: "lower-dolpo-trek" },
      { name: "Kanchenjunga Base Camp Trek", slug: "kanchenjunga-base-camp-trek" },
      { name: "Makalu Base Camp Trek", slug: "makalu-base-camp-trek" },
      { name: "Nar Phu Valley Trek", slug: "nar-phu-valley-trek" },
      { name: "Dhaulagiri Circuit Trek", slug: "dhaulagiri-circuit-trek" },
      { name: "Rolwaling Trek", slug: "rolwaling-trek" },
    ],
  },
  {
    name: "Cultural Tours & Sightseeing",
    treks: [
      { name: "Kathmandu Heritage Tour", slug: "kathmandu-heritage-tour" },
      { name: "Pokhara Valley Tour", slug: "pokhara-valley-tour" },
      { name: "Chitwan Jungle Safari", slug: "chitwan-jungle-safari" },
    ],
  },
  {
    name: "Luxury & Helicopter Trips",
    treks: [
      { name: "Everest Base Camp Helicopter Tour", slug: "everest-base-camp-helicopter-tour" },
      { name: "Annapurna Base Camp Helicopter Tour", slug: "annapurna-base-camp-helicopter-tour" },
      { name: "Muktinath Helicopter Tour", slug: "muktinath-helicopter-tour" },
    ],
  },
]

const reasons = [
  {
    icon: Users,
    title: "Experienced Regional Guides",
    desc: "Our guides bring 5+ years of field experience each, with specialists across the Everest, Annapurna, Langtang, Manaslu, Mustang, and off-the-beaten-path regions, not just one trail.",
  },
  {
    icon: FileCheck,
    title: "Accurate Permit Handling",
    desc: "We manage your TIMS, ACAP, and RAP paperwork correctly and keep our fee information current.",
  },
  {
    icon: Route,
    title: "Custom Itineraries",
    desc: "Extend, shorten, or combine routes across any region to match your timeline.",
  },
  {
    icon: HeartHandshake,
    title: "Fair Treatment of Staff",
    desc: "Our porters and guides are insured, fairly paid, and properly equipped.",
  },
  {
    icon: MapIcon,
    title: "All-Region Expertise",
    desc: "From classic base camp treks to remote, restricted-area routes like Dolpo and Kanchenjunga, our team has the local knowledge to guide you anywhere in Nepal.",
  },
  {
    icon: MessageCircle,
    title: "24/7 Support",
    desc: "A dedicated contact available throughout your trek via WhatsApp.",
  },
]

const sustainability = [
  "Supporting family-run teahouses and local guesthouses along every route",
  "Promoting reusable water bottles and filtration over single-use plastic",
  "Training and hiring local youth as guides and porters",
]

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange">{children}</p>
}

export default async function AboutPage() {
  const published = new Set(await getAllActivitySlugs())
  const whatsAppHref = `https://wa.me/${siteConfig.whatsAppNumber}?text=${encodeURIComponent(
    "Hi! I'd like to plan a trek with Walk Through Nepal.",
  )}`

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={[{ label: "About Us" }]} />
      <PageHero
        title="About Us"
        description="Your trusted trekking partner in the Himalayas."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      {/* Intro */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow>Who we are</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-navy md:text-4xl">
              Your Trusted Trekking Partner in the Himalayas
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-muted-foreground lg:col-span-7 lg:pt-9">
            Walk Through Nepal is a Pokhara-based trekking and travel company specializing in treks and adventures
            across every major region of Nepal, from Everest and Annapurna to Langtang, Manaslu, Mustang, and
            beyond. We design carefully planned, permit-compliant itineraries for trekkers of all experience levels,
            from first-timers tackling Poon Hill to seasoned adventurers crossing Thorong La or venturing into
            remote Dolpo. Whether you&apos;re a solo traveler, a couple, or a group, we make sure every step of
            your journey is safe, well-organized, and unforgettable.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="pb-20 md:pb-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
                <Image
                  src="/poonhill-morning-view.webp"
                  alt="Morning light over the Annapurna range from Poon Hill"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">The Annapurna range, the view Sudip and Sabina grew up with.</p>
            </div>
          </div>
          <div className="lg:col-span-7">
            <Eyebrow>Our story</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-navy md:text-4xl">Grown under the same mountains</h2>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
              <p>
                Sudip and Sabina didn&apos;t meet at a trade show or a hotel conference. They grew up under the
                same mountains: Sudip in a small village in the Annapurna region before moving to Pokhara as a
                boy, Sabina right there in Pokhara, a short walk from Phewa Lake, where the Annapurna range shows
                up perfectly in the water on a clear morning.
              </p>
              <p>
                For Sudip, growing up meant watching strangers arrive constantly, packs heavier than they needed,
                boots too new, eyes fixed on peaks he&apos;d looked at his whole life without giving them a second
                thought. It&apos;s a strange thing, watching people travel across the world for a view you grew up
                calling &ldquo;just outside.&rdquo; Somewhere in that, long before it had a name, the idea for
                Walk Through Nepal started taking shape.
              </p>
              <p>
                Sabina saw the same city from a different angle. She noticed the hospitality side up close, the
                guesthouses, the guides, the small decisions that turn a rushed itinerary into a trip someone
                actually remembers. She understood early that most travel companies get the logistics right and
                forget the people.
              </p>
              <p>
                When they finally built Walk Through Nepal together, they kept it small on purpose, a handful of
                experienced guides, chosen for patience as much as skill, because altitude doesn&apos;t care about
                anyone&apos;s schedule, and neither should a guide. A fixed itinerary looks efficient on paper. It
                rarely survives week one of an actual trek, once someone&apos;s knees are tired or someone else
                wants to slow down at a viewpoint everyone else has already photographed and moved past.
              </p>
              <p>That&apos;s really the whole philosophy.</p>
            </div>
            <blockquote className="my-10 border-l-4 border-orange pl-6 text-2xl font-semibold leading-snug text-navy md:text-3xl">
              Nepal doesn&apos;t need another agency selling the same eight-day package to everyone who lands in
              Kathmandu.
            </blockquote>
            <p className="text-lg leading-relaxed text-muted-foreground">
              It needs guides who actually live here, and a company small enough to still notice when a trip
              isn&apos;t working for the person walking it. Sudip and Sabina built Walk Through Nepal to be exactly
              that, nothing more, nothing less.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-navy py-20 text-navy-foreground md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2 md:gap-16">
          <div>
            <Eyebrow>Our mission</Eyebrow>
            <p className="mt-4 text-xl leading-relaxed text-white/90 md:text-2xl">
              To make Himalayan trekking safe, accessible, and personal. Every trekker deserves an itinerary built
              around their pace, not a generic template, backed by accurate permit guidance, experienced local
              guides, and honest, transparent planning from the first inquiry to the final descent.
            </p>
          </div>
          <div className="md:border-l md:border-white/15 md:pl-16">
            <Eyebrow>Our vision</Eyebrow>
            <p className="mt-4 text-xl leading-relaxed text-white/90 md:text-2xl">
              To be Nepal&apos;s most trusted name in flexible, traveler-first trekking, known as much for our
              attention to detail as for the mountains we walk through.
            </p>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow>What guides us</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-navy md:text-4xl">Our Core Values</h2>
          </div>
          <ol className="divide-y divide-border border-y border-border lg:col-span-8">
            {values.map((v, i) => (
              <li key={v.title} className="grid gap-2 py-6 sm:grid-cols-[4rem_12rem_1fr] sm:gap-6">
                <span className="text-sm font-semibold tabular-nums text-orange">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-bold text-navy">{v.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{v.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What We Offer */}
      <section className="bg-muted/40 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-2xl">
            <Eyebrow>Where we go</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-navy md:text-4xl">What We Offer</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              From the world&apos;s highest peaks to hidden valleys far off the tourist trail, we cover treks and
              adventures across every major region of Nepal.
            </p>
          </div>
          <dl className="mt-12 divide-y divide-border border-y border-border">
            {regions.map((r) => (
              <div key={r.name} className="grid gap-3 py-6 md:grid-cols-[18rem_1fr] md:gap-10">
                <dt className="font-bold text-navy">{r.name}</dt>
                <dd className="leading-relaxed">
                  {r.treks.map((t, i) => (
                    <span key={t.slug}>
                      {published.has(t.slug) ? (
                        <Link
                          href={`/trip/${t.slug}`}
                          className="font-medium text-navy underline decoration-orange/40 underline-offset-4 transition-colors hover:text-orange hover:decoration-orange"
                        >
                          {t.name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">{t.name}</span>
                      )}
                      {i < r.treks.length - 1 && <span className="mx-2 text-orange" aria-hidden="true">·</span>}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            We&apos;re actively expanding our published packages across these regions. If you don&apos;t see a
            specific route listed yet,{" "}
            <Link href="/design-your-trip" className="font-medium text-orange hover:underline">
              reach out
            </Link>{" "}
            and we&apos;ll help design a custom itinerary.
          </p>
        </div>
      </section>

      {/* Why Trek With Us */}
      <section className="relative isolate overflow-hidden py-20 text-white md:py-28">
        <Image src="/narphu-trek.webp" alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <div className="absolute inset-0 -z-10 bg-[rgba(15,43,61,.88)]" />
        <div className="mx-auto max-w-7xl px-4">
          <Eyebrow>Why us</Eyebrow>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">Why Trek With Us</h2>
          <div className="mt-14 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((r) => (
              <div key={r.title}>
                <r.icon className="h-7 w-7 text-orange" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-bold">{r.title}</h3>
                <p className="mt-2 leading-relaxed text-white/75">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability & Affiliations */}
      <section className="py-20 md:py-28">
        <div className="mx-auto grid max-w-7xl gap-16 px-4 lg:grid-cols-2">
          <div>
            <Eyebrow>Leave it better</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-navy md:text-4xl">Sustainability &amp; Community</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              We&apos;re committed to protecting the trails we trek and the communities who call them home. That
              means:
            </p>
            <ul className="mt-6 space-y-4">
              {sustainability.map((item) => (
                <li key={item} className="flex gap-3 text-muted-foreground">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-orange" aria-hidden="true" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>Licensed &amp; registered</Eyebrow>
            <h2 className="mt-4 text-3xl font-bold text-navy md:text-4xl">Certifications &amp; Affiliations</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Walk Through Nepal is a registered member of:
            </p>
            <ul className="mt-8 grid grid-cols-2 items-center gap-x-10 gap-y-8">
              {affiliations.map((a) => (
                <li key={a.short}>
                  <a href={a.url} target="_blank" rel="noopener noreferrer" title={a.name} className="block">
                    <img
                      src={a.logo}
                      width={a.width}
                      height={a.height}
                      alt={`${a.name} (${a.short})`}
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-auto max-w-full object-contain"
                    />
                  </a>
                </li>
              ))}
            </ul>
            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
              <div>
                <dt className="inline font-semibold text-navy">Company Registration No.: </dt>
                <dd className="inline">{companyRegistration.registrationNo}</dd>
              </div>
              <div>
                <dt className="inline font-semibold text-navy">PAN No.: </dt>
                <dd className="inline">{companyRegistration.panNo}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-2xl bg-gradient-to-r from-navy to-navy/90 p-8 text-center text-navy-foreground md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">Ready to Start Your Journey?</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/80">
              Whether you&apos;re dreaming of sunrise over Annapurna, a remote crossing in Dolpo, or the sacred
              trails of Upper Mustang, we&apos;re ready to help you plan it.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/design-your-trip"
                className="inline-flex items-center gap-1.5 rounded-full bg-orange px-6 py-3 font-semibold text-orange-foreground transition hover:opacity-90"
              >
                Plan Your Trek <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={whatsAppHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/50 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Contact Us on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
