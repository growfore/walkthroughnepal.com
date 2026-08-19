import type { Metadata } from "next"
import Link from "next/link"
import { PageHero } from "@/components/page-hero"
import { SectionHeader } from "@/components/section-header"
import { Users, MapPin, Shield, HeartHandshake, MapPinned, Mountain, LocationEditIcon } from "lucide-react"
import { BreadcrumbJsonLd, FAQPageJsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet the Nepal-based team behind Walk Through Nepal. Local trekking experts with over 20 years of experience crafting authentic Himalayan adventures.",
  keywords: ["Walk Through Nepal team", "Nepal trekking company", "about Walk Through Nepal", "local Nepal guides"],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us | Walk Through Nepal",
    description:
      "Meet the Nepal-based team behind Walk Through Nepal. Local trekking experts with over 20 years of experience.",
    url: "https://walkthroughnepal.com/about",
  },
}

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  const stats = [
    { icon: MapPinned, value: "Local Expertise", label: "Travel Nepal with people who know it from the inside."},
    { icon: Mountain, value: "15+ Destinations", label: "Discover Nepal’s iconic places and hidden gems." },
    { icon: LocationEditIcon, value: "Tailor Made Journeys", label: "Your interests. Your pace. Your Nepal." },
    { icon: HeartHandshake, value: "Personalized Support", label: "From your first inquiry to your final goodbye." },
  ]

  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbJsonLd items={[{ label: "About Us" }]} />
      <PageHero
        title="About Us"
        description="We are a Nepal-based team of trekking and travel enthusiasts dedicated to showing you the Himalayas beyond the guidebook."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
      />

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold text-navy">Our Story</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Walk Through Nepal was born from a simple belief — that the best way to experience Nepal is
                through the eyes of those who call it home. Founded by local trekking guides and travel
                experts, we have spent over two decades leading adventurers through the Himalayas.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                From the bustling streets of Kathmandu to the remote trails of Nar Phu Valley, every journey
                we craft is designed to immerse you in Nepal&apos;s rich culture, breathtaking landscapes, and
                warm hospitality.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                We believe in responsible travel, supporting local communities, and creating experiences
                that stay with you long after you&apos;ve returned home.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-6 text-center">
                  <s.icon className="mx-auto h-8 w-8 text-orange" />
                  <p className="mt-2 text-2xl font-bold text-navy">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeader title="Why Walk With Us" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Local Expertise",
                desc: "Our team lives and breathes Nepal. We know the trails, the culture, and the hidden gems that guidebooks miss.",
              },
              {
                title: "Responsible Travel",
                desc: "We partner with local communities, employ local guides, and ensure your visit supports the places you explore.",
              },
              {
                title: "Tailor-Made Trips",
                desc: "Every itinerary is built around you — your fitness, your interests, your dream trip. No cookie-cutter packages.",
              },
              {
                title: "Safety First",
                desc: "From high-altitude protocols to travel insurance requirements, your safety guides every decision we make.",
              },
              {
                title: "Unbeatable Value",
                desc: "Local prices without compromising quality. Transparent pricing with no hidden fees.",
              },
              {
                title: "24/7 Support",
                desc: "From your first inquiry to your return flight, our team is a phone call away, anytime.",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-xl border border-border bg-card p-6">
                <h3 className="font-bold text-navy">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-xl bg-gradient-to-r from-navy to-navy/90 p-8 text-center text-navy-foreground md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">Ready to Explore Nepal?</h2>
            <p className="mt-3 text-white/80 max-w-lg mx-auto">
              Let our experts craft the perfect itinerary for your Himalayan adventure.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/explore"
                className="rounded-full bg-orange px-6 py-3 font-semibold text-orange-foreground hover:opacity-90 transition"
              >
                Browse Trips
              </Link>
              <Link
                href="/design-your-trip"
                className="rounded-full border border-white/50 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
              >
                Plan Your Trip
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
