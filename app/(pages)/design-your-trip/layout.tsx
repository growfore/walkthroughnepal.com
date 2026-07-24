import type { Metadata } from "next"
import { BreadcrumbJsonLd } from "@/components/json-ld"

export const metadata: Metadata = {
  title: "Plan Your Custom Itinerary",
  description:
    "Design your perfect Nepal trek with Walk Through Nepal. Tell us your preferences and we'll craft a custom itinerary just for you.",
  keywords: ["custom Nepal trek", "plan Nepal trip", "personalized Nepal itinerary", "custom Himalayan adventure"],
  alternates: { canonical: "/design-your-trip" },
  openGraph: {
    title: "Plan Your Custom Itinerary | Walk Through Nepal",
    description:
      "Design your perfect Nepal trek. Tell us your preferences and we'll craft a custom itinerary.",
    url: "https://walkthroughnepal.com/design-your-trip",
  },
}

export default function DesignYourTripLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <BreadcrumbJsonLd items={[{ label: "Plan Your Trip" }]} />
      {children}
    </>
  )
}
