import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getActivityBySlug, getAllActivitySlugs, parseItineraryVariants } from "@/lib/api"
import { TripPrintPage } from "@/components/trip-print-page"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllActivitySlugs().then((slugs) => slugs.map((slug) => ({ slug })))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: "Print Itinerary",
    robots: { index: false, follow: false },
    alternates: { canonical: `/trip/${slug}` },
  }
}

export default async function TripPrintRoute({ params }: Props) {
  const { slug } = await params

  let pkg
  try {
    const res = await getActivityBySlug(slug)
    pkg = res.data
  } catch {
    notFound()
  }

  const itineraryVariants = parseItineraryVariants(pkg.itinerary as unknown)

  return <TripPrintPage pkg={pkg} itineraryVariants={itineraryVariants} />
}
