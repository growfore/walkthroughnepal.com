import type { TeamMember } from "@/lib/types"
import { getTeamMembers, img } from "@/lib/api"
import { PageHero } from "@/components/page-hero"
import { HorizontalScroll } from "@/components/horizontal-scroll"
import { TeamCard } from "@/components/team-card"
import { SectionHeader } from "@/components/section-header"
import { Users, MapPin, Shield, HeartHandshake } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AboutPage() {
  let teamMembers: TeamMember[] = []

  try {
    const res = await getTeamMembers()
    const grouped = res.data
    if (grouped && typeof grouped === "object") {
      teamMembers = (Object.values(grouped) as any[]).flat().map((m: any) => ({ ...m, department: null }))
    }
  } catch {}

  const stats = [
    { icon: Users, value: "20+", label: "Years Experience" },
    { icon: MapPin, value: "50+", label: "Nepal Destinations" },
    { icon: Shield, value: "5,000+", label: "Happy Travelers" },
    { icon: HeartHandshake, value: "100%", label: "Local Team" },
  ]

  return (
    <div className="min-h-screen bg-background">
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

      {/* Team */}
      {teamMembers.length > 0 && (
        <section className="py-20">
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

      {/* CTA */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="rounded-xl bg-gradient-to-r from-navy to-navy/90 p-8 text-center text-navy-foreground md:p-12">
            <h2 className="text-2xl font-bold md:text-3xl">Ready to Explore Nepal?</h2>
            <p className="mt-3 text-white/80 max-w-lg mx-auto">
              Let our experts craft the perfect itinerary for your Himalayan adventure.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a
                href="/explore"
                className="rounded-full bg-orange px-6 py-3 font-semibold text-orange-foreground hover:opacity-90 transition"
              >
                Browse Trips
              </a>
              <a
                href="/design-your-trip"
                className="rounded-full border border-white/50 px-6 py-3 font-semibold text-white hover:bg-white/10 transition"
              >
                Plan Your Trip
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
