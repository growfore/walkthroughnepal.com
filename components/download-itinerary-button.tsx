"use client"

import { Printer } from "lucide-react"
import Link from "next/link"

export function DownloadItineraryButton({
  slug,
}: {
  title: string
  slug: string
}) {
  return (
    <Link
      href={`/trip/${slug}/print`}
      target="_blank"
      className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-lgfont-medium text-muted-foreground hover:bg-muted hover:text-navy transition-colors "
    >
      <Printer className="h-4 w-4" />
      View & Print Itinerary
    </Link>
  )
}
