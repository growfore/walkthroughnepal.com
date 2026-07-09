import type { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import { PageHero } from "@/components/page-hero"
import { BookingForm } from "@/components/booking-form"
import { getActivityBySlug, getSlots } from "@/lib/api"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Book Your Trip",
  description: "Complete your booking for an unforgettable Nepal adventure.",
  alternates: { canonical: "/booking" },
  openGraph: {
    title: "Book Your Trip | Walk Through Nepal",
    description: "Complete your booking for an unforgettable Nepal adventure.",
    url: "https://walkthroughnepal.com/booking",
  },
}

type Props = { searchParams: Promise<{ trip?: string; slot?: string }> }

export default async function BookingPage({ searchParams }: Props) {
  const params = await searchParams
  if (!params.trip || !params.slot) redirect("/explore")

  const slotId = Number(params.slot)
  if (!Number.isInteger(slotId)) redirect("/explore")

  let activity, slot
  try {
    const res = await getActivityBySlug(params.trip)
    activity = res.data
    const slotRes = await getSlots(activity.id)
    slot = slotRes.data.slots.find((s) => s.id === slotId)
    if (!slot) notFound()
  } catch {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <PageHero
        title="Book Your Trip"
        description={`Secure your spot on ${activity.title}`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: activity.title, href: `/trip/${params.trip}` },
          { label: "Book" },
        ]}
      />
      <section className="py-16">
        <BookingForm slot={slot} activityId={activity.id} activityTitle={activity.title} />
      </section>
    </main>
  )
}
