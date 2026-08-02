"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"
import { TripCard } from "@/components/trip-card"

export function FeaturedTripsCarousel({
  activities,
}: {
  activities: {
    slug: string
    images: string[]
    title: string
    duration: string
    difficultyLevel: string
    price: number
    locations?: string[]
  }[]
}) {
  const ref = useRef<HTMLDivElement>(null)

  function scroll(dir: number) {
    const el = ref.current
    el?.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" })
  }

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-md text-navy hover:bg-border"
        aria-label="Previous trips"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button
        onClick={() => scroll(1)}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card shadow-md text-navy hover:bg-border"
        aria-label="Next trips"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {activities.map((a) => (
          <TripCard key={a.slug} activity={a} compact />
        ))}
      </div>
    </div>
  )
}
