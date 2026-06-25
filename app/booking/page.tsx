import type { Metadata } from "next"
import { PageHero } from "@/components/page-hero"
import BookingForm from "@/components/booking-form"

const API = process.env.API_URL ?? "https://api.walkthroughnepal.com"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Plan Your Adventure",
  description: "Plan your Nepal adventure with Walk Through Nepal. Book trekking, tours, and travel experiences through our easy online inquiry form.",
  openGraph: {
    title: "Plan Your Adventure | Walk Through Nepal",
    description: "Start planning your Nepal trekking adventure. Submit an inquiry and our team will help create the perfect itinerary for you.",
    url: "https://walkthroughnepal.com/booking",
  },
}

export default async function BookingPage() {
  let packages: { id: string; slug: string; title: string }[] = []
  try {
    const res = await fetch(`${API}/api/v1/activity?page=1&limit=100`, { next: { revalidate: 3600 } })
    const json = await res.json()
    packages = (json.data ?? []).map((a: { id: number; slug: string; title: string }) => ({
      id: String(a.id), slug: a.slug, title: a.title,
    }))
    packages.sort((a, b) => a.title.localeCompare(b.title))
  } catch { /* empty list, form still works */ }

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="Plan Your Adventure"
        description="Ready to explore Nepal? Let us help you plan the perfect trekking and travel experience."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Booking" }]}
      />
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <BookingForm packages={packages} />
        </div>
      </section>
    </main>
  )
}
