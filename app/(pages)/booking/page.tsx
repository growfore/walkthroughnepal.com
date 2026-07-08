import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"
import { DeparturesPage } from "@/components/departures-page"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Departures",
  description: "Browse upcoming trek and tour departure dates. Pick your destination, choose a date, and book your Nepal adventure.",
  alternates: { canonical: "/booking" },
  openGraph: {
    title: "Departures | Walk Through Nepal",
    description: "Browse upcoming trek and tour departure dates for your Nepal adventure.",
    url: "https://walkthroughnepal.com/booking",
  },
}

type SlotRaw = {
  id: number; departureDate: string; price: string; remainingSeats: number; visible: boolean
  days: number; maxGroupSize: number
  activity: { id: number; title: string; slug: string }
}

type ActivityMeta = { id: string; slug: string; title: string }

export default async function BookingPage() {
  let activities: ActivityMeta[] = []
  let filterMeta = { years: [] as string[], activityIds: [] as number[], months: [] as number[], days: [] as number[] }
  let initialSlots: SlotRaw[] = []
  let totalCount = 0

  try {
    const [actRes, slotRes] = await Promise.all([
      fetch(`${API}/api/v1/activity?page=1&limit=100`, { next: { revalidate: 3600 } }),
      fetch(`${API}/api/v1/slot?limit=500`, { next: { revalidate: 3600 } }),
    ])
    const [actJson, slotJson] = await Promise.all([actRes.json(), slotRes.json()])

    activities = (actJson.data ?? []).map((a: { id: number; slug: string; title: string }) => ({
      id: String(a.id), slug: a.slug, title: a.title,
    })).sort((a: ActivityMeta, b: ActivityMeta) => a.title.localeCompare(b.title))

    const allSlots: SlotRaw[] = (slotJson.data?.slots ?? []).filter((s: SlotRaw) => s.visible)
    const years = [...new Set(allSlots.map(s => new Date(s.departureDate).getFullYear().toString()))].sort()
    const activityIds = [...new Set(allSlots.map(s => s.activity.id))]
    const months = [...new Set(allSlots.map(s => new Date(s.departureDate).getMonth()))].sort((a: number, b: number) => a - b)
    const days = [...new Set(allSlots.map(s => s.days))].sort((a: number, b: number) => a - b)

    filterMeta = { years, activityIds, months, days }
    initialSlots = allSlots.slice(0, 12)
    totalCount = allSlots.length
  } catch { /* empty state */ }

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="Departures"
        description="Browse upcoming trek and tour departure dates. Pick your destination and book your adventure."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Departures" }]}
      />
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <DeparturesPage
            activities={activities}
            filterMeta={filterMeta}
            initialSlots={initialSlots}
            totalCount={totalCount}
          />
        </div>
      </section>
    </main>
  )
}
