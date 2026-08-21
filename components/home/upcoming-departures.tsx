import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { DeparturesPage } from "@/components/departures-page"
import { SectionHeader } from "@/components/section-header"

export function UpcomingDepartures({
  activities,
  filterMeta,
  initialSlots,
  totalCount,
}: {
  activities: { id: string; slug: string; title: string }[]
  filterMeta: { years: string[]; activityIds: number[]; months: number[]; days: number[] }
  initialSlots: {
    id: number
    departureDate: string
    price: string
    remainingSeats: number
    visible: boolean
    days: number
    maxGroupSize: number
    activity: { id: number; title: string; slug: string }
  }[]
  totalCount: number
}) {
  if (totalCount === 0) return null
  return (
    <section className="bg-muted py-16">
      <div className="mx-auto max-w-7xl px-4">
        <SectionHeader
          title="Upcoming Departures"
          description="Join a scheduled group departure for your next adventure"
          link={{ href: "/departure", label: "View All" }}
        />
        <div className="mt-10">
          <DeparturesPage
            activities={activities}
            filterMeta={filterMeta}
            initialSlots={initialSlots}
            totalCount={totalCount}
          />
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/departure"
            className="inline-flex items-center gap-1 rounded-full border border-orange px-6 py-3 text-sm font-semibold text-orange hover:bg-orange hover:text-orange-foreground transition-colors"
          >
            View All Departures <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
