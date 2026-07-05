import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Plan Your Custom Itinerary",
  description:
    "Design your perfect Nepal trek with Walk Through Nepal. Tell us your preferences and we'll craft a custom itinerary just for you.",
}

export default function DesignYourTripLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
